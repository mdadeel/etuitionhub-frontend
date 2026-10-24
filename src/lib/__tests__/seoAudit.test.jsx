import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import SEO from "../../components/shared/SEO";
import { BANGLADESH_LOCATIONS, resolveLocationData } from "../../data/bangladeshLocations";
import {
    organizationJsonLd,
    webSiteJsonLd,
    tutorProfileJsonLd,
    tuitionJobPostingJsonLd,
    organizationDetailsJsonLd,
    faqPageJsonLd,
    serializeJsonLd,
} from "../jsonLd";
import { injectSeoIntoHtml, normalizeCanonicalUrl } from "../seoHtmlInjector";
import { renderDynamicSeoHtml } from "../../../api/seo-render";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

describe("2026 Technical SEO, GEO & Crawler Infrastructure", () => {
    it("ships a well-formed public/sitemap.xml covering all cities & thanas with no disallowed URLs", () => {
        const xml = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "application/xml");
        expect(doc.querySelector("parsererror")).toBeNull();

        const locs = Array.from(doc.querySelectorAll("url > loc")).map((n) => n.textContent.trim());
        expect(locs.length).toBeGreaterThanOrEqual(70);

        // Must not include robots-blocked, auth-gated, or duplicate alias routes
        expect(locs).not.toContain("https://e-tuitionhub.vercel.app/search");
        expect(locs).not.toContain("https://e-tuitionhub.vercel.app/post-tuition");
        expect(locs).not.toContain("https://e-tuitionhub.vercel.app/pricing");

        // Must include core routes and all 11 cities + thanas
        expect(locs).toContain("https://e-tuitionhub.vercel.app/become-tutor");
        expect(locs).toContain("https://e-tuitionhub.vercel.app/tutor-earnings");
        for (const [citySlug, cfg] of Object.entries(BANGLADESH_LOCATIONS)) {
            expect(locs).toContain(`https://e-tuitionhub.vercel.app/tutors/${citySlug}`);
            for (const thana of cfg.thanas) {
                expect(locs).toContain(
                    `https://e-tuitionhub.vercel.app/tutors/${citySlug}/${thana.slug}`
                );
            }
        }
    });

    it("scopes private Disallow rules to User-agent: * in public/robots.txt and allows sitemap APIs", () => {
        const robots = fs.readFileSync(path.join(ROOT, "public/robots.txt"), "utf8");
        const groups = robots.split(/(?=^User-agent:)/m).map((g) => g.trim()).filter(Boolean);
        const wildcardGroup = groups.find((g) => g.startsWith("User-agent: *"));

        expect(wildcardGroup).toBeDefined();
        expect(wildcardGroup).toContain("Allow: /api/sitemap");
        expect(wildcardGroup).toContain("Allow: /llms.txt");
        expect(wildcardGroup).toContain("Disallow: /dashboard/");
        expect(wildcardGroup).toContain("Disallow: /admin/");
        expect(wildcardGroup).toContain("Disallow: /search");
        expect(robots).toContain("User-agent: OAI-SearchBot");
        expect(robots).toContain("User-agent: PerplexityBot");
        expect(robots).toContain("User-agent: ClaudeBot");
    });

    it("contains only valid live routes in public/llms.txt", () => {
        const llms = fs.readFileSync(path.join(ROOT, "public/llms.txt"), "utf8");
        expect(llms).not.toContain("/become-a-tutor");
        expect(llms).toContain("https://e-tuitionhub.vercel.app/become-tutor");
        expect(llms).toContain("https://e-tuitionhub.vercel.app/tutor-earnings");
    });

    it("normalizes canonical URLs cleanly and marks unknown programmatic city slugs appropriately", () => {
        expect(normalizeCanonicalUrl("/tutors?subject=Physics&page=2")).toBe(
            "https://e-tuitionhub.vercel.app/tutors"
        );
        expect(normalizeCanonicalUrl("/tutors/dhaka/dhanmondi/")).toBe(
            "https://e-tuitionhub.vercel.app/tutors/dhaka/dhanmondi"
        );
        expect(normalizeCanonicalUrl("/")).toBe("https://e-tuitionhub.vercel.app/");

        const chittagongAlias = resolveLocationData("chittagong", "khulshi");
        expect(chittagongAlias.canonicalCitySlug).toBe("chattogram");
        expect(chittagongAlias.isKnownLocation).toBe(true);

        const unknownSlug = resolveLocationData("atlantis-xyz");
        expect(unknownSlug.isKnownLocation).toBe(false);
    });

    it("renders route-aware canonicals, avoids double brand suffixes, and applies noindex via <SEO />", async () => {
        render(
            <HelmetProvider>
                <MemoryRouter initialEntries={["/pricing?utm_source=test"]}>
                    <SEO
                        title="Tutor Earnings Calculator | eTuitionHub"
                        description="Transparent economics."
                        canonicalUrl="https://e-tuitionhub.vercel.app/tutor-earnings"
                        noIndex
                    />
                </MemoryRouter>
            </HelmetProvider>
        );

        await waitFor(() => {
            expect(document.title).toBe("Tutor Earnings Calculator | eTuitionHub");
        });
        const canonical = document.head.querySelector('link[rel="canonical"]');
        expect(canonical?.getAttribute("href")).toBe("https://e-tuitionhub.vercel.app/tutor-earnings");
        const robots = document.head.querySelector('meta[name="robots"]');
        expect(robots?.getAttribute("content")).toBe("noindex, nofollow");
    });

    it("builds valid, XSS-safe JSON-LD schemas for Organization, WebSite, Tutor Profile & Tuition JobPosting", () => {
        const org = organizationJsonLd();
        expect(org.contactPoint.telephone).toBe("+880-15339-70377");
        expect(org.contactPoint.telephone).not.toContain("1700-000000");

        const site = webSiteJsonLd();
        expect(site.potentialAction.target.urlTemplate).toBe(
            "https://e-tuitionhub.vercel.app/tutors?q={search_term_string}"
        );

        const tutorSchema = tutorProfileJsonLd({
            _id: "65a111",
            displayName: "Tanvir Ahmed",
            university: "BUET",
            subjects: ["Physics", "Higher Math"],
            rating: 4.9,
            reviewCount: 14,
        });
        expect(tutorSchema["@type"]).toBe("ProfilePage");
        expect(tutorSchema.mainEntity.aggregateRating.ratingValue).toBe("4.9");
        expect(tutorSchema.mainEntity.aggregateRating.reviewCount).toBe(14);

        const jobSchema = tuitionJobPostingJsonLd({
            _id: "65b222",
            subject: "HSC Physics",
            location: "Online",
            mode: "online",
            salary: 10000,
            createdAt: "2026-10-01T00:00:00.000Z",
        });
        expect(jobSchema["@type"]).toBe("JobPosting");
        expect(jobSchema.jobLocationType).toBe("TELECOMMUTE");
        expect(jobSchema.directApply).toBe(true);
        expect(jobSchema.datePosted).toBe("2026-10-01T00:00:00.000Z");

        const orgDetails = organizationDetailsJsonLd({ name: "Udvash Academic", slug: "udvash" });
        expect(orgDetails["@type"]).toBe("EducationalOrganization");

        const faq = faqPageJsonLd([{ question: "Q?</script>", answer: "A" }]);
        const serialized = serializeJsonLd(faq).__html;
        expect(serialized).not.toContain("</script>");
    });

    it("injects dynamic Tutor & Tuition metadata, JSON-LD, and returns 404 + noindex on missing records", async () => {
        const shell = `<!doctype html><html><head><!--SEO_HEAD_START--><title>Default</title><!--SEO_HEAD_END--></head><body><div id="root"><!--SEO_BODY--></div></body></html>`;

        const mockFetch = vi.fn(async (url) => {
            if (url.includes("/api/tutors/tutor-1/reviews")) {
                return { ok: true, status: 200, json: async () => [{ rating: 5 }, { rating: 4 }] };
            }
            if (url.includes("/api/tutors/tutor-1")) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({
                        _id: "tutor-1",
                        displayName: "Nusrat Jahan",
                        university: "Dhaka University",
                        subjects: ["English", "IELTS"],
                        location: "Dhanmondi, Dhaka",
                        photoURL: "https://cdn.example.com/nusrat.jpg",
                    }),
                };
            }
            return { ok: false, status: 404, json: async () => ({}) };
        });

        const found = await renderDynamicSeoHtml({
            type: "tutor",
            id: "tutor-1",
            shellHtml: shell,
            fetchImpl: mockFetch,
        });
        expect(found.status).toBe(200);
        expect(found.html).toContain("Nusrat Jahan");
        expect(found.html).toContain("https://cdn.example.com/nusrat.jpg");
        expect(found.html).toContain('"@type":"ProfilePage"');
        expect(found.html).toContain('data-seo-prerender="tutor"');

        const missing = await renderDynamicSeoHtml({
            type: "tuition",
            id: "deleted-999",
            shellHtml: shell,
            fetchImpl: mockFetch,
        });
        expect(missing.status).toBe(404);
        expect(missing.html).toContain('content="noindex, nofollow"');

        const injectedNoComments = injectSeoIntoHtml(
            `<!doctype html><html><head><title>Old</title><meta name="twitter:site" content="@etuitionbd" /></head><body><div id="root"></div></body></html>`,
            {
                title: "Dhaka Tutors",
                description: "Verified tutors in Dhaka",
                canonicalUrl: "https://e-tuitionhub.vercel.app/tutors/dhaka",
                bodyHtml: "<h1>Dhaka</h1>",
            }
        );
        expect(injectedNoComments).toContain("<title>Dhaka Tutors | e-tuitionBD</title>");
        expect(injectedNoComments).toContain('<div id="root"><h1>Dhaka</h1></div>');
    });
});
