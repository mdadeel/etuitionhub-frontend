import os
import re
import sys

files_to_fix = [
    "src/pages/Connections.jsx",
    "src/pages/PostTuition.jsx",
    "src/components/Dashboard/BillingHistory.jsx",
    "src/components/Dashboard/StudentPayments.jsx",
    "src/components/Dashboard/TutorDashboard.jsx",
    "src/components/Dashboard/Bookmarks.jsx",
    "src/components/Dashboard/DashSettings.jsx",
    "src/components/Dashboard/AdminDashboard.jsx",
    "src/components/Dashboard/DashPayments.jsx",
    "src/components/Dashboard/StudentDashboard.jsx",
    "src/components/Dashboard/AdminTutors.jsx",
    "src/components/shared/EmptyState.jsx"
]

def refactor_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # If it doesn't have AppleUI, skip
    if 'AppleUI' not in content:
        return

    # Replace AppleBadge
    if 'AppleBadge' in content:
        content = content.replace('<AppleBadge', '<Badge')
        content = content.replace('</AppleBadge>', '</Badge>')
        if 'import { Badge }' not in content:
            content = 'import { Badge } from "@/components/ui/badge";\n' + content

    # Replace AppleButton
    if 'AppleButton' in content:
        content = content.replace('<AppleButton', '<Button')
        content = content.replace('</AppleButton>', '</Button>')
        if 'import { Button }' not in content:
            content = 'import { Button } from "@/components/ui/button";\n' + content

    # Replace AppleCard
    if 'AppleCard' in content:
        content = content.replace('<AppleCard', '<Card')
        content = content.replace('</AppleCard>', '</Card>')
        # Remove hover={...} prop from AppleCard since Card doesn't use it
        content = re.sub(r'<Card([^>]*)hover=\{[^\}]*\}([^>]*)>', r'<Card\1\2>', content)
        if 'import { Card }' not in content:
            content = 'import { Card } from "@/components/ui/card";\n' + content

    # Replace AppleInput
    if 'AppleInput' in content:
        content = content.replace('<AppleInput', '<Input')
        content = content.replace('</AppleInput>', '</Input>')
        if 'import { Input }' not in content:
            content = 'import { Input } from "@/components/ui/input";\n' + content

    # Replace AppleHeader
    # Try to match <AppleHeader title="..." subtitle="..." />
    # Also handle multiline and badge props
    def header_replacer(match):
        props = match.group(1)
        title_match = re.search(r'title=\{?(`[^`]+`|"[^"]+"|[^ \n]+)\}?', props)
        subtitle_match = re.search(r'subtitle=\{?(`[^`]+`|"[^"]+"|[^ \n]+)\}?', props)
        badge_match = re.search(r'badge=\{([^}]+)\}', props)
        
        title = title_match.group(1) if title_match else '""'
        subtitle = subtitle_match.group(1) if subtitle_match else '""'
        badge = badge_match.group(1) if badge_match else ''
        
        # Strip quotes if they are simple string literals
        if title.startswith('"') and title.endswith('"'):
            title = title[1:-1]
        elif title.startswith('`') and title.endswith('`'):
            title = '{' + title + '}'
        else:
            title = '{' + title + '}'
            
        if subtitle.startswith('"') and subtitle.endswith('"'):
            subtitle = subtitle[1:-1]
        elif subtitle.startswith('`') and subtitle.endswith('`'):
            subtitle = '{' + subtitle + '}'
        else:
            subtitle = '{' + subtitle + '}'

        res = f'<div className="mb-8"><div className="flex items-center gap-3"><h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>'
        if badge:
            res += f'{badge}'
        res += f'</div><p className="text-muted-foreground mt-2">{subtitle}</p></div>'
        return res

    content = re.sub(r'<AppleHeader\s+([^>]*?)(?:/>|></AppleHeader>)', header_replacer, content)

    # Remove the AppleUI import line completely
    content = re.sub(r'import\s+\{[^}]*\}\s+from\s+["\'][^"\']*AppleUI["\'];?\n?', '', content)
    # Also handle multi-line imports
    content = re.sub(r'import\s+\{\s*(?:[a-zA-Z]+,\s*)*[a-zA-Z]+\s*\}\s+from\s+["\'][^"\']*AppleUI["\'];?\n?', '', content)

    with open(filepath, 'w') as f:
        f.write(content)

for filepath in files_to_fix:
    try:
        refactor_file(filepath)
        print(f"Refactored {filepath}")
    except Exception as e:
        print(f"Failed {filepath}: {e}")
