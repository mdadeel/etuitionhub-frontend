import { SITE_URL } from "./jsonLd.js";

/**
 * Normalize a path or absolute URL into a clean canonical URL without query params or trailing slashes.
 */
export function normalizeCanonicalUrl(rawUrl) {
    if (!rawUrl) return `${SITE_URL}/`;
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        try {
            const parsed = new URL(rawUrl);
            const cleanPath = parsed.pathname === "/"
                ? "/"
                : parsed.pathname.replace(/\/+$/, "");
            return `${parsed.origin}${cleanPath}`;
        } catch {
            return rawUrl;
        }
    }
    const withLeadingSlash = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
    const cleanPath = withLeadingSlash === "/"
        ? "/"
        : withLeadingSlash.split("?")[0].replace(/\/+$/, "");
    return `${SITE_URL}${cleanPath}`;
}

/**
 * Escape text safely for HTML text nodes and attribute values.
 */
export function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Safely serialize JSON-LD for embedding inside <script type="application/ld+json">.
 */
export function safeJsonLdScript(schema) {
    if (!schema) return "";
    const json = JSON.stringify(schema).replace(/</g, "\\u003c");
    return `<script type="application/ld+json">${json}</script>`;
}

/**
 * Build the complete <head> SEO block (title, canonical, robots, description, OG, Twitter, JSON-LD).
 */
export function buildSeoHeadHtml({
    title,
    description,
    canonicalUrl,
    keywords = "",
    image = `${SITE_URL}/og-image.png`,
    ogType = "website",
    noIndex = false,
    jsonLd = [],
}) {
    const siteName = "e-tuitionBD";
    const hasBrand = title && /e-?tuition(?:bd|hub)/i.test(title);
    const fullTitle = title && !hasBrand ? `${title} | ${siteName}` : title || `${siteName} | Verified Private Tutors in Bangladesh`;
    const safeDesc =
        description ||
        "Connect with background-checked private tutors across Bangladesh. Zero parent agent fees, free 30-min demo session, and SafePay escrow protection.";
    const canonical = canonicalUrl || `${SITE_URL}/`;
    const ogImage = image
        ? image.startsWith("http")
            ? image
            : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
        : `${SITE_URL}/og-image.png`;
    const robots = noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    const schemas = (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
        .filter(Boolean)
        .map(safeJsonLdScript)
        .join("\n  ");

    return [
        `<title>${escapeHtml(fullTitle)}</title>`,
        `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
        `<meta name="robots" content="${escapeHtml(robots)}" />`,
        `<meta name="description" content="${escapeHtml(safeDesc)}" />`,
        keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : "",
        `<meta property="og:type" content="${escapeHtml(ogType)}" />`,
        `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
        `<meta property="og:description" content="${escapeHtml(safeDesc)}" />`,
        `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
        `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
        `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
        `<meta property="og:locale" content="en_US" />`,
        `<meta property="og:locale:alternate" content="bn_BD" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
        `<meta name="twitter:description" content="${escapeHtml(safeDesc)}" />`,
        `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
        `<meta name="twitter:site" content="@etuitionbd" />`,
        schemas,
    ]
        .filter(Boolean)
        .join("\n  ");
}

/**
 * Inject route-specific <head> metadata, JSON-LD scripts, and semantic #root HTML
 * into the built Vite index.html shell. Works both when comment markers are preserved
 * and when HTML comments are stripped by minifiers.
 */
export function injectSeoIntoHtml(shellHtml, seoOptions) {
    const headBlock = buildSeoHeadHtml(seoOptions);
    const bodyHtml = seoOptions.bodyHtml || "";

    let html = shellHtml;

    if (html.includes("<!--SEO_HEAD_START-->") && html.includes("<!--SEO_HEAD_END-->")) {
        html = html.replace(
            /<!--SEO_HEAD_START-->[\s\S]*?<!--SEO_HEAD_END-->/,
            `<!--SEO_HEAD_START-->\n  ${headBlock}\n  <!--SEO_HEAD_END-->`
        );
    } else if (/<title>[\s\S]*?<meta\s+name=["']twitter:site["'][^>]*>/i.test(html)) {
        html = html.replace(
            /<title>[\s\S]*?<meta\s+name=["']twitter:site["'][^>]*>/i,
            headBlock
        );
    } else {
        html = html.replace(/<\/head>/i, `  ${headBlock}\n</head>`);
    }

    if (bodyHtml) {
        if (html.includes("<!--SEO_BODY-->")) {
            html = html.replace("<!--SEO_BODY-->", bodyHtml);
        } else {
            html = html.replace(
                /<div\s+id=["']root["']\s*><\/div>/i,
                `<div id="root">${bodyHtml}</div>`
            );
        }
    } else {
        html = html.replace("<!--SEO_BODY-->", "");
    }

    return html;
}
