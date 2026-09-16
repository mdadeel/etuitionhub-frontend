/**
 * Structured data (JSON-LD) snippets for key pages.
 * Each function returns a JavaScript object suitable for serialization into Helmet.
 *
 * Only add schema types that reflect real content — no fake data.
 * All schemas follow https://schema.org and are validated with
 * Google's Rich Results Test.
 */

const SITE_URL = "https://e-tuitionhub.vercel.app";

/**
 * EducationalOrganization & Organization schema — placed on the homepage.
 */
export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": ["EducationalOrganization", "Organization"],
        name: "e-TuitionBD",
        alternateName: "eTuitionHub",
        url: SITE_URL,
        logo: `${SITE_URL}/og-image.png`,
        image: `${SITE_URL}/og-image.png`,
        description:
            "Bangladesh's tuition marketplace connecting students and parents with verified private tutors across all curricula.",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Dhaka",
            addressRegion: "Dhaka Division",
            addressCountry: "BD",
        },
        sameAs: [
            "https://www.facebook.com/etuitionbd",
            "https://www.linkedin.com/company/etuitionbd",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+880-1700-000000",
            contactType: "customer service",
            areaServed: "BD",
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
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
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
    if (!Array.isArray(crumbs) || crumbs.length === 0) return null;
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
 * FAQPage schema — for landing & programmatic pages.
 * @param {Array<{ question: string, answer: string }>} faqs
 */
export function faqPageJsonLd(faqs) {
    if (!Array.isArray(faqs) || faqs.length === 0) return null;
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

/**
 * ProfilePage & Person schema — for individual tutor profile pages.
 * Enables Google Rich Results with tutor qualifications, subjects, and ratings.
 * @param {Object} tutor
 * @param {Array} reviews
 */
export function tutorProfileJsonLd(tutor, reviews = []) {
    if (!tutor || !tutor.displayName) return null;

    const validReviews = Array.isArray(reviews) ? reviews : [];
    const avgRating = validReviews.length > 0
        ? (validReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / validReviews.length).toFixed(1)
        : null;

    const tutorUrl = `${SITE_URL}/tutor/${tutor._id}`;
    const subjects = Array.isArray(tutor.subjects) ? tutor.subjects : [tutor.subjects || "Academic Coaching"];

    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
            "@type": "Person",
            name: tutor.displayName,
            url: tutorUrl,
            image: tutor.photoURL || `${SITE_URL}/og-image.png`,
            jobTitle: "Private Tutor",
            description: tutor.bio || `Verified academic tutor in ${tutor.location || "Bangladesh"} specializing in ${subjects.slice(0, 3).join(", ")}.`,
            alumniOf: tutor.university || tutor.qualification ? {
                "@type": "EducationalOrganization",
                name: tutor.university || tutor.qualification,
            } : undefined,
            knowsAbout: subjects,
            address: {
                "@type": "PostalAddress",
                addressLocality: tutor.thana || tutor.location || "Dhaka",
                addressCountry: "BD",
            },
            ...(avgRating && validReviews.length > 0 ? {
                aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: avgRating,
                    reviewCount: validReviews.length,
                    bestRating: "5",
                    worstRating: "1",
                },
            } : {}),
        },
    };
}

/**
 * JobPosting schema — for open tuition posts.
 * Qualifies tuition postings for Google for Jobs rich result packs.
 * @param {Object} tuition
 */
export function tuitionJobPostingJsonLd(tuition) {
    if (!tuition || !tuition._id) return null;

    const salary = Number(tuition.salary || tuition.budget) || 5000;
    const location = tuition.location || "Dhaka";
    const postTitle = `${tuition.subject || "Academic"} Tutor Needed in ${location}`;
    const descriptionText = tuition.requirements || tuition.description || `Required experienced tutor for ${tuition.subject || "Academic coaching"} in ${location}.`;

    return {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: postTitle,
        description: `<p>${descriptionText}</p>`,
        datePosted: tuition.createdAt ? new Date(tuition.createdAt).toISOString() : new Date().toISOString(),
        validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        employmentType: "PART_TIME",
        hiringOrganization: {
            "@type": "Organization",
            name: "e-TuitionBD Verified Student/Guardian",
            sameAs: SITE_URL,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: location,
                addressCountry: "BD",
            },
        },
        baseSalary: {
            "@type": "MonetaryAmount",
            currency: "BDT",
            value: {
                "@type": "QuantitativeValue",
                value: salary,
                unitText: "MONTH",
            },
        },
    };
}

/**
 * EducationalOrganization schema — for coaching centers and schools.
 * @param {Object} org
 */
export function organizationDetailsJsonLd(org) {
    if (!org || !org.name) return null;
    const orgUrl = `${SITE_URL}/organizations/${org.slug || org._id}`;

    return {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: org.name,
        url: orgUrl,
        logo: org.profile?.logo || `${SITE_URL}/og-image.png`,
        description: org.profile?.description || `${org.name} educational campus on eTuitionBD.`,
        address: {
            "@type": "PostalAddress",
            addressLocality: org.district || org.division || "Dhaka",
            addressCountry: "BD",
        },
    };
}

/**
 * Serialize a JSON-LD object to a <script> tag string.
 * Returns an object with safe __html string (never null to prevent TypeError).
 */
export function serializeJsonLd(data) {
    if (!data) return { __html: "" };
    return {
        __html: JSON.stringify(data, null, 2),
    };
}