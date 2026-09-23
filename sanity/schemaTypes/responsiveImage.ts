import { defineField, defineType } from "sanity";

const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
    ],
  });

export const responsiveImage = defineType({
  name: "responsiveImage",
  title: "Responsive image",
  type: "object",
  fields: [
    imageField("image", "Image"),
    imageField("mobileImage", "Optional mobile image"),
  ],
  preview: {
    select: { title: "image.alt", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Untitled image", media }),
  },
});
