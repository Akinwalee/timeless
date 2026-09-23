export type ResolvedImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  mobileSrc?: string;
  position?: string;
  mobilePosition?: string;
  caption?: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  colorValue: string;
  primaryImage: ResolvedImage;
  gallery: ResolvedImage[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  status: "available" | "coming-soon" | "sold-out" | "archived";
  drop: string;
  description: string;
  price: number;
  currency: string;
  sizes: string[];
  variants: ProductVariant[];
  gallery: ResolvedImage[];
  materials: string;
  fit: string;
  construction: string;
  care: string;
  featured: boolean;
  order: number;
};

export type JournalTextBlock = {
  _key: string;
  _type: "text";
  heading?: string;
  paragraphs: string[];
};

export type JournalImageBlock = {
  _key: string;
  _type: "image";
  image: ResolvedImage;
};

export type JournalImagePairBlock = {
  _key: string;
  _type: "imagePair";
  left: ResolvedImage;
  right: ResolvedImage;
};

export type JournalQuoteBlock = {
  _key: string;
  _type: "quote";
  quote: string;
  attribution?: string;
};

export type JournalVideoBlock = {
  _key: string;
  _type: "video";
  url: string;
  caption?: string;
  poster?: ResolvedImage;
};

export type JournalPortableTextBlock = {
  _key: string;
  _type: "block";
  [key: string]: unknown;
};

export type JournalBlock =
  | JournalTextBlock
  | JournalImageBlock
  | JournalImagePairBlock
  | JournalQuoteBlock
  | JournalVideoBlock
  | JournalPortableTextBlock;

export type JournalEntry = {
  id: string;
  slug: string;
  issue: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  coverImage: ResolvedImage;
  body: JournalBlock[];
  featured: boolean;
  order: number;
  nextSlug?: string;
};

export type InTheWildEntry = {
  id: string;
  slug: string;
  title: string;
  location: string;
  date: string;
  pieceWorn: string;
  productSlug?: string;
  colour?: string;
  images: ResolvedImage[];
  note?: string;
  homepageFeatured: boolean;
  order: number;
};

export type NavigationLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type GlobalSettings = {
  navigation: NavigationLink[];
  socialLinks: NavigationLink[];
  contactEmail: string;
  contactPhone?: string;
  whatsappNumber?: string;
  homepageProductSlug?: string;
  homepageInTheWildSlugs: string[];
  homepageJournalSlugs: string[];
};

export type HomepageContent = {
  product: Product | null;
  inTheWild: InTheWildEntry[];
  journal: JournalEntry | null;
  settings: GlobalSettings;
};
