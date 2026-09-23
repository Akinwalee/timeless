"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { isSanityConfigured, sanityEnv } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Timeless Studio",
  basePath: "/studio",
  projectId: isSanityConfigured ? sanityEnv.projectId : "missing-project",
  dataset: sanityEnv.dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("product").title("Products"),
            S.documentTypeListItem("journal").title("Journal"),
            S.documentTypeListItem("inTheWild").title("In the Wild"),
            S.divider(),
            S.listItem()
              .title("Global settings")
              .child(S.document().schemaType("globalSettings").documentId("globalSettings")),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== "globalSettings"),
  },
  document: {
    actions: (actions, context) => context.schemaType === "globalSettings"
      ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
      : actions,
  },
});
