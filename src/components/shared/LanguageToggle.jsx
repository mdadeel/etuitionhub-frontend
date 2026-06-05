import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const toggle = () => i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en');
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle language"
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-border hover:border-primary/50 transition-colors"
    >
      <Languages size={12} />
      {i18n.language === 'en' ? 'বাংলা' : 'English'}
    </button>
  );
};

export default LanguageToggle;
