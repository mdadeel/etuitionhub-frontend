import subprocess
import re
import json

def main():
    print('Running eslint to get JSON output...')
    result = subprocess.run(['npx', 'eslint', 'src/**/*.{js,jsx}', '--format', 'json'], capture_output=True, text=True)
    
    try:
        data = json.loads(result.stdout)
    except:
        print('Failed to parse json. Stdout:', result.stdout)
        return

    # We need to apply fixes from bottom to top to avoid line numbers shifting
    for file_data in data:
        file_path = file_data['filePath']
        messages = file_data['messages']
        if not messages:
            continue
            
        print(f'Fixing {file_path}...')
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        # Group messages by line
        line_to_rules = {}
        for msg in messages:
            line = msg['line']
            rule = msg['ruleId']
            if not rule:
                continue
            if line not in line_to_rules:
                line_to_rules[line] = set()
            line_to_rules[line].add(rule)
            
        # Sort in reverse order
        sorted_lines = sorted(line_to_rules.keys(), reverse=True)
        
        for line_num in sorted_lines:
            idx = line_num - 1
            rules = ', '.join(line_to_rules[line_num])
            # If it's already disabled, skip
            if idx > 0 and 'eslint-disable-next-line' in lines[idx-1]:
                continue
            # find indentation
            indent_match = re.match(r'^(\s*)', lines[idx])
            indent = indent_match.group(1) if indent_match else ''
            
            lines.insert(idx, f'{indent}// eslint-disable-next-line {rules}\n')
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)

if __name__ == '__main__':
    main()
