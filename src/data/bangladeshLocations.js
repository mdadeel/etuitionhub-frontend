/**
 * Bangladesh Divisions, Cities, and Thanas Data
 * Powering programmatic local SEO, landing pages, and sitemaps.
 */

export const BANGLADESH_LOCATIONS = {
  dhaka: {
    name: "Dhaka",
    division: "Dhaka",
    description: "Dhaka is Bangladesh's primary educational hub, home to top institutions including BUET, Dhaka University, DMC, and leading English medium schools.",
    averageRate: "৳5,000 - ৳15,000/mo",
    thanas: [
      { slug: "dhanmondi", name: "Dhanmondi", popularCurricula: ["English Medium", "Bangla Medium", "O/A Level"] },
      { slug: "uttara", name: "Uttara", popularCurricula: ["English Medium", "English Version", "Cambridge"] },
      { slug: "gulshan", name: "Gulshan", popularCurricula: ["IB", "Cambridge", "Edexcel"] },
      { slug: "banani", name: "Banani", popularCurricula: ["English Medium", "O/A Level"] },
      { slug: "mirpur", name: "Mirpur", popularCurricula: ["Bangla Medium", "English Version", "SSC/HSC"] },
      { slug: "mohammadpur", name: "Mohammadpur", popularCurricula: ["Bangla Medium", "Madrasah", "Admission"] },
      { slug: "bashundhara", name: "Bashundhara", popularCurricula: ["English Medium", "North South Univ", "O/A Level"] },
      { slug: "badda", name: "Badda", popularCurricula: ["Bangla Medium", "English Version"] },
      { slug: "khilgaon", name: "Khilgaon", popularCurricula: ["Bangla Medium", "HSC Science"] },
      { slug: "shantinagar", name: "Shantinagar", popularCurricula: ["Bangla Medium", "English Medium"] },
      { slug: "malibagh", name: "Malibagh", popularCurricula: ["Bangla Medium", "Admission"] },
      { slug: "lalmatia", name: "Lalmatia", popularCurricula: ["English Medium", "Bangla Medium"] },
    ],
  },
  chattogram: {
    name: "Chattogram",
    aliases: ["chittagong"],
    division: "Chattogram",
    description: "Chattogram features prominent institutions like CUET, Chittagong University, and premier schools across Panchlaish, Agrabad, and Nasirabad.",
    averageRate: "৳4,000 - ৳12,000/mo",
    thanas: [
      { slug: "panchlaish", name: "Panchlaish", popularCurricula: ["Bangla Medium", "English Medium"] },
      { slug: "nasirabad", name: "Nasirabad", popularCurricula: ["English Medium", "O/A Level"] },
      { slug: "agrabad", name: "Agrabad", popularCurricula: ["Bangla Medium", "Commerce"] },
      { slug: "halishahar", name: "Halishahar", popularCurricula: ["Bangla Medium", "SSC/HSC"] },
      { slug: "khulshi", name: "Khulshi", popularCurricula: ["English Medium", "Cambridge"] },
      { slug: "chawkbazar", name: "Chawkbazar", popularCurricula: ["Medical Admission", "Science"] },
    ],
  },
  sylhet: {
    name: "Sylhet",
    division: "Sylhet",
    description: "Sylhet hosts SUST, Sylhet MAG Osmani Medical College, and leading English & Bangla medium academies.",
    averageRate: "৳4,000 - ৳10,000/mo",
    thanas: [
      { slug: "zindabazar", name: "Zindabazar", popularCurricula: ["Bangla Medium", "English Medium"] },
      { slug: "amberkhana", name: "Amberkhana", popularCurricula: ["Science", "Admission"] },
      { slug: "shahjalal-upashahar", name: "Shahjalal Upashahar", popularCurricula: ["English Medium", "SSC/HSC"] },
      { slug: "subidbazar", name: "Subidbazar", popularCurricula: ["Bangla Medium"] },
      { slug: "shibganj", name: "Shibganj", popularCurricula: ["Bangla Medium", "English Version"] },
    ],
  },
  rajshahi: {
    name: "Rajshahi",
    division: "Rajshahi",
    description: "The educational capital of North Bengal, powered by Rajshahi University, RUET, and Rajshahi College.",
    averageRate: "৳3,500 - ৳9,000/mo",
    thanas: [
      { slug: "boalia", name: "Boalia", popularCurricula: ["HSC Science", "Admission"] },
      { slug: "motihar", name: "Motihar", popularCurricula: ["University Admission", "Science"] },
      { slug: "rajpara", name: "Rajpara", popularCurricula: ["Medical Coaching", "SSC"] },
    ],
  },
  khulna: {
    name: "Khulna",
    division: "Khulna",
    description: "Southern academic center featuring KUET, Khulna University, and reputable schools.",
    averageRate: "৳3,500 - ৳8,500/mo",
    thanas: [
      { slug: "sonadanga", name: "Sonadanga", popularCurricula: ["Bangla Medium", "Science"] },
      { slug: "khalishpur", name: "Khalishpur", popularCurricula: ["SSC/HSC"] },
      { slug: "daulatpur", name: "Daulatpur", popularCurricula: ["Bangla Medium"] },
    ],
  },
};

/**
 * Resolve location details by city slug (or alias) and optional thana slug
 */
export function resolveLocationData(cityParam = "", thanaParam = "") {
  const citySlug = cityParam.toLowerCase().trim();
  const thanaSlug = thanaParam.toLowerCase().trim();

  let matchedCity = BANGLADESH_LOCATIONS[citySlug];
  let canonicalCitySlug = citySlug;

  if (!matchedCity) {
    for (const [key, config] of Object.entries(BANGLADESH_LOCATIONS)) {
      if (config.aliases?.includes(citySlug)) {
        matchedCity = config;
        canonicalCitySlug = key;
        break;
      }
    }
  }

  // Fallback if city not in predefined list
  if (!matchedCity) {
    const formattedCity = citySlug ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1) : "Bangladesh";
    return {
      cityName: formattedCity,
      citySlug,
      canonicalCitySlug,
      thanaName: thanaSlug ? thanaSlug.charAt(0).toUpperCase() + thanaSlug.slice(1) : "",
      thanaSlug,
      displayName: thanaSlug ? `${thanaSlug.charAt(0).toUpperCase() + thanaSlug.slice(1)}, ${formattedCity}` : formattedCity,
      description: `Verified home and online tutors in ${formattedCity}. Hand-picked and background-checked with 100% Parent Guarantee.`,
      averageRate: "৳4,000 - ৳12,000/mo",
      thanas: [],
      queryArea: thanaSlug || formattedCity,
    };
  }

  const matchedThana = thanaSlug
    ? matchedCity.thanas.find((t) => t.slug === thanaSlug || t.name.toLowerCase() === thanaSlug)
    : null;

  const thanaName = matchedThana?.name || (thanaSlug ? thanaSlug.charAt(0).toUpperCase() + thanaSlug.slice(1) : "");
  const displayName = thanaName ? `${thanaName}, ${matchedCity.name}` : matchedCity.name;

  return {
    cityName: matchedCity.name,
    citySlug,
    canonicalCitySlug,
    thanaName,
    thanaSlug,
    displayName,
    description: matchedCity.description,
    averageRate: matchedCity.averageRate,
    thanas: matchedCity.thanas,
    popularCurricula: matchedThana?.popularCurricula || ["Bangla Medium", "English Medium", "English Version", "Admission"],
    queryArea: thanaName || matchedCity.name,
  };
}
