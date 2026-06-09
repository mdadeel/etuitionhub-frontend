import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
    const siteName = "e-tuitionBD";
    const defaultTitle = "e-tuitionBD | Master Your Future with Expert Tutors";
    const defaultDescription = "Connect with top-rated educators across Bangladesh. Personalized learning tailored to your goals, pace, and schedule.";
    const canonical = window.location.origin + window.location.pathname;

    return (
        <Helmet>
            <title>{title ? `${title} | ${siteName}` : defaultTitle}</title>
            <link rel="canonical" href={canonical} />
            <meta name="description" content={description || defaultDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title ? `${title} | ${siteName}` : defaultTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title ? `${title} | ${siteName}` : defaultTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
        </Helmet>
    );
};

export default SEO;
