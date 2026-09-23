import { createClient } from "next-sanity";
import { isSanityConfigured, sanityEnv } from "../env";

export function getSanityClient() {
  if (!isSanityConfigured) return null;

  return createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    useCdn: true,
    perspective: "published",
  });
}
