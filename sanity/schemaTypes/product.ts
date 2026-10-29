import { defineArrayMember, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "shortName", title: "Short name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "available",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Coming soon", value: "coming-soon" },
          { title: "Sold out", value: "sold-out" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "drop", title: "Drop or collection", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "price", title: "Price in minor currency units", type: "number", description: "For NGN, ₦15,000 is stored as 1500000 kobo.", validation: (rule) => rule.required().integer().min(0) }),
    defineField({ name: "currency", title: "Currency", type: "string", initialValue: "NGN", validation: (rule) => rule.required().uppercase().length(3) }),
    defineField({ name: "sizes", title: "Available sizes", type: "array", of: [defineArrayMember({ type: "string" })], validation: (rule) => rule.required().min(1) }),
    defineField({
      name: "variants",
      title: "Ordered colour variants",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: "colourVariant",
          title: "Colour variant",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Colour name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "colorValue", title: "Accessible CSS colour value", type: "string", description: "Use a hex value such as #0a0a0a.", validation: (rule) => rule.required().regex(/^#[0-9a-fA-F]{6}$/) }),
            defineField({ name: "primaryImage", title: "Primary image", type: "responsiveImage", validation: (rule) => rule.required() }),
            defineField({ name: "gallery", title: "Variant gallery", type: "array", of: [defineArrayMember({ type: "responsiveImage" })] }),
          ],
          preview: {
            select: { title: "name", media: "primaryImage.image" },
          },
        }),
      ],
    }),
    defineField({ name: "gallery", title: "General product gallery", type: "array", of: [defineArrayMember({ type: "responsiveImage" })] }),
    defineField({ name: "materials", title: "Materials", type: "text", rows: 3 }),
    defineField({ name: "fit", title: "Fit", type: "text", rows: 3 }),
    defineField({ name: "construction", title: "Construction", type: "text", rows: 3 }),
    defineField({ name: "care", title: "Care", type: "text", rows: 3 }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0, validation: (rule) => rule.integer() }),
  ],
  preview: {
    select: { title: "name", subtitle: "drop", media: "variants.0.primaryImage.image" },
  },
});
