import { PolicyPage } from "@/components/site/PolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata('Shipping', 'Shipping is quoted on WhatsApp after you share your delivery address. Confirm delivery options and the final total before payment.', "/shipping");

export default function Page() { return <PolicyPage name="shipping" />; }
