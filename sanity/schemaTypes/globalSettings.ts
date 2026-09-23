import { defineArrayMember, defineField, defineType } from "sanity";

const link = defineArrayMember({
  name: "navigationLink",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "href", title: "URL or path", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "external", title: "Open in a new tab", type: "boolean", initialValue: false }),
  ],
});

export const globalSettings = defineType({
  name: "globalSettings",
  title: "Global settings",
  type: "document",
  fields: [
    defineField({ name: "navigation", title: "Navigation", type: "array", of: [link] }),
    defineField({ name: "socialLinks", title: "Social links", type: "array", of: [link] }),
    defineField({ name: "contactEmail", title: "Contact email", type: "string" }),
    defineField({ name: "contactPhone", title: "Contact phone", type: "string" }),
    defineField({ name: "whatsappNumber", title: "WhatsApp number override", type: "string", description: "Digits with country code. Overrides NEXT_PUBLIC_WHATSAPP_NUMBER." }),
    defineField({ name: "homepageProduct", title: "Homepage featured product", type: "reference", to: [{ type: "product" }] }),
    defineField({ name: "homepageInTheWild", title: "Homepage In the Wild selection", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "inTheWild" }] })] }),
    defineField({ name: "homepageJournal", title: "Homepage Journal selection", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "journal" }] })] }),
  ],
  preview: { prepare: () => ({ title: "Global settings" }) },
});
