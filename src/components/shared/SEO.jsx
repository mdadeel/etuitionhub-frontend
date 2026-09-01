import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
    const siteName = "e-tuitionBD";
    // Production canonical domain — og:image must be an absolute public URL,
    // so it is pinned to the deployed origin rather than window.location
    // (which would be correct on a custom domain but breaks previews).
    const SITE_URL = "https://e-tuitionhub.vercel.app";
    const defaultTitle = "e-tuitionBD | Master Your Future with Expert Tutors";
    const defaultDescription = "Connect with top-rated educators across Bangladesh. Personalized learning tailored to your goals, pace, and schedule.";
    const defaultImage = `${SITE_URL}/og-image.png`;
    const canonical = window.location.origin + window.location.pathname;

    // Some pages already carry the brand in their title (e.g. "… | eTuitionBD");
    // appending the site name again would produce a doubled brand suffix. Only
    // suffix when the brand is absent. Case-insensitive: titles use eTuitionBD,
    // e-tuitionBD, and e-TuitionBD interchangeably.
    const hasBrand =
        title &&
        /etuitionbd/i.test(title);
    const fullTitle =
        title && !hasBrand
            ? `${title} | ${siteName}`
            : title || defaultTitle;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <link rel="canonical" href={canonical} />
            <meta name="description" content={description || defaultDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={defaultImage} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_US" />
            <meta property="og:locale:alternate" content="bn_BD" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={defaultImage} />
            <meta name="twitter:site" content="@etuitionbd" />
        </Helmet>
    );
};

export default SEO;
