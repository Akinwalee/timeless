import { defineField, defineType } from "sanity";

export const imagePair = defineType({
  name: "imagePair",
  title: "Image pair",
  type: "object",
  fields: [
    defineField({ name: "left", title: "Left image", type: "responsiveImage", validation: (rule) => rule.required() }),
    defineField({ name: "right", title: "Right image", type: "responsiveImage", validation: (rule) => rule.required() }),
  ],
});

export const editorialQuote = defineType({
  name: "editorialQuote",
  title: "Quotation",
  type: "object",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "attribution", title: "Attribution", type: "string" }),
  ],
});

export const editorialVideo = defineType({
  name: "editorialVideo",
  title: "Video",
  type: "object",
  fields: [
    defineField({ name: "url", title: "Hosted video URL", type: "url", description: "Use a direct MP4 or WebM URL.", validation: (rule) => rule.required() }),
    defineField({ name: "poster", title: "Poster image", type: "responsiveImage" }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
});
