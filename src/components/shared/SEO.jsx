import { Helmet } from 'react-helmet-async';
import { useInRouterContext, useLocation } from 'react-router-dom';
import { SITE_URL } from '../../lib/jsonLd';
import { normalizeCanonicalUrl } from '../../lib/seoHtmlInjector';

const SEOInner = ({
    title,
    description,
    keywords,
    noIndex = false,
    noindex = false,
    canonicalUrl,
    image,
    ogType = 'website',
    pathname,
}) => {
    const shouldNoIndex = Boolean(noIndex || noindex);
    const siteName = "e-tuitionBD";
    const defaultTitle = "e-tuitionBD | Master Your Future with Expert Tutors";
    const defaultDescription = "Connect with top-rated verified educators across Bangladesh. Personalized home & online learning tailored to your goals, pace, and schedule.";
    const defaultImage = `${SITE_URL}/og-image.png`;

    const canonical = normalizeCanonicalUrl(canonicalUrl || pathname || '/');
    const ogImage = image
        ? (image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`)
        : defaultImage;

    // Avoid double brand suffix if title already contains eTuitionBD / e-tuitionBD / eTuitionHub
    const hasBrand = title && /e-?tuition(?:bd|hub)/i.test(title);
    const fullTitle = title && !hasBrand
        ? `${title} | ${siteName}`
        : title || defaultTitle;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <link rel="canonical" href={canonical} />
            <meta
                name="robots"
                content={shouldNoIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}
            />
            <meta name="description" content={description || defaultDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_US" />
            <meta property="og:locale:alternate" content="bn_BD" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:site" content="@etuitionbd" />
        </Helmet>
    );
};

const RouterSEO = (props) => {
    const location = useLocation();
    return <SEOInner {...props} pathname={location.pathname || '/'} />;
};

const SEO = (props) => {
    const inRouter = useInRouterContext();
    if (inRouter) {
        return <RouterSEO {...props} />;
    }
    const fallbackPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    return <SEOInner {...props} pathname={fallbackPath} />;
};

export default SEO;
