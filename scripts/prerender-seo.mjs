import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BANGLADESH_LOCATIONS, resolveLocationData } from "../src/data/bangladeshLocations.js";
import {
    SITE_URL,
    organizationJsonLd,
    webSiteJsonLd,
    breadcrumbJsonLd,
    faqPageJsonLd,
} from "../src/lib/jsonLd.js";
import { escapeHtml, injectSeoIntoHtml } from "../src/lib/seoHtmlInjector.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, "..", "dist");

const HOME_FAQS = [
    {
        question: "How does e-tuitionBD verify private tutors in Bangladesh?",
        answer: "Every tutor completes a 4-tier verification protocol: National ID (NID) check, university student ID and academic transcript verification (BUET, DU, DMC, CUET, SUST, NSU, BRACU), phone validation, and continuous parent review monitoring.",
    },
    {
        question: "Do parents pay any matching or agency commission on e-tuitionBD?",
        answer: "No. Parents and students pay ৳0 in agency or matching fees. You can browse verified tutors, request a free 30-minute demo class, and pay monthly tuition securely through SafePay escrow.",
    },
    {
        question: "What is the average monthly home tutor cost in Dhaka and Chattogram?",
        answer: "Monthly home tuition fees typically range from ৳4,000–৳8,000 for Primary/Junior classes, ৳6,000–৳15,000 for SSC and HSC STEM subjects, and ৳8,000–৳22,000 for Cambridge/Edexcel O & A Levels.",
    },
    {
        question: "How does SafePay escrow protection work?",
        answer: "Parents deposit tuition fees via bKash, Nagad, Rocket, or Bank Transfer into platform escrow at the start of the month. Funds are disbursed to the tutor only after confirmed tutoring sessions, backed by a free replacement guarantee.",
    },
];

const EARNINGS_FAQS = [
    {
        question: "How much does eTuitionHub deduct from my tuition salary?",
        answer: "For home/monthly tuitions, eTuitionHub charges only a 20% platform fee on Month 1 (lowered to 12% for verified premium tutors). Unlike traditional agencies that take 50% to 60%, subsequent months are 100% yours with 0% deductions.",
    },
    {
        question: "How and when do tutors get paid?",
        answer: "Parents deposit tuition fees into platform escrow at the start of tuition. Once sessions are completed and verified, your earnings are transferred directly to your bKash, Nagad, or Bangladeshi bank account within 24 hours.",
    },
    {
        question: "Are there any registration or joining fees for tutors?",
        answer: "Zero. Registering, building your verified tutor profile, and applying to tuition jobs on eTuitionHub is 100% free.",
    },
];

function buildCityNavigationHtml() {
    const links = Object.entries(BANGLADESH_LOCATIONS)
        .map(
            ([slug, cfg]) =>
                `<a href="/tutors/${escapeHtml(slug)}">Tutors in ${escapeHtml(cfg.name)}</a>`
        )
        .join(" · ");
    return `<nav aria-label="Regional Tutor Directories" class="text-xs pt-4">${links}</nav>`;
}

function buildCityBenchmarksTableHtml(loc) {
    const isDhaka = loc.canonicalCitySlug === "dhaka";
    const rows = [
        ["Primary (Class 1–5)", "Bangla Medium / English Version", "3–4 days / week", isDhaka ? "৳3,500 – ৳6,500 / mo" : "৳3,000 – ৳5,500 / mo"],
        ["Junior Secondary (Class 6–8)", "NCTB / Cambridge Checkpoint", "3–4 days / week", isDhaka ? "৳4,500 – ৳8,500 / mo" : "৳3,500 – ৳7,000 / mo"],
        ["SSC / Class 9–10 (Science & Math)", "Bangla Medium / English Version", "3–4 days / week", isDhaka ? "৳6,000 – ৳10,000 / mo" : "৳4,500 – ৳8,500 / mo"],
        ["HSC / Class 11–12 (STEM)", "Physics, Chemistry, Higher Math", "3–4 days / week", isDhaka ? "৳8,000 – ৳15,000 / mo" : "৳6,000 – ৳12,000 / mo"],
        ["O Levels / IGCSE & A Levels", "Cambridge (CAIE) / Pearson Edexcel", "3 days / week", isDhaka ? "৳10,000 – ৳22,000 / mo" : "৳8,000 – ৳16,000 / mo"],
        ["University Admission Prep", "BUET / Medical / DU / IBA", "3–4 days / week", isDhaka ? "৳9,000 – ৳18,000 / mo" : "৳7,000 – ৳14,000 / mo"],
    ];

    return `
      <table>
        <caption>2026 Monthly Home &amp; Online Tuition Rate Benchmarks in ${escapeHtml(loc.displayName)}</caption>
        <thead>
          <tr>
            <th scope="col">Academic Level</th>
            <th scope="col">Curriculum</th>
            <th scope="col">Schedule</th>
            <th scope="col">Monthly Fee (BDT)</th>
          </tr>
        </thead>
        <tbody>
          ${rows
              .map(
                  ([lvl, curr, sched, rate]) =>
                      `<tr><td>${escapeHtml(lvl)}</td><td>${escapeHtml(curr)}</td><td>${escapeHtml(sched)}</td><td>${escapeHtml(rate)}</td></tr>`
              )
              .join("\n          ")}
        </tbody>
      </table>`;
}

function buildCityRouteDefinition(citySlug, thanaSlug = "") {
    const loc = resolveLocationData(citySlug, thanaSlug);
    const routePath = thanaSlug ? `/tutors/${citySlug}/${thanaSlug}` : `/tutors/${citySlug}`;
    const canonicalUrl = `${SITE_URL}${routePath}`;

    const crumbs = [
        { name: "Home", url: "/" },
        { name: "Tutors", url: "/tutors" },
        { name: `Tutors in ${loc.cityName}`, url: `/tutors/${loc.canonicalCitySlug}` },
    ];
    if (loc.thanaName && loc.thanaSlug) {
        crumbs.push({
            name: `Tutors in ${loc.thanaName}`,
            url: `/tutors/${loc.canonicalCitySlug}/${loc.thanaSlug}`,
        });
    }

    const localFaqs = [
        {
            question: `What is the average home tutor fee in ${loc.displayName}?`,
            answer: `Home tutor rates in ${loc.displayName} typically range between ${loc.averageRate} depending on the student's class (Primary, Secondary, SSC, HSC, O/A Levels) and subjects. English Medium and specialized STEM/Admission prep often command higher rates.`,
        },
        {
            question: `How does the 100% Parent Guarantee work for parents in ${loc.displayName}?`,
            answer: `Your first 30-minute demo session is completely free. Tuition fees are held securely in platform escrow and disbursed only after you confirm satisfaction, with free replacement or refund protection.`,
        },
        {
            question: `How are tutors serving ${loc.displayName} verified?`,
            answer: `All tutors undergo our 4-tier verification protocol: National ID (NID) authentication, university student ID & graduation certificate verification (BUET, DU, DMC, CUET, SUST, NSU), contact validation, and continuous trust-score monitoring.`,
        },
        {
            question: `Can I hire a Cambridge or Edexcel English Medium tutor in ${loc.displayName}?`,
            answer: `Yes, verified O-Level, A-Level, IGCSE, and English Version specialists across ${loc.displayName} are available for both in-home lessons and 1-on-1 online tutoring.`,
        },
    ];

    const thanaLinks = (loc.thanas || [])
        .map(
            (t) =>
                `<a href="/tutors/${escapeHtml(loc.canonicalCitySlug)}/${escapeHtml(t.slug)}">Tutors in ${escapeHtml(t.name)}</a>`
        )
        .join(" · ");

    const bodyHtml = `
    <article data-seo-prerender="city" class="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-6">
      <nav aria-label="Breadcrumb" class="text-xs">
        <a href="/">Home</a> / <a href="/tutors">Tutors</a> / <span>${escapeHtml(loc.displayName)}</span>
      </nav>
      <h1 class="text-3xl font-bold">Verified Home &amp; Online Tutors in ${escapeHtml(loc.displayName)}</h1>
      <p>
        Connect with background-checked private tutors in ${escapeHtml(loc.displayName)} from leading Bangladeshi universities.
        Monthly home and online tuition rates in ${escapeHtml(loc.displayName)} average <strong>${escapeHtml(loc.averageRate)}</strong>,
        with a free 30-minute trial class, SafePay escrow protection, and zero matching fees for parents.
      </p>
      <p>${escapeHtml(loc.description)}</p>
      <h2>How much does a private home tutor cost in ${escapeHtml(loc.displayName)}?</h2>
      ${buildCityBenchmarksTableHtml(loc)}
      <h2>Tuition Guidance &amp; FAQs in ${escapeHtml(loc.displayName)}</h2>
      <dl>
        ${localFaqs
            .map(
                (f) =>
                    `<dt><strong>${escapeHtml(f.question)}</strong></dt><dd>${escapeHtml(f.answer)}</dd>`
            )
            .join("\n        ")}
      </dl>
      ${thanaLinks ? `<nav aria-label="Popular Areas in ${escapeHtml(loc.cityName)}">${thanaLinks}</nav>` : ""}
      ${buildCityNavigationHtml()}
    </article>`;

    return {
        routePath,
        seo: {
            title: `Best Home & Online Tutors in ${loc.displayName} | 100% Parent Guarantee`,
            description: `Find verified, top-rated home and online tutors in ${loc.displayName}. Background-checked BUET, DU, and English Medium educators. Free 1st demo session & escrow safe.`,
            keywords: `tutors in ${loc.displayName}, home tutor ${loc.displayName}, online tuition ${loc.cityName}, private tutor ${loc.thanaName || loc.cityName}, English medium tutor ${loc.displayName}`,
            canonicalUrl,
            jsonLd: [breadcrumbJsonLd(crumbs), faqPageJsonLd(localFaqs)],
            bodyHtml,
        },
    };
}

function getStaticRoutes() {
    const cityNav = buildCityNavigationHtml();
    return [
        {
            routePath: "/",
            seo: {
                title: "Find Private Tutors in Bangladesh | Home Tuition – eTuitionBD",
                description:
                    "Book verified private tutors in Dhaka, Chattogram & across Bangladesh. No agent fees. Direct contact. Browse 2,500+ tutors by subject & area — free to join.",
                keywords:
                    "tutor, online tutor, home tutor, bangladesh tuition, e-tuitionBD, find tutors, home tuition dhaka, home tutor chattogram",
                canonicalUrl: `${SITE_URL}/`,
                jsonLd: [organizationJsonLd(), webSiteJsonLd(), faqPageJsonLd(HOME_FAQS)],
                bodyHtml: `
    <article data-seo-prerender="home" class="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-6">
      <h1 class="text-3xl font-bold">Find Verified Private Home &amp; Online Tutors Across Bangladesh</h1>
      <p>
        e-tuitionBD (eTuitionHub) connects students and parents in Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, and all 8 divisions of Bangladesh with NID- and university-verified private educators across Bangla Medium, English Version, Cambridge/Edexcel O &amp; A Levels, and University Admission prep—with zero parent agency fees and SafePay escrow protection.
      </p>
      <h2>Frequently Asked Questions</h2>
      <dl>
        ${HOME_FAQS.map((f) => `<dt><strong>${escapeHtml(f.question)}</strong></dt><dd>${escapeHtml(f.answer)}</dd>`).join("\n        ")}
      </dl>
      <nav aria-label="Primary Directories">
        <a href="/tutors">Browse Verified Tutors</a> · <a href="/tuitions">Available Tuition Jobs</a> · <a href="/organizations">Coaching Centers &amp; Institutions</a> · <a href="/tutor-earnings">Tutor Earnings Calculator</a> · <a href="/become-tutor">Become a Tutor</a> · <a href="/testimonials">Parent Reviews</a> · <a href="/about">About Us</a> · <a href="/contact">Contact</a>
      </nav>
      ${cityNav}
    </article>`,
            },
        },
        {
            routePath: "/tutors",
            seo: {
                title: "Browse Verified Home & Online Tutors in Bangladesh | e-tuitionBD",
                description:
                    "Filter 2,500+ background-checked BUET, DU, DMC, CUET & English Medium tutors by subject, class, curriculum, budget, and area across Bangladesh.",
                canonicalUrl: `${SITE_URL}/tutors`,
                jsonLd: [
                    breadcrumbJsonLd([
                        { name: "Home", url: "/" },
                        { name: "Find Tutors", url: "/tutors" },
                    ]),
                ],
                bodyHtml: `
    <article data-seo-prerender="tutors" class="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-4">
      <h1 class="text-3xl font-bold">Browse Verified Private Tutors Across Bangladesh</h1>
      <p>Compare background-checked educators for Mathematics, Physics, Chemistry, Biology, ICT, Spoken English, O/A Levels, SSC, HSC, and University Admission prep with free 30-minute demo sessions and zero parent commission.</p>
      ${cityNav}
    </article>`,
            },
        },
        {
            routePath: "/tuitions",
            seo: {
                title: "Available Home & Online Tuition Jobs in Bangladesh | e-tuitionBD",
                description:
                    "Apply directly to verified home and online tuition jobs in Dhaka, Chattogram, Sylhet & nationwide. Keep 80–88% in Month 1 and 100% from Month 2 onwards.",
                canonicalUrl: `${SITE_URL}/tuitions`,
                jsonLd: [
                    breadcrumbJsonLd([
                        { name: "Home", url: "/" },
                        { name: "Available Tuitions", url: "/tuitions" },
                    ]),
                ],
                bodyHtml: `
    <article data-seo-prerender="tuitions" class="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-4">
      <h1 class="text-3xl font-bold">Open Home &amp; Online Tuition Jobs in Bangladesh</h1>
      <p>Browse verified guardian tuition postings across Bangla Medium, English Version, Cambridge/Edexcel O &amp; A Levels, and Admission Coaching with transparent monthly BDT salaries and SafePay escrow protection.</p>
      <p><a href="/become-tutor">Register as a Tutor</a> · <a href="/tutor-earnings">Compare Tutor Commission Rates</a></p>
    </article>`,
            },
        },
        {
            routePath: "/tutor-earnings",
            seo: {
                title: "Tutor Earnings Calculator & Transparent Economics | eTuitionHub",
                description:
                    "Calculate your real net take-home tuition income. eTuitionHub keeps only 20% to 12% in Month 1 vs 50%+ on Caretutors and 33% on Preply. Subsequent months are 100% yours.",
                keywords:
                    "tutor earnings calculator, tuition commission bangladesh, caretutors commission comparison, etuitionhub tutor fees, private tutor salary dhaka",
                canonicalUrl: `${SITE_URL}/tutor-earnings`,
                jsonLd: [
                    breadcrumbJsonLd([
                        { name: "Home", url: "/" },
                        { name: "Tutor Earnings Calculator", url: "/tutor-earnings" },
                    ]),
                    faqPageJsonLd(EARNINGS_FAQS),
                ],
                bodyHtml: `
    <article data-seo-prerender="tutor-earnings" class="max-w-5xl mx-auto px-4 pt-24 pb-16 space-y-6">
      <h1 class="text-3xl font-bold">Bangladesh Tutor Commission Comparison &amp; Take-Home Earnings Calculator</h1>
      <p>
        eTuitionHub deducts only 20% in Month 1 (12% for verified premium tutors) and 0% in every subsequent month—compared to 50–60% first-month fees charged by traditional Bangladeshi tuition media and 18–33% recurring commissions on global platforms.
      </p>
      <table>
        <caption>Month 1 Tutor Take-Home Comparison on an ৳8,000/month Tuition in Bangladesh</caption>
        <thead>
          <tr>
            <th scope="col">Platform</th>
            <th scope="col">Month 1 Fee</th>
            <th scope="col">Month 2+ Fee</th>
            <th scope="col">Month 1 Tutor Net Income</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>eTuitionHub Premium</td><td>12%</td><td>0%</td><td>৳7,040</td></tr>
          <tr><td>eTuitionHub Standard</td><td>20%</td><td>0%</td><td>৳6,400</td></tr>
          <tr><td>Preply (Global Marketplace)</td><td>~33%</td><td>18%–33%</td><td>৳5,360</td></tr>
          <tr><td>Traditional Tuition Media / Caretutors</td><td>50%–60%</td><td>0%</td><td>৳3,200 – ৳4,000</td></tr>
        </tbody>
      </table>
    </article>`,
            },
        },
        {
            routePath: "/pricing",
            seo: {
                title: "Tutor Earnings Calculator & Transparent Economics | eTuitionHub",
                description:
                    "Transparent tuition economics for parents (0% matching fee) and tutors (80–88% Month 1 take-home, 100% Month 2+).",
                canonicalUrl: `${SITE_URL}/tutor-earnings`,
                jsonLd: [faqPageJsonLd(EARNINGS_FAQS)],
                bodyHtml: `<article data-seo-prerender="pricing" class="max-w-4xl mx-auto px-4 pt-24 pb-16"><h1 class="text-3xl font-bold">Transparent Tuition Pricing &amp; Commission Structure</h1><p>Parents pay 0% platform matching fees. See full calculator at <a href="/tutor-earnings">Tutor Earnings Calculator</a>.</p></article>`,
            },
        },
        {
            routePath: "/organizations",
            seo: {
                title: "Educational Institutions & Coaching Centers in Bangladesh | e-tuitionBD",
                description:
                    "Discover verified coaching centers, academic batches, Cambridge/Edexcel academies, and admission prep institutions across Bangladesh.",
                canonicalUrl: `${SITE_URL}/organizations`,
                jsonLd: [
                    breadcrumbJsonLd([
                        { name: "Home", url: "/" },
                        { name: "Institutions", url: "/organizations" },
                    ]),
                ],
                bodyHtml: `<article data-seo-prerender="organizations" class="max-w-4xl mx-auto px-4 pt-24 pb-16"><h1 class="text-3xl font-bold">Verified Educational Institutions &amp; Coaching Centers in Bangladesh</h1><p>Explore verified board coaching, English Medium academies, and university admission programs across Dhaka, Chattogram, Sylhet, and nationwide.</p></article>`,
            },
        },
        {
            routePath: "/become-tutor",
            seo: {
                title: "Become a Verified Private Tutor in Bangladesh | e-tuitionBD",
                description:
                    "Join Bangladesh's fairest tutor network for free. Get matched with verified home & online students, protected by SafePay escrow, and keep up to 88% in Month 1.",
                canonicalUrl: `${SITE_URL}/become-tutor`,
                jsonLd: [
                    breadcrumbJsonLd([
                        { name: "Home", url: "/" },
                        { name: "Become a Tutor", url: "/become-tutor" },
                    ]),
                ],
                bodyHtml: `<article data-seo-prerender="become-tutor" class="max-w-4xl mx-auto px-4 pt-24 pb-16"><h1 class="text-3xl font-bold">Become a Verified Tutor on e-tuitionBD</h1><p>Register for free, complete NID and university verification, and apply to verified home and online tuition jobs across Bangladesh with fast bKash/Nagad payouts.</p></article>`,
            },
        },
        {
            routePath: "/testimonials",
            seo: {
                title: "Parent & Tutor Reviews in Bangladesh | e-tuitionBD Testimonials",
                description:
                    "Read real verified reviews from parents, SSC/HSC/O-Level students, and university tutors across Bangladesh using e-tuitionBD.",
                canonicalUrl: `${SITE_URL}/testimonials`,
                jsonLd: [
                    breadcrumbJsonLd([
                        { name: "Home", url: "/" },
                        { name: "Testimonials", url: "/testimonials" },
                    ]),
                ],
                bodyHtml: `<article data-seo-prerender="testimonials" class="max-w-4xl mx-auto px-4 pt-24 pb-16"><h1 class="text-3xl font-bold">Verified Parent, Student &amp; Educator Testimonials</h1><p>Discover how families and university tutors across Dhaka, Chattogram, and Bangladesh achieve stronger academic results on e-tuitionBD.</p></article>`,
            },
        },
        {
            routePath: "/about",
            seo: {
                title: "About e-tuitionBD | Verified Private Education Marketplace in Bangladesh",
                description:
                    "Learn how e-tuitionBD eliminates unfair 60% tuition agency commissions through 4-tier tutor verification, direct matching, and SafePay escrow protection.",
                canonicalUrl: `${SITE_URL}/about`,
                jsonLd: [
                    organizationJsonLd(),
                    breadcrumbJsonLd([
                        { name: "Home", url: "/" },
                        { name: "About Us", url: "/about" },
                    ]),
                ],
                bodyHtml: `<article data-seo-prerender="about" class="max-w-4xl mx-auto px-4 pt-24 pb-16"><h1 class="text-3xl font-bold">About e-tuitionBD (eTuitionHub)</h1><p>Built in Chattogram and serving all 8 divisions of Bangladesh, e-tuitionBD connects families with verified educators transparently with zero parent matching fees.</p></article>`,
            },
        },
        {
            routePath: "/contact",
            seo: {
                title: "Contact e-tuitionBD Support | Dhaka & Chattogram, Bangladesh",
                description:
                    "Reach e-tuitionBD support for tutor matching assistance, SafePay escrow inquiries, or institutional partnerships across Bangladesh.",
                canonicalUrl: `${SITE_URL}/contact`,
                jsonLd: [
                    organizationJsonLd(),
                    breadcrumbJsonLd([
                        { name: "Home", url: "/" },
                        { name: "Contact", url: "/contact" },
                    ]),
                ],
                bodyHtml: `<article data-seo-prerender="contact" class="max-w-4xl mx-auto px-4 pt-24 pb-16"><h1 class="text-3xl font-bold">Contact e-tuitionBD Support</h1><p>Headquarters: Chattogram, Bangladesh · Phone: +880 15339-70377 · Email: mdadeel125@gmail.com</p></article>`,
            },
        },
        {
            routePath: "/docs/engineering",
            seo: {
                title: "Platform Architecture & Engineering Showcase | e-tuitionBD",
                description:
                    "Explore the technical architecture powering e-tuitionBD: SafePay escrow ledger, 4-tier verification, real-time WebRTC classrooms, and Porua AI.",
                canonicalUrl: `${SITE_URL}/docs/engineering`,
                jsonLd: [
                    breadcrumbJsonLd([
                        { name: "Home", url: "/" },
                        { name: "Engineering Showcase", url: "/docs/engineering" },
                    ]),
                ],
                bodyHtml: `<article data-seo-prerender="engineering" class="max-w-4xl mx-auto px-4 pt-24 pb-16"><h1 class="text-3xl font-bold">e-tuitionBD Engineering &amp; Trust Architecture</h1><p>Technical overview of our escrow payment pipeline, real-time tutoring sessions, and AI learning assistant.</p></article>`,
            },
        },
        {
            routePath: "/terms",
            seo: {
                title: "Terms of Service | e-tuitionBD",
                description: "Read the Terms of Service governing tutor verification, SafePay escrow payments, and platform usage on e-tuitionBD.",
                canonicalUrl: `${SITE_URL}/terms`,
                bodyHtml: `<article data-seo-prerender="terms" class="max-w-4xl mx-auto px-4 pt-24 pb-16"><h1 class="text-3xl font-bold">Terms of Service – e-tuitionBD</h1></article>`,
            },
        },
        {
            routePath: "/privacy",
            seo: {
                title: "Privacy Policy | e-tuitionBD",
                description: "Learn how e-tuitionBD protects student, parent, and tutor personal data and NID verification documents.",
                canonicalUrl: `${SITE_URL}/privacy`,
                bodyHtml: `<article data-seo-prerender="privacy" class="max-w-4xl mx-auto px-4 pt-24 pb-16"><h1 class="text-3xl font-bold">Privacy Policy – e-tuitionBD</h1></article>`,
            },
        },
    ];
}

export function prerenderDist(distDir = DIST_DIR) {
    const shellPath = path.join(distDir, "index.html");
    if (!fs.existsSync(shellPath)) {
        throw new Error(`Cannot prerender: ${shellPath} does not exist. Run vite build first.`);
    }

    const baseShell = fs.readFileSync(shellPath, "utf8");
    const routes = [...getStaticRoutes()];

    for (const [citySlug, cityConfig] of Object.entries(BANGLADESH_LOCATIONS)) {
        routes.push(buildCityRouteDefinition(citySlug));
        for (const thana of cityConfig.thanas || []) {
            routes.push(buildCityRouteDefinition(citySlug, thana.slug));
        }
    }

    let count = 0;
    for (const { routePath, seo } of routes) {
        const rendered = injectSeoIntoHtml(baseShell, seo);
        const outFile =
            routePath === "/"
                ? shellPath
                : path.join(distDir, routePath.replace(/^\/+/, ""), "index.html");
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, rendered, "utf8");
        count += 1;
    }

    console.log(`[SEO Prerender] Generated ${count} static HTML pages with embedded JSON-LD & semantic markup.`);
    return count;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    prerenderDist();
}
