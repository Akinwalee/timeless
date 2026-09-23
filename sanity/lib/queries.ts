import { defineQuery } from "next-sanity";

const assetProjection = `{
  alt,
  caption,
  crop,
  hotspot,
  asset->{_id, url, metadata{dimensions, lqip}}
}`;

const responsiveImageProjection = `{
  image ${assetProjection},
  mobileImage ${assetProjection}
}`;

const productProjection = `{
  "id": _id,
  "slug": slug.current,
  name,
  shortName,
  status,
  drop,
  description,
  price,
  currency,
  sizes,
  variants[]{
    "id": _key,
    name,
    colorValue,
    primaryImage ${responsiveImageProjection},
    gallery[] ${responsiveImageProjection}
  },
  gallery[] ${responsiveImageProjection},
  materials,
  fit,
  construction,
  care,
  featured,
  order
}`;

const journalProjection = `{
  "id": _id,
  "slug": slug.current,
  issue,
  category,
  date,
  title,
  excerpt,
  coverImage ${responsiveImageProjection},
  body[]{
    ...,
    _type == "responsiveImage" => ${responsiveImageProjection},
    _type == "imagePair" => {
      ...,
      left ${responsiveImageProjection},
      right ${responsiveImageProjection}
    },
    _type == "editorialVideo" => {
      ...,
      poster ${responsiveImageProjection}
    }
  },
  featured,
  order,
  "nextSlug": nextStory->slug.current
}`;

const inTheWildProjection = `{
  "id": _id,
  "slug": slug.current,
  title,
  location,
  date,
  pieceWorn,
  "productSlug": product->slug.current,
  colour,
  images[] ${responsiveImageProjection},
  note,
  homepageFeatured,
  order
}`;

export const PRODUCTS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current)] | order(order asc, name asc) ${productProjection}`,
);

export const PRODUCT_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0] ${productProjection}`,
);

export const JOURNAL_QUERY = defineQuery(
  `*[_type == "journal" && defined(slug.current)] | order(order asc, date desc) ${journalProjection}`,
);

export const JOURNAL_ENTRY_QUERY = defineQuery(
  `*[_type == "journal" && slug.current == $slug][0] ${journalProjection}`,
);

export const IN_THE_WILD_QUERY = defineQuery(
  `*[_type == "inTheWild" && defined(slug.current)] | order(order asc, date desc) ${inTheWildProjection}`,
);

export const SETTINGS_QUERY = defineQuery(`*[_type == "globalSettings"][0]{
  navigation[]{label, href, external},
  socialLinks[]{label, href, external},
  contactEmail,
  contactPhone,
  whatsappNumber,
  "homepageProductSlug": homepageProduct->slug.current,
  "homepageInTheWildSlugs": homepageInTheWild[]->slug.current,
  "homepageJournalSlugs": homepageJournal[]->slug.current
}`);
