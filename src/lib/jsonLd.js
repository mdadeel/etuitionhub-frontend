/**
 * Structured data (JSON-LD) snippets for key pages.
 * Each function returns a <script> tag suitable for use with Helmet.
 *
 * Only add schema types that reflect real content — no fake data.
 * All schemas follow https://schema.org and are validated with
 * Google's Rich Results Test.
 */

const SITE_URL = "https://e-tuitionhub.vercel.app";

/**
 * Organization schema — placed on the homepage.
 */
export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "e-TuitionBD",
        url: SITE_URL,
        logo: `${SITE_URL}/og-image.png`,
        description:
            "Bangladesh's tuition marketplace connecting students and parents with verified private tutors across all curricula.",
        sameAs: [
            // Add social profile URLs when they exist
        ],
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "",
            contactType: "customer service",
            availableLanguage: ["en", "bn"],
        },
    };
}

/**
 * WebSite schema — placed on the homepage.
 * Includes searchAction for site search Sitelinks Search Box.
 */
export function webSiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "e-TuitionBD",
        url: SITE_URL,
        description:
            "Find verified private tutors in Bangladesh for SSC, HSC, O-Level, A-Level, and university prep.",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/tutors?area={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

/**
 * BreadcrumbList schema — for detail pages.
 * @param {Array<{ name: string, url: string }>} crumbs
 */
export function breadcrumbJsonLd(crumbs) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: crumb.name,
            item: crumb.url.startsWith("http")
                ? crumb.url
                : `${SITE_URL}${crumb.url}`,
        })),
    };
}

/**
 * Serialize a JSON-LD object to a <script> tag string.
 * Returns null if the object is empty/falsy.
 */
export function serializeJsonLd(data) {
    if (!data) return null;
    return {
        __html: JSON.stringify(data, null, 2),
    };
}