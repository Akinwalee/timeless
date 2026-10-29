import { PolicyPage } from "@/components/site/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata('Terms', 'Information about using Timeless and requesting an order through WhatsApp.', "/terms");

export default function Page() { return <PolicyPage name="terms" />; }
