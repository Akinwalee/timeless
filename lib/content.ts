export const product = {
  slug: "essential-tee",
  name: "Timeless Essential Tee",
  shortName: "Essential Tee",
  drop: "Drop 001",
  price: "₦15,000",
  description: "A relaxed everyday tee shaped for movement, layering and your own interpretation.",
  colors: ["Black", "White", "Cream", "Navy"],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  images: [
    { src: "/images/brand/asset-008.jpg", alt: "Model wearing the white Timeless Essential Tee" },
    { src: "/images/brand/asset-014.jpg", alt: "Editorial portrait in an oversized white Timeless tee" },
    { src: "/images/brand/asset-010.jpg", alt: "Close detail of Timeless embroidery on brown cotton" },
    { src: "/images/brand/asset-015.jpg", alt: "Macro photograph of a garment sleeve and stitching" },
    { src: "/images/brand/asset-017.jpg", alt: "Macro photograph of the black tee neckline" },
    { src: "/images/brand/asset-037.jpg", alt: "Timeless woven garment label" },
  ],
};

export const stories = [
  {
    slug: "in-the-wild-akure",
    issue: "Journal 004",
    category: "In the Wild",
    date: "August 2026",
    title: "Nothing rehearsed",
    excerpt: "A quiet afternoon, a few friends and one piece moving through the city in entirely different ways.",
    image: "/images/editorial/harlem-friends.jpg",
  },
  {
    slug: "the-making-of-drop-001",
    issue: "Journal 003",
    category: "Process",
    date: "July 2026",
    title: "The weight of a simple thing",
    excerpt: "On fabric, proportion and the choices that make simplicity feel intentional.",
    image: "/images/brand/asset-010.jpg",
  },
  {
    slug: "identity-is-not-static",
    issue: "Journal 002",
    category: "Notes",
    date: "June 2026",
    title: "Identity is not static",
    excerpt: "Clothing can hold a moment without deciding who you become next.",
    image: "/images/editorial/street-portrait.jpg",
  },
  {
    slug: "first-frame",
    issue: "Journal 001",
    category: "Campaign",
    date: "June 2026",
    title: "The first frame",
    excerpt: "The visual language behind the opening Timeless campaign.",
    image: "/images/brand/asset-011.jpg",
  },
] as const;

export const values = [
  ["Identity over trends.", "We design from self-expression, not seasonal noise."],
  ["Minimal intentionality.", "Nothing is random. Every detail is reduced to what matters."],
  ["Creative freedom.", "Style should evolve, shift and surprise without restriction."],
  ["Cultural clarity.", "Rooted in our environment, fluent in a global visual language."],
] as const;
