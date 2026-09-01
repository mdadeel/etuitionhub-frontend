// 404 page comp
import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import SEO from '../components/shared/SEO';

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <div className="fade-up min-h-[70vh] flex items-center justify-center p-8 bg-background/30">
            <SEO title={`${t('notFound.title')} | eTuitionBD`} description={t('notFound.subtitle')} />
            <div className="text-center max-w-md">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-destructive mb-4 block italic">{t('notFound.title')}</span>
                <h1 className="text-8xl font-black text-foreground tracking-tighter mb-4 opacity-5 group-hover:opacity-10 transition-opacity">404</h1>
                <p className="text-xl font-extrabold text-foreground tracking-tight mb-2 uppercase">{t('notFound.title')}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest leading-relaxed mb-12 italic">
                    {t('notFound.subtitle')}
                </p>

                <Link to="/" className="btn-quiet-primary px-12 py-4 text-[11px]">
                    {t('notFound.go_home')}
                </Link>
            </div>
        </div>
    );
};

export default NotFound
