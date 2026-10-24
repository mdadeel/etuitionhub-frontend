import fs from "node:fs";
import path from "node:path";
import {
    SITE_URL,
    breadcrumbJsonLd,
    tutorProfileJsonLd,
    tuitionJobPostingJsonLd,
    organizationDetailsJsonLd,
} from "../src/lib/jsonLd.js";
import { escapeHtml, injectSeoIntoHtml } from "../src/lib/seoHtmlInjector.js";

const BACKEND_URL = process.env.BACKEND_API_URL || "https://etuitionhub-backend.vercel.app";
const FETCH_TIMEOUT_MS = 2500;

let cachedShellHtml = null;

const FALLBACK_SHELL = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!--SEO_HEAD_START-->
  <title>e-tuitionBD</title>
  <!--SEO_HEAD_END-->
</head>
<body>
  <div id="root"><!--SEO_BODY--></div>
</body>
</html>`;

async function getAppShellHtml(req) {
    if (cachedShellHtml) return cachedShellHtml;

    const candidates = [
        path.join(process.cwd(), "dist", "index.html"),
        path.join(process.cwd(), "index.html"),
    ];

    for (const filePath of candidates) {
        try {
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, "utf8");
                // Only cache in production if it's the built dist shell (contains /assets/)
                if (raw.includes("/assets/")) {
                    cachedShellHtml = raw;
                    return raw;
                }
            }
        } catch {
            // Fall through to CDN fetch
        }
    }

    const host = req?.headers?.["x-forwarded-host"] || req?.headers?.host;
    const proto = req?.headers?.["x-forwarded-proto"] || "https";
    if (host) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${proto}://${host}/index.html`, {
                signal: controller.signal,
                headers: { Accept: "text/html" },
            });
            clearTimeout(timer);
            if (res.ok) {
                const text = await res.text();
                if (text.includes("<div id=\"root\"")) {
                    cachedShellHtml = text;
                    return text;
                }
            }
        } catch {
            // Fall through to fallback shell
        }
    }

    return FALLBACK_SHELL;
}

async function fetchJsonWithTimeout(url, fetchImpl = fetch) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const res = await fetchImpl(url, {
            signal: controller.signal,
            headers: { Accept: "application/json" },
        });
        if (res.status === 404) {
            return { notFound: true, data: null };
        }
        if (!res.ok) {
            return { notFound: false, error: true, data: null };
        }
        const json = await res.json();
        return { notFound: false, error: false, data: json };
    } catch {
        return { notFound: false, error: true, data: null };
    } finally {
        clearTimeout(timer);
    }
}

function buildTutorSeoPayload(id, tutor, reviews) {
    const subjects = Array.isArray(tutor.subjects)
        ? tutor.subjects.filter(Boolean)
        : [tutor.subjects || "Academic Coaching"];
    const location = tutor.thana || tutor.location || "Bangladesh";
    const institution = tutor.university || tutor.qualification || "Verified Institution";
    const canonicalUrl = `${SITE_URL}/tutor/${encodeURIComponent(tutor._id || id)}`;

    const title = `${tutor.displayName} – Verified ${subjects.slice(0, 2).join(" & ")} Tutor in ${location} | e-tuitionBD`;
    const description = (
        tutor.bio ||
        `Hire ${tutor.displayName} (${institution}) for verified home & online tuition in ${location}. Specializes in ${subjects.slice(0, 4).join(", ")}. Free 30-min trial & SafePay escrow.`
    ).slice(0, 160);

    const crumbs = breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Find Tutors", url: "/tutors" },
        { name: tutor.displayName, url: `/tutor/${encodeURIComponent(tutor._id || id)}` },
    ]);
    const profileSchema = tutorProfileJsonLd(tutor, reviews);

    const bodyHtml = `
    <article data-seo-prerender="tutor" class="max-w-4xl mx-auto px-4 pt-24 pb-16 space-y-4">
      <nav aria-label="Breadcrumb" class="text-xs text-muted-foreground">
        <a href="/">Home</a> / <a href="/tutors">Find Tutors</a> / <span>${escapeHtml(tutor.displayName)}</span>
      </nav>
      <h1 class="text-3xl font-bold">${escapeHtml(tutor.displayName)} – Verified Private Tutor in ${escapeHtml(location)}</h1>
      <p class="text-sm text-muted-foreground">
        ${escapeHtml(tutor.displayName)} is a verified private educator from ${escapeHtml(institution)} serving students in ${escapeHtml(location)} across ${escapeHtml(subjects.join(", "))}.
      </p>
      ${tutor.bio ? `<p class="text-sm leading-relaxed">${escapeHtml(tutor.bio)}</p>` : ""}
      <ul class="text-sm space-y-1">
        <li><strong>Academic Background:</strong> ${escapeHtml(institution)}</li>
        <li><strong>Subjects Taught:</strong> ${escapeHtml(subjects.join(", "))}</li>
        <li><strong>Service Area:</strong> ${escapeHtml(location)}</li>
      </ul>
      <p class="text-xs"><a href="/tutors">Browse more verified tutors in Bangladesh</a></p>
    </article>`;

    return {
        title,
        description,
        canonicalUrl,
        image: tutor.photoURL || `${SITE_URL}/og-image.png`,
        ogType: "profile",
        jsonLd: [crumbs, profileSchema],
        bodyHtml,
    };
}

function buildTuitionSeoPayload(id, tuition) {
    const subject = tuition.subject || "Academic";
    const location = tuition.location || "Bangladesh";
    const salary = Number(tuition.salary || tuition.budget) || 5000;
    const studentClass = tuition.class || "School / College";
    const canonicalUrl = `${SITE_URL}/tuition/${encodeURIComponent(tuition._id || id)}`;

    const title = `${subject} Tutor Needed in ${location} (৳${salary.toLocaleString("en-US")}/mo) | e-tuitionBD`;
    const rawDesc =
        tuition.requirements ||
        tuition.description ||
        `Apply for this verified ${subject} (${studentClass}) tuition job in ${location}. Monthly salary ৳${salary.toLocaleString("en-US")} BDT. Direct guardian contact on e-tuitionBD.`;
    const description = String(rawDesc).slice(0, 160);

    const crumbs = breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Available Tuitions", url: "/tuitions" },
        { name: `${subject} in ${location}`, url: `/tuition/${encodeURIComponent(tuition._id || id)}` },
    ]);
    const jobSchema = tuitionJobPostingJsonLd(tuition);

    const bodyHtml = `
    <article data-seo-prerender="tuition" class="max-w-4xl mx-auto px-4 pt-24 pb-16 space-y-4">
      <nav aria-label="Breadcrumb" class="text-xs text-muted-foreground">
        <a href="/">Home</a> / <a href="/tuitions">Available Tuitions</a> / <span>${escapeHtml(subject)} Tutor in ${escapeHtml(location)}</span>
      </nav>
      <h1 class="text-3xl font-bold">${escapeHtml(subject)} Tutor Required in ${escapeHtml(location)}</h1>
      <p class="text-sm text-muted-foreground">
        Verified guardian seeking a ${escapeHtml(subject)} tutor for ${escapeHtml(studentClass)} in ${escapeHtml(location)} offering ৳${escapeHtml(salary)} BDT per month.
      </p>
      <p class="text-sm leading-relaxed">${escapeHtml(rawDesc)}</p>
      <ul class="text-sm space-y-1">
        <li><strong>Subject:</strong> ${escapeHtml(subject)}</li>
        <li><strong>Class / Curriculum:</strong> ${escapeHtml(studentClass)}</li>
        <li><strong>Location:</strong> ${escapeHtml(location)}</li>
        <li><strong>Monthly Remuneration:</strong> ৳${escapeHtml(salary)} BDT / month</li>
      </ul>
      <p class="text-xs"><a href="/tuitions">Explore all open tuition jobs in Bangladesh</a> · <a href="/become-tutor">Register as a Verified Tutor</a></p>
    </article>`;

    return {
        title,
        description,
        canonicalUrl,
        image: `${SITE_URL}/og-image.png`,
        ogType: "website",
        jsonLd: [crumbs, jobSchema],
        bodyHtml,
    };
}

function buildOrganizationSeoPayload(slug, org) {
    const canonicalSlug = org.slug || slug;
    const district = org.profile?.district || org.district || org.division || "Bangladesh";
    const canonicalUrl = `${SITE_URL}/organizations/${encodeURIComponent(canonicalSlug)}`;
    const title = `${org.name} – Verified Institution in ${district} | e-tuitionBD`;
    const description = (
        org.profile?.description ||
        `Explore courses, academic batches, verified faculty, and admission details for ${org.name} (${district}) on e-tuitionBD.`
    ).slice(0, 160);

    const crumbs = breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Institutions", url: "/organizations" },
        { name: org.name, url: `/organizations/${encodeURIComponent(canonicalSlug)}` },
    ]);
    const orgSchema = organizationDetailsJsonLd(org);

    const bodyHtml = `
    <article data-seo-prerender="organization" class="max-w-4xl mx-auto px-4 pt-24 pb-16 space-y-4">
      <nav aria-label="Breadcrumb" class="text-xs text-muted-foreground">
        <a href="/">Home</a> / <a href="/organizations">Institutions</a> / <span>${escapeHtml(org.name)}</span>
      </nav>
      <h1 class="text-3xl font-bold">${escapeHtml(org.name)}</h1>
      <p class="text-sm leading-relaxed">${escapeHtml(description)}</p>
      <p class="text-xs"><a href="/organizations">Browse all verified institutions &amp; coaching centers</a></p>
    </article>`;

    return {
        title,
        description,
        canonicalUrl,
        image: org.profile?.logo || org.profile?.banner || `${SITE_URL}/og-image.png`,
        ogType: "website",
        jsonLd: [crumbs, orgSchema],
        bodyHtml,
    };
}

export async function renderDynamicSeoHtml({ type, id, shellHtml, fetchImpl = fetch }) {
    const cleanId = String(id || "").trim();
    if (!cleanId || !["tutor", "tuition", "organization"].includes(type)) {
        return {
            status: 404,
            html: injectSeoIntoHtml(shellHtml, {
                title: "Page Not Found | e-tuitionBD",
                description: "The requested listing could not be found on e-tuitionBD.",
                canonicalUrl: `${SITE_URL}/`,
                noIndex: true,
            }),
        };
    }

    if (type === "tutor") {
        const [tutorResult, reviewsResult] = await Promise.all([
            fetchJsonWithTimeout(`${BACKEND_URL}/api/tutors/${encodeURIComponent(cleanId)}`, fetchImpl),
            fetchJsonWithTimeout(`${BACKEND_URL}/api/tutors/${encodeURIComponent(cleanId)}/reviews`, fetchImpl),
        ]);

        const tutor = tutorResult.data?.data || tutorResult.data;
        if (tutorResult.notFound || (!tutorResult.error && (!tutor || !tutor.displayName))) {
            return {
                status: 404,
                html: injectSeoIntoHtml(shellHtml, {
                    title: "Tutor Profile Not Found | e-tuitionBD",
                    description: "This tutor profile is no longer available. Browse 2,500+ verified tutors across Bangladesh.",
                    canonicalUrl: `${SITE_URL}/tutors`,
                    noIndex: true,
                }),
            };
        }

        if (tutor && tutor.displayName) {
            const reviews = Array.isArray(reviewsResult.data)
                ? reviewsResult.data
                : Array.isArray(reviewsResult.data?.data)
                ? reviewsResult.data.data
                : [];
            return {
                status: 200,
                html: injectSeoIntoHtml(shellHtml, buildTutorSeoPayload(cleanId, tutor, reviews)),
            };
        }
    }

    if (type === "tuition") {
        const tuitionResult = await fetchJsonWithTimeout(
            `${BACKEND_URL}/api/tuitions/${encodeURIComponent(cleanId)}`,
            fetchImpl
        );
        const tuition = tuitionResult.data?.data || tuitionResult.data;

        if (tuitionResult.notFound || (!tuitionResult.error && (!tuition || !tuition._id))) {
            return {
                status: 404,
                html: injectSeoIntoHtml(shellHtml, {
                    title: "Tuition Job Filled or Closed | e-tuitionBD",
                    description: "This tuition job post has been filled or removed. View live open tuition jobs across Bangladesh.",
                    canonicalUrl: `${SITE_URL}/tuitions`,
                    noIndex: true,
                }),
            };
        }

        if (tuition && tuition._id) {
            return {
                status: 200,
                html: injectSeoIntoHtml(shellHtml, buildTuitionSeoPayload(cleanId, tuition)),
            };
        }
    }

    if (type === "organization") {
        const orgResult = await fetchJsonWithTimeout(
            `${BACKEND_URL}/api/v1/organizations/slug/${encodeURIComponent(cleanId)}`,
            fetchImpl
        );
        const org = orgResult.data?.data || orgResult.data;

        if (orgResult.notFound || (!orgResult.error && (!org || !org.name))) {
            return {
                status: 404,
                html: injectSeoIntoHtml(shellHtml, {
                    title: "Institution Not Found | e-tuitionBD",
                    description: "The requested coaching center or institution was not found on e-tuitionBD.",
                    canonicalUrl: `${SITE_URL}/organizations`,
                    noIndex: true,
                }),
            };
        }

        if (org && org.name) {
            return {
                status: 200,
                html: injectSeoIntoHtml(shellHtml, buildOrganizationSeoPayload(cleanId, org)),
            };
        }
    }

    // Network/timeout fallback: return 200 app shell so client-side React can still load
    const fallbackPath =
        type === "organization"
            ? `/organizations/${encodeURIComponent(cleanId)}`
            : `/${type}/${encodeURIComponent(cleanId)}`;
    return {
        status: 200,
        isFallback: true,
        html: injectSeoIntoHtml(shellHtml, {
            title: "e-tuitionBD | Verified Private Education & Tutors in Bangladesh",
            description: "Connect with verified private tutors and coaching institutions across Bangladesh.",
            canonicalUrl: `${SITE_URL}${fallbackPath}`,
        }),
    };
}

export default async function handler(req, res) {
    const type = Array.isArray(req.query?.type) ? req.query.type[0] : req.query?.type;
    const id = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id;

    const shellHtml = await getAppShellHtml(req);
    const result = await renderDynamicSeoHtml({ type, id, shellHtml });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    if (result.status === 200 && !result.isFallback) {
        res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    } else {
        res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60");
    }
    res.status(result.status).send(result.html);
}
