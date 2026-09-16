import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    noIndex = false,
    noindex = false,
    canonicalUrl,
    image,
}) => {
    const shouldNoIndex = Boolean(noIndex || noindex);
    const siteName = "e-tuitionBD";
    const SITE_URL = "https://e-tuitionhub.vercel.app";
    const defaultTitle = "e-tuitionBD | Master Your Future with Expert Tutors";
    const defaultDescription = "Connect with top-rated educators across Bangladesh. Personalized learning tailored to your goals, pace, and schedule.";
    const defaultImage = `${SITE_URL}/og-image.png`;

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const canonical = canonicalUrl || `${SITE_URL}${currentPath}`;
    const ogImage = image || defaultImage;

    // Avoid double brand suffix if title already contains eTuitionBD
    const hasBrand = title && /etuitionbd/i.test(title);
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

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
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

export default SEO;
