export const policies = {
  shipping: {
    title: "Shipping",
    intro: "Your delivery address determines the shipping quote.",
    sections: [
      { title: "Get a shipping quote", paragraphs: ["Add your items to the bag and continue on WhatsApp. Share your delivery address so we can confirm whether delivery is available to your location and quote the shipping fee.", "Website prices and bag subtotals cover the items only. Shipping is additional. We confirm the shipping charge and final order total on WhatsApp before you pay."] },
      { title: "Delivery arrangements", paragraphs: ["Delivery options and an estimated timeframe are confirmed on WhatsApp for your address. Do not assume a delivery date until it has been agreed.", "Please check your address and contact details before confirming. If they change, contact us promptly so we can discuss the available options."] },
      { title: "Delivery problems", paragraphs: ["If an order is delayed, damaged or missing, contact us with your order details so we can investigate and discuss the appropriate next steps."] },
    ],
  },
  returns: {
    title: "Returns & order issues",
    intro: "Contact us before sending an item back.",
    sections: [
      { title: "Ask for help", paragraphs: ["If you need to discuss a return, exchange or cancellation, contact us on WhatsApp with your order details and the reason for your request. We will discuss the available resolution and any return instructions with you.", "Please confirm any voluntary return or exchange conditions before paying for your order. We do not publish a fixed change-of-mind return window here."] },
      { title: "Damaged, faulty or incorrect items", paragraphs: ["Contact us as soon as you notice an issue. Include your order details, a description and, where useful, photographs so we can assess the problem.", "Keep the item and its packaging while the issue is being reviewed. Any agreed return address, shipping arrangements and refund or replacement steps will be confirmed directly with you."] },
      { title: "Your rights", paragraphs: ["Nothing in this information limits any consumer rights or remedies that apply to your purchase under applicable law."] },
    ],
  },
  privacy: {
    title: "Privacy",
    intro: "How Timeless uses information when you browse, subscribe or request an order.",
    sections: [
      { title: "Orders and enquiries", paragraphs: ["When you contact Timeless through WhatsApp or email, you choose the information you share. This may include your name, contact details, delivery address and order details. We use it to answer questions, quote shipping, arrange your order and handle support.", "WhatsApp operates separately under its own privacy terms. A bag handoff contains your selected items; you provide your delivery address in the conversation. Do not send card details through this website."] },
      { title: "Email updates", paragraphs: ["If you choose to subscribe, your email is sent to Brevo to request a confirmation email and manage the mailing list. Confirm using the email link before joining. You can unsubscribe through the link in marketing emails or contact us to request removal.", "We use your consent for email marketing. Subscribing is optional and is not a condition of placing an order."] },
      { title: "Browser storage and optional measurement", paragraphs: ["The website uses local storage to keep your bag and your measurement preference on your device. It may use session storage for introductory animation. You can remove this through your browser settings; doing so may clear your saved bag.", "If optional analytics is configured, it loads only after you choose to allow it. You can change that choice using Measurement preferences in the footer. Funnel events describe pages and shopping actions, not your email address or WhatsApp message. Declining measurement does not prevent shopping."] },
      { title: "Service operation", paragraphs: ["Hosting and service providers process technical information needed to deliver and protect the website. Where configured, error monitoring helps diagnose failures. Newsletter abuse controls briefly retain hashed network and email identifiers in server memory for up to 15 minutes; email content and provider error bodies are not logged by the signup endpoint.", "Relevant providers include Brevo for email, Sanity for published website content and WhatsApp for conversations. Optional measurement uses Google Analytics when enabled. Error-only monitoring, when configured, uses Sentry. Providers may process information outside Nigeria under their applicable arrangements."] },
      { title: "Retention and your choices", paragraphs: ["Order and enquiry information may be needed for fulfilment, support and applicable record-keeping obligations. Contact us to ask about retention, request access or correction, object to processing, withdraw consent or request deletion, subject to applicable requirements.", "You may also raise a privacy concern with the Nigeria Data Protection Commission. Contact Timeless using the details below for questions about this notice or your information."] },
    ],
  },
  terms: {
    title: "Terms",
    intro: "Using the website and requesting a Timeless order.",
    sections: [
      { title: "Order requests", paragraphs: ["The website lets you explore products, save a bag and prepare an order request through WhatsApp. Adding to the bag or opening WhatsApp does not complete a purchase or confirm payment.", "Before you pay, confirm the selected products, colour, size, availability, item prices, shipping charge and final total with Timeless on WhatsApp. Prices and availability can change; saved bag information may be out of date."] },
      { title: "Shipping and returns", paragraphs: ["Shipping is quoted after you share your delivery address on WhatsApp and is additional to the website item subtotal. Delivery availability and estimates are confirmed for your location.", "Review our Shipping and Returns information and confirm any order-specific arrangements before payment. If you have an issue with an order, contact us using the details below."] },
      { title: "Website use", paragraphs: ["Use the website lawfully and provide accurate information when making an enquiry or order request. Do not attempt to interfere with the website or misuse its forms.", "Product photographs are provided to help you choose; colours can vary between screens. Ask us for clarification if colour, fit or another product detail is important to your decision."] },
      { title: "Content and your rights", paragraphs: ["Timeless branding, photographs and editorial content are provided for browsing and personal shopping. Contact us before reusing them commercially.", "Nothing in these terms excludes consumer or privacy rights that cannot lawfully be excluded. Third-party services such as WhatsApp and Brevo operate under their own terms. Material order details should be confirmed directly before payment."] },
    ],
  },
} as const;

export type PolicyKey = keyof typeof policies;
