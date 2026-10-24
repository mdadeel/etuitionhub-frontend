/**
 * Structured data (JSON-LD) snippets for key pages.
 * Each function returns a JavaScript object suitable for serialization into Helmet
 * or server/build-time HTML injection.
 *
 * Only add schema types that reflect real visible content — no fake data.
 * All schemas follow https://schema.org and Google's Rich Results specifications.
 */

export const SITE_URL = "https://e-tuitionhub.vercel.app";

/**
 * EducationalOrganization & Organization schema — placed on the homepage.
 * Aligned strictly with verified contact & social details rendered in Footer.jsx.
 */
export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": ["EducationalOrganization", "Organization"],
        "@id": `${SITE_URL}/#organization`,
        name: "e-tuitionBD",
        alternateName: ["eTuitionHub", "e-TuitionBD"],
        url: SITE_URL,
        logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo.png`,
        },
        image: `${SITE_URL}/og-image.png`,
        description:
            "Bangladesh's verified tuition marketplace connecting students and parents with background-checked private tutors and coaching institutions across all curricula.",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Chattogram",
            addressRegion: "Chattogram Division",
            addressCountry: "BD",
        },
        areaServed: {
            "@type": "Country",
            name: "Bangladesh",
        },
        sameAs: [
            "https://github.com/mdadeel",
            "https://linkedin.com/in/shahnawasadee1",
            "https://instagram.com/shahnawas.adeel",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+880-15339-70377",
            email: "mdadeel125@gmail.com",
            contactType: "customer service",
            areaServed: "BD",
            availableLanguage: ["en", "bn"],
        },
    };
}

/**
 * WebSite schema — placed on the homepage.
 * Uses the indexable /tutors?q= directory endpoint rather than disallowed /search.
 */
export function webSiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "e-tuitionBD",
        alternateName: "eTuitionHub",
        url: SITE_URL,
        inLanguage: ["en", "bn"],
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
        description:
            "Find verified private tutors in Bangladesh for Bangla Medium, English Version, Cambridge/Edexcel O & A Levels, and University Admission prep.",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/tutors?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

/**
 * BreadcrumbList schema — for detail & regional landing pages.
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
                : `${SITE_URL}${crumb.url.startsWith("/") ? "" : "/"}${crumb.url}`,
        })),
    };
}

/**
 * FAQPage schema — for landing & programmatic pages.
 * @param {Array<{ question: string, answer: string }>} faqs
 */
export function faqPageJsonLd(faqs) {
    if (!Array.isArray(faqs) || faqs.length === 0) return null;
    const valid = faqs.filter((f) => f && f.question && f.answer);
    if (valid.length === 0) return null;
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: valid.map((faq) => ({
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
    const fallbackCount = Number(tutor.reviewCount || tutor.totalReviews) || 0;
    const fallbackRating = Number(tutor.rating || tutor.averageRating) || 0;

    let avgRating = null;
    let totalCount = 0;

    if (validReviews.length > 0) {
        totalCount = validReviews.length;
        avgRating = (
            validReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / totalCount
        ).toFixed(1);
    } else if (fallbackCount > 0 && fallbackRating > 0) {
        totalCount = fallbackCount;
        avgRating = fallbackRating.toFixed(1);
    }

    const tutorUrl = `${SITE_URL}/tutor/${tutor._id}`;
    const subjects = Array.isArray(tutor.subjects)
        ? tutor.subjects.filter(Boolean)
        : [tutor.subjects || "Academic Coaching"];

    const profileSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url: tutorUrl,
        ...(tutor.createdAt ? { dateCreated: new Date(tutor.createdAt).toISOString() } : {}),
        ...(tutor.updatedAt ? { dateModified: new Date(tutor.updatedAt).toISOString() } : {}),
        mainEntity: {
            "@type": "Person",
            "@id": `${tutorUrl}#person`,
            name: tutor.displayName,
            url: tutorUrl,
            image: tutor.photoURL || `${SITE_URL}/og-image.png`,
            jobTitle: "Verified Private Tutor",
            description:
                tutor.bio ||
                `Verified academic tutor in ${tutor.location || "Bangladesh"} specializing in ${subjects.slice(0, 4).join(", ")}.`,
            ...(tutor.university || tutor.qualification
                ? {
                      alumniOf: {
                          "@type": "EducationalOrganization",
                          name: tutor.university || tutor.qualification,
                      },
                  }
                : {}),
            knowsAbout: subjects,
            address: {
                "@type": "PostalAddress",
                addressLocality: tutor.thana || tutor.location || "Dhaka",
                addressCountry: "BD",
            },
            ...(avgRating && totalCount > 0
                ? {
                      aggregateRating: {
                          "@type": "AggregateRating",
                          ratingValue: avgRating,
                          reviewCount: totalCount,
                          bestRating: "5",
                          worstRating: "1",
                      },
                  }
                : {}),
        },
    };

    return profileSchema;
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
    const isOnline =
        /online|remote/i.test(String(tuition.mode || "")) ||
        /online|remote/i.test(String(location));
    const postTitle = `${tuition.subject || "Academic"} Tutor Needed in ${location}`;
    const descriptionText =
        tuition.requirements ||
        tuition.description ||
        `Required experienced tutor for ${tuition.subject || "Academic coaching"} (${tuition.class || "School/College level"}) in ${location}.`;

    const postedMs = tuition.createdAt
        ? new Date(tuition.createdAt).getTime()
        : Date.UTC(2026, 0, 1);
    const safePostedMs = Number.isNaN(postedMs) ? Date.UTC(2026, 0, 1) : postedMs;
    const datePostedIso = new Date(safePostedMs).toISOString();
    const validThroughIso = tuition.validThrough
        ? new Date(tuition.validThrough).toISOString()
        : new Date(safePostedMs + 45 * 24 * 60 * 60 * 1000).toISOString();

    return {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        identifier: {
            "@type": "PropertyValue",
            name: "e-tuitionBD",
            value: String(tuition._id),
        },
        title: postTitle,
        description: `<p>${String(descriptionText).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
        datePosted: datePostedIso,
        validThrough: validThroughIso,
        employmentType: "PART_TIME",
        directApply: true,
        hiringOrganization: {
            "@type": "Organization",
            name: "e-tuitionBD Verified Guardian",
            sameAs: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: isOnline ? "Dhaka" : location,
                addressCountry: "BD",
            },
        },
        ...(isOnline
            ? {
                  jobLocationType: "TELECOMMUTE",
                  applicantLocationRequirements: {
                      "@type": "Country",
                      name: "BD",
                  },
              }
            : {}),
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
        "@id": `${orgUrl}#institution`,
        name: org.name,
        url: orgUrl,
        logo: org.profile?.logo || `${SITE_URL}/og-image.png`,
        description:
            org.profile?.description ||
            `${org.name} verified educational campus and coaching institution on e-tuitionBD.`,
        address: {
            "@type": "PostalAddress",
            addressLocality: org.profile?.district || org.district || org.division || "Dhaka",
            addressCountry: "BD",
        },
        ...(org.profile?.publicPhone || org.contact?.phone
            ? { telephone: org.profile?.publicPhone || org.contact?.phone }
            : {}),
        ...(org.profile?.publicEmail || org.contact?.email
            ? { email: org.profile?.publicEmail || org.contact?.email }
            : {}),
    };
}

/**
 * Serialize a JSON-LD object to a <script> tag string safely (escapes </script>).
 * Returns an object with safe __html string (never null to prevent TypeError).
 */
export function serializeJsonLd(data) {
    if (!data) return { __html: "" };
    return {
        __html: JSON.stringify(data, null, 2).replace(/</g, "\\u003c"),
    };
}
