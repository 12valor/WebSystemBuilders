import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "WebSystemBuilders Terms and Conditions — governing website access, ready-made software purchases, and custom development services.",
};

export default function TermsPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Legal Agreement"
      title="Terms and Conditions"
      description="Effective date: August 7, 2026 — The contractual agreement governing access to WebSystemBuilders, purchase of ready-made software systems, and custom development services."
      sideNote={{
        title: "Platform Operator Notice",
        text: "WebSystemBuilders is operated by AG Evangelista, individual software developer and sole proprietor (Metro Manila, Philippines). Contact: evangelista.agdiaz@gmail.com.",
      }}
      sections={[
        {
          title: "Operator identification and acceptance",
          paragraphs: [
            "These Terms and Conditions (“Terms”) constitute a binding legal agreement between you and AG Evangelista, operating as WebSystemBuilders (“WebSystemBuilders,” “we,” “us,” or “our”).",
            "By registering an account, purchasing a ready-made system, paying for custom development, or downloading delivered software, you agree to these Terms. If you disagree with any part of these Terms, you must not use the website or purchase products.",
          ],
        },
        {
          title: "Eligibility and account security",
          paragraphs: [
            "You must provide accurate and complete contact information during registration and checkout. You are responsible for all activity conducted through your account.",
            "If you are under 18 years old, you may transact on WebSystemBuilders only with the active consent and supervision of a parent or legal guardian who accepts responsibility for the transaction.",
            "We reserve the right to suspend or terminate accounts reasonably suspected of payment fraud, unauthorized credential sharing, software redistribution violations, or abusive conduct.",
          ],
        },
        {
          title: "Product descriptions and specifications",
          paragraphs: [
            "WebSystemBuilders sells two distinct product models:",
          ],
          subsections: [
            {
              title: "1. Ready-Made Software Systems",
              paragraphs: [
                "Pre-built, database-driven web applications delivered as complete source code packages with SQL schemas, environment configurations, and setup documentation.",
              ],
            },
            {
              title: "2. Custom Development Services",
              paragraphs: [
                "Bespoke software design and engineering based on an agreed scope of work, milestone schedule, and technical requirements.",
              ],
            },
          ],
          items: [
            "Each system listing details its tech stack, database engine, included modules, screenshots, and live demo where available.",
            "Buyers must review technical requirements and prerequisites (such as Node.js or database versions) before purchasing.",
          ],
        },
        {
          title: "Orders and contract formation",
          paragraphs: [
            "Submitting an order constitutes an offer to purchase. An order is accepted only after payment capture is authoritatively verified by our server and an official order confirmation is recorded in our system.",
            "Automated browser redirects or client-side payment approvals do not constitute proof of completed purchase until confirmed by server-to-server webhook verification.",
            "If an order cannot be fulfilled due to technical error, pricing error, or inventory unavailability, we will cancel the order and issue a full refund to the original payment method.",
          ],
        },
        {
          title: "Pricing and PayPal verification",
          callout: {
            title: "Server-Verified Payments",
            text: "All transactions are processed through PayPal Orders v2 with strict server-side signature verification to protect both buyer and seller against fraud.",
          },
          paragraphs: [
            "Prices are listed in Philippine Pesos (PHP) or United States Dollars (USD) as displayed on the product catalog. The server calculates authoritative prices during checkout.",
            "Payments are verified via PayPal server APIs. We never ask for your bank password, OTP, or PayPal credentials.",
            "Fraudulent chargebacks, forged payment references, or reversed captures will result in immediate revocation of download access and potential referral to relevant authorities.",
          ],
        },
        {
          title: "Digital delivery and download tokens",
          paragraphs: [
            "Ready-made software systems are delivered digitally through the customer portal immediately following verified payment capture.",
            "Download access is granted via expiring, signed URLs (valid for 1 hour per session) to prevent unauthorized link sharing. Customers can generate fresh download tokens through their authenticated customer account at any time.",
            "Delivery is complete once the download link is generated and made accessible in your account, regardless of when you download the files to your local machine.",
          ],
        },
        {
          title: "Commercial license for ready-made systems",
          callout: {
            title: "Full Source Code Rights",
            text: "You receive full, readable source code with the right to modify, customize, and deploy the software for commercial, internal, or academic projects.",
          },
          paragraphs: [
            "Purchasing a ready-made system grants you a perpetual, non-exclusive, non-transferable license to use, modify, and deploy the source code for your business, client, or academic project.",
          ],
          items: [
            "Allowed: Deploy the software to production servers, cloud hosting, or local environments.",
            "Allowed: Customize, refactor, add features, and modify database schemas.",
            "Allowed: Use the software as the foundation for your own client or capstone project.",
            "Prohibited: Resell, redistribute, sublicense, or publish the original or unmodified source code package as a competing software template or digital asset.",
            "Prohibited: Claim original authorship of the base system architecture or remove copyright notices from third-party open-source libraries.",
          ],
        },
        {
          title: "Academic integrity for students",
          paragraphs: [
            "Students purchasing systems or requesting custom capstone development must comply with their institution’s academic integrity policies.",
            "WebSystemBuilders provides software architecture, foundational boilerplates, and technical guidance. We do not participate in academic dishonesty, exam cheating, or fraudulent certification.",
          ],
        },
        {
          title: "Custom development projects",
          paragraphs: [
            "Custom development engagements require an agreed written project proposal specifying deliverables, milestones, payment schedules, and revision limits.",
            "Ownership of custom code transfers to the client upon receipt of final milestone payment, excluding pre-existing WebSystemBuilders proprietary tools, libraries, and open-source packages.",
          ],
        },
        {
          title: "Refunds and remedy policy",
          paragraphs: [
            "Due to the irrevocable digital nature of complete source code deliverables, change-of-mind refunds are not available once files or repository access have been accessed or downloaded.",
            "If a delivered system has a material defect, fails to run according to documented specifications, or is missing agreed core features, contact us within 14 days of purchase. We will fix the defect, provide an updated package, or issue a refund if the defect cannot be resolved.",
          ],
        },
        {
          title: "Support and technical assistance",
          paragraphs: [
            "Ready-made system purchases include 30 days of email support covering installation questions, environment configuration guidance, and bug fixes related to original code.",
            "Support does not include free custom feature development, third-party server management, or debugging user-introduced code modifications unless contracted separately.",
          ],
        },
        {
          title: "Acceptable use",
          paragraphs: [
            "You agree not to use WebSystemBuilders products or services for unlawful activities, including fraud, malware distribution, unauthorized vulnerability scanning, harassment, or violation of third-party intellectual property rights.",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "All content, documentation, brand assets, logos, and original code templates on this website are the intellectual property of AG Evangelista / WebSystemBuilders, protected by copyright and intellectual property laws.",
          ],
        },
        {
          title: "Third-party libraries and licenses",
          paragraphs: [
            "Our software systems may incorporate open-source libraries (e.g., React, Next.js, Tailwind CSS, Lucide icons, PostgreSQL drivers). These dependencies remain governed by their respective open-source licenses (such as MIT, Apache 2.0, or BSD).",
          ],
        },
        {
          title: "Limitation of liability",
          paragraphs: [
            "To the maximum extent permitted by applicable Philippine law, WebSystemBuilders is not liable for indirect, incidental, or consequential damages resulting from the use or inability to use delivered software.",
            "Our total aggregate liability for any claim arising from an order is strictly limited to the amount actually paid by you for that specific order.",
          ],
        },
        {
          title: "Governing law and dispute resolution",
          paragraphs: [
            "These Terms are governed by and construed in accordance with the laws of the Republic of the Philippines.",
            "In the event of a dispute, both parties agree to first seek an informal, good-faith resolution by contacting evangelista.agdiaz@gmail.com with transaction details and a clear description of the issue.",
          ],
        },
        {
          title: "Contact information",
          paragraphs: [
            "For contractual questions, licensing inquiries, or legal notices, contact:",
            "AG Evangelista — Platform Operator, WebSystemBuilders",
            "Location: Metro Manila, Philippines | Email: evangelista.agdiaz@gmail.com",
          ],
        },
      ]}
    />
  );
}
