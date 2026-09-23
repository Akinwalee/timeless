import { defineArrayMember, defineField, defineType } from "sanity";

export const inTheWild = defineType({
  name: "inTheWild",
  title: "In the Wild",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title or person", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "pieceWorn", title: "Piece worn", type: "string" }),
    defineField({ name: "product", title: "Product reference", type: "reference", to: [{ type: "product" }] }),
    defineField({ name: "colour", title: "Colour reference", type: "string", description: "Use the colour name as configured on the product." }),
    defineField({ name: "images", title: "Image sequence", type: "array", of: [defineArrayMember({ type: "responsiveImage" })], validation: (rule) => rule.required().min(1) }),
    defineField({ name: "note", title: "Optional note", type: "text", rows: 4 }),
    defineField({ name: "homepageFeatured", title: "Feature on homepage", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0, validation: (rule) => rule.integer() }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "images.0.image" },
  },
});
