import { PolicyPage } from "@/components/site/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata('Returns & order issues', 'Contact Timeless about returns, exchanges, damaged or incorrect items before sending an item back.', "/returns");

export default function Page() { return <PolicyPage name="returns" />; }
