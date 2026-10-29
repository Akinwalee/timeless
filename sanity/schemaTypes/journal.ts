import { defineArrayMember, defineField, defineType } from "sanity";

export const journal = defineType({
  name: "journal",
  title: "Journal",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "issue", title: "Issue number", type: "string" }),
    defineField({ name: "category", title: "Category", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "date", title: "Date", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "coverImage", title: "Cover image", type: "responsiveImage", validation: (rule) => rule.required() }),
    defineField({
      name: "body",
      title: "Editorial body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "responsiveImage" }),
        defineArrayMember({ type: "imagePair" }),
        defineArrayMember({ type: "editorialQuote" }),
        defineArrayMember({ type: "editorialVideo" }),
      ],
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "nextStory", title: "Next story", type: "reference", to: [{ type: "journal" }] }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0, validation: (rule) => rule.integer() }),
  ],
  preview: {
    select: { title: "title", subtitle: "issue", media: "coverImage.image" },
  },
});
