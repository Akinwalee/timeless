import type {
  GlobalSettings,
  InTheWildEntry,
  JournalEntry,
  Product,
  ResolvedImage,
} from "./types";

const image = (
  src: string,
  alt: string,
  width: number,
  height: number,
  extras: Partial<ResolvedImage> = {},
): ResolvedImage => ({ src, alt, width, height, ...extras });

export const fallbackProduct: Product = {
  id: "essential-tee",
  slug: "essential-tee",
  name: "Timeless Essential Tee",
  shortName: "Essential Tee",
  status: "available",
  drop: "Drop 001",
  price: 1_500_000,
  currency: "NGN",
  description:
    "A relaxed everyday tee shaped for movement, layering and your own interpretation.",
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  variants: [
    {
      id: "black",
      name: "Black",
      colorValue: "#0a0a0a",
      primaryImage: image(
        "/images/timeless/product/essential-tee-black-primary.jpg",
        "Model wearing the black Timeless Essential Tee on a sunlit court",
        1461,
        2200,
        { position: "50% 42%", mobilePosition: "50% 38%" },
      ),
      gallery: [
        image(
          "/images/timeless/product/essential-tee-black-lifestyle.jpg",
          "Full-length portrait in the black Timeless Essential Tee",
          1434,
          2200,
        ),
        image(
          "/images/timeless/product/essential-tee-black-detail.jpg",
          "Close detail of the embroidered mark on the black tee",
          1730,
          2200,
        ),
      ],
    },
    {
      id: "white",
      name: "White",
      colorValue: "#f4f4f0",
      primaryImage: image(
        "/images/timeless/product/essential-tee-white-primary.jpg",
        "Seated model styling the white Timeless Essential Tee",
        1657,
        2200,
        { position: "50% 42%" },
      ),
      gallery: [
        image(
          "/images/timeless/product/essential-tee-white-lifestyle.jpg",
          "Portrait in the white tee on the court",
          2013,
          2200,
        ),
        image(
          "/images/timeless/product/essential-tee-white-candid.jpg",
          "Candid portrait in the white Timeless tee",
          1626,
          2200,
        ),
      ],
    },
    {
      id: "cream",
      name: "Cream",
      colorValue: "#ddd4bc",
      primaryImage: image(
        "/images/timeless/product/essential-tee-cream-primary.jpg",
        "Model wearing the cream Timeless Essential Tee against a textured wall",
        1457,
        2200,
        { position: "50% 38%" },
      ),
      gallery: [
        image(
          "/images/timeless/product/essential-tee-cream-detail.jpg",
          "Close view of the cream tee and embroidered mark",
          1512,
          2200,
        ),
        image(
          "/images/timeless/product/essential-tee-cream-lifestyle.jpg",
          "Cream Timeless tee styled on the stadium steps",
          1457,
          2200,
        ),
      ],
    },
  ],
  gallery: [],
  materials: "Premium cotton jersey with a soft, substantial handfeel.",
  fit: "Relaxed through the body with an easy dropped shoulder.",
  construction: "Reinforced neckline and clean-finished seams for repeat wear.",
  care: "Cold wash with like colours. Line dry. Iron on reverse.",
  featured: true,
  order: 1,
};

export const fallbackInTheWild: InTheWildEntry[] = [
  {
    id: "court-assembly",
    slug: "court-assembly",
    title: "Court Assembly",
    location: "Akure, Nigeria",
    date: "August 2026",
    pieceWorn: "The Essential Tee",
    images: [
      image("/images/timeless/in-the-wild/court-assembly-01.jpg", "Three friends wearing Timeless tees on a painted court", 2200, 1789, { position: "50% 45%" }),
      image("/images/timeless/in-the-wild/court-assembly-02.jpg", "A wider group portrait on the court", 2200, 1443),
      image("/images/timeless/in-the-wild/court-assembly-03.jpg", "Three friends sharing a candid moment", 1436, 2200),
    ],
    note: "A first gathering. Different silhouettes, one shared afternoon.",
    homepageFeatured: true,
    order: 1,
  },
  {
    id: "at-the-steps",
    slug: "at-the-steps",
    title: "At the Steps",
    location: "Akure, Nigeria",
    date: "August 2026",
    pieceWorn: "Cream and black Essential Tees",
    images: [
      image("/images/timeless/in-the-wild/at-the-steps-01.jpg", "Cream Timeless tee styled on the red stadium steps", 1457, 2200),
      image("/images/timeless/in-the-wild/at-the-steps-02.jpg", "Three people arranged across the stadium steps", 1607, 2200),
      image("/images/timeless/in-the-wild/at-the-steps-03.jpg", "Two friends in dark Timeless tees photographed from below", 1607, 2200),
    ],
    note: "The controlled frame loosens as the group finds its own arrangement.",
    homepageFeatured: true,
    order: 2,
  },
  {
    id: "between-frames",
    slug: "between-frames",
    title: "Between Frames",
    location: "Akure, Nigeria",
    date: "August 2026",
    pieceWorn: "The Essential Tee",
    images: [
      image("/images/timeless/in-the-wild/between-frames-01.jpg", "Two people standing back to back on the court", 1650, 2200),
      image("/images/timeless/in-the-wild/between-frames-02.jpg", "Low-angle portrait of two friends under an open sky", 2200, 1467),
      image("/images/timeless/in-the-wild/between-frames-03.jpg", "Friends framed against a deep blue sky", 2200, 1467),
    ],
    note: "A study in posture, distance and the small shifts between poses.",
    homepageFeatured: true,
    order: 3,
  },
];

export const fallbackJournal: JournalEntry[] = [
  {
    id: "the-making-of-drop-001",
    slug: "the-making-of-drop-001",
    issue: "Journal 003",
    category: "Process",
    date: "July 2026",
    title: "The weight of a simple thing",
    excerpt: "On fabric, proportion and the choices that make simplicity feel intentional.",
    coverImage: image("/images/timeless/journal/process-detail.jpg", "Close view of the Timeless mark embroidered on black cotton", 1780, 2200),
    body: [
      { _key: "process-opening", _type: "text", paragraphs: ["A simple piece carries more decisions than it shows. Weight, proportion, shoulder and finish are all felt before they are named.", "Drop 001 began by reducing those decisions until every remaining one had a reason to stay."] },
      {
        _key: "process-pair",
        _type: "imagePair",
        left: image("/images/timeless/journal/process-packaging-01.jpg", "Timeless package carried down the stadium steps", 1591, 2200),
        right: image("/images/timeless/journal/process-packaging-02.jpg", "Timeless package against the red steps", 1586, 2200),
      },
      { _key: "process-quote", _type: "quote", quote: "The piece stayed simple so the person wearing it could do the rest.", attribution: "Drop 001 field notes" },
    ],
    featured: true,
    order: 1,
    nextSlug: "identity-is-not-static",
  },
  {
    id: "identity-is-not-static",
    slug: "identity-is-not-static",
    issue: "Journal 002",
    category: "Notes",
    date: "June 2026",
    title: "Identity is not static",
    excerpt: "Clothing can hold a moment without deciding who you become next.",
    coverImage: image("/images/timeless/journal/identity-note.jpg", "Low-angle portrait in a Timeless tee rendered in monochrome", 2200, 1467),
    body: [
      { _key: "identity-opening", _type: "text", paragraphs: ["Style is not a fixed answer. It changes with mood, company, place and the version of yourself that arrives that day.", "The same garment can hold all of those shifts without asking one of them to become permanent."] },
      { _key: "identity-quote", _type: "quote", quote: "No fixed form. No fixed expression.", attribution: "Timeless Notes" },
    ],
    featured: false,
    order: 2,
    nextSlug: "first-frame",
  },
  {
    id: "first-frame",
    slug: "first-frame",
    issue: "Journal 001",
    category: "Campaign",
    date: "June 2026",
    title: "The first frame",
    excerpt: "The visual language behind the opening Timeless campaign.",
    coverImage: image("/images/timeless/journal/first-frame.jpg", "Two friends in dark Timeless tees photographed from below", 1607, 2200),
    body: [
      { _key: "campaign-opening", _type: "text", paragraphs: ["The first campaign was built around presence rather than performance. The court, the steps and the people already carried enough visual language.", "The camera followed that energy instead of imposing a new one."] },
    ],
    featured: false,
    order: 3,
    nextSlug: "the-making-of-drop-001",
  },
];

export const fallbackSettings: GlobalSettings = {
  navigation: [
    { href: "/shop", label: "Shop" },
    { href: "/in-the-wild", label: "In the Wild" },
    { href: "/journal", label: "Journal" },
    { href: "/about", label: "About" },
  ],
  socialLinks: [{ href: "#", label: "Instagram", external: true }],
  contactEmail: "hello@timeless.ng",
  homepageProductSlug: "essential-tee",
  homepageInTheWildSlugs: fallbackInTheWild.map((entry) => entry.slug),
  homepageJournalSlugs: ["the-making-of-drop-001"],
};

export const values = [
  ["Identity over trends.", "We design from self-expression, not seasonal noise."],
  ["Minimal intentionality.", "Nothing is random. Every detail is reduced to what matters."],
  ["Creative freedom.", "Style should evolve, shift and surprise without restriction."],
  ["Cultural clarity.", "Rooted in our environment, fluent in a global visual language."],
] as const;
