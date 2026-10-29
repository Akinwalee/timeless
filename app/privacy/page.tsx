import { PolicyPage } from "@/components/site/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata('Privacy', 'How Timeless handles order enquiries, Brevo email subscriptions, browser storage and optional measurement.', "/privacy");

export default function Page() { return <PolicyPage name="privacy" />; }
