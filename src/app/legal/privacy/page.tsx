import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "WebSystemBuilders Privacy Policy — how personal data is collected, processed, stored, and protected under the Philippine Data Privacy Act of 2012.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Compliance & Privacy"
      title="Privacy Policy"
      description="Effective date: August 7, 2026 — How WebSystemBuilders collects, stores, processes, and protects personal information under the Data Privacy Act of 2012 (Republic Act No. 10173)."
      sideNote={{
        title: "Data Controller Information",
        text: "Personal Information Controller: AG Evangelista, operating as WebSystemBuilders (Metro Manila, Philippines). Contact: evangelista.agdiaz@gmail.com.",
      }}
      sections={[
        {
          title: "Scope and applicability",
          paragraphs: [
            "This Policy applies to personal information processed through the WebSystemBuilders website, user accounts, checkout transactions, customer support channels, pre-sale discussions, and custom software development inquiries.",
            "This Policy does not apply to third-party services, external websites, or payment gateways that maintain their own independent privacy notices.",
          ],
        },
        {
          title: "Personal data we collect",
          paragraphs: [
            "We collect only the categories of personal data necessary to provide software systems, manage accounts, process payments, and fulfill custom development contracts:",
          ],
          subsections: [
            {
              title: "Account and identity data",
              items: [
                "Full name and email address",
                "Account classification (student or business owner)",
                "Authentication credentials and unique user identifiers processed securely via Supabase Auth",
                "Account preferences and operational status",
              ],
              paragraphs: [
                "We never ask for your password, one-time passcode (OTP), or two-factor recovery codes through chat, email, or social media.",
              ],
            },
            {
              title: "Orders and payment verification data",
              items: [
                "Purchased system titles, versions, prices, currencies, and transaction dates",
                "PayPal order and capture IDs, transaction statuses, and webhook payload records",
                "Download authorization tokens, license assignments, and receipt histories",
                "For legacy manual transactions: historical payment evidence strictly retained for tax and dispute compliance",
              ],
              paragraphs: [
                "Credit card numbers and bank credentials are processed directly by PayPal; WebSystemBuilders never receives or stores raw payment card numbers.",
              ],
            },
            {
              title: "Project and communication data",
              items: [
                "Messages sent via the pre-sale chat modal, contact form, or direct email",
                "Technical requirements, project specifications, and wireframes submitted for custom development",
                "Support requests, bug reports, and customer feedback",
              ],
            },
            {
              title: "Technical and device data",
              items: [
                "IP address, browser type, operating system version, and general geographic location derived from IP",
                "Access timestamps, pages visited, referrers, and error logs collected for system diagnostics and security",
              ],
            },
          ],
        },
        {
          title: "How we collect personal data",
          paragraphs: [
            "We collect personal information directly when you create an account, submit an order, request a custom build quote, send a pre-sale message, or contact support.",
            "Technical diagnostic data is recorded automatically through server logs and essential cookies during your website visit. Payment transaction statuses are received directly from PayPal server webhooks.",
          ],
        },
        {
          title: "Purposes of processing",
          callout: {
            title: "Zero Data Selling",
            text: "WebSystemBuilders does not sell, rent, or trade your personal information to third parties or advertising networks.",
          },
          paragraphs: [
            "We process personal information under declared, legitimate, and lawful purposes:",
          ],
          items: [
            "Authenticate accounts and secure customer access",
            "Deliver purchased source code packages and generate expiring, secure download tokens",
            "Verify payment captures and reconcile transactions via PayPal webhooks",
            "Scope, estimate, build, and deliver custom software development milestones",
            "Send transactional notices, order confirmations, delivery emails, and security alerts",
            "Prevent fraud, unauthorized downloads, payment reversals, and security breaches",
            "Comply with Philippine tax regulations, dispute resolution procedures, and lawful government orders",
          ],
        },
        {
          title: "Cookies and local storage",
          paragraphs: [
            "We use strictly essential cookies and local storage tokens to maintain authenticated sessions, secure forms with CSRF protection, and preserve user preferences.",
            "You can disable cookies through your browser settings. However, disabling essential cookies will prevent logging in, accessing the customer portal, and completing checkout.",
          ],
        },
        {
          title: "Third-party service providers",
          paragraphs: [
            "We share personal data only with trusted infrastructure providers bound by confidentiality and data protection agreements:",
          ],
          items: [
            "Supabase Inc. — database hosting, user authentication, and secure private file storage",
            "PayPal (Europe) S.à r.l. et Cie, S.C.A. / PayPal Inc. — payment processing and webhook transaction verification",
            "Resend Inc. — transactional email delivery for order receipts and download links",
            "Vercel Inc. — serverless application hosting and content delivery network",
          ],
        },
        {
          title: "Cross-border data transfers",
          paragraphs: [
            "Our cloud infrastructure partners maintain servers in secure global data centers (including the United States and Singapore). When personal data is processed outside the Philippines, we ensure our providers enforce security and privacy standards comparable to the Data Privacy Act of 2012.",
          ],
        },
        {
          title: "Data retention schedules",
          paragraphs: [
            "Personal data is retained only for the duration required by operational, contractual, and legal obligations:",
          ],
          items: [
            "Account Profiles: Retained while the account is active, and up to 2 years following account closure.",
            "Order & Tax Records: Retained for 5 years from the applicable tax filing date to satisfy Philippine statutory accounting rules.",
            "Customer Inquiries & Chat Logs: Retained for up to 2 years after the last active communication.",
            "Security & Access Logs: Retained for 12 months, unless required for active fraud or breach investigation.",
            "Encrypted Database Backups: Cycled and overwritten within 90 days.",
          ],
        },
        {
          title: "Security safeguards",
          paragraphs: [
            "We implement physical, organizational, and technical safeguards to protect your personal information against unauthorized access, accidental loss, alteration, or disclosure:",
          ],
          items: [
            "HTTPS encryption in transit across all pages and API endpoints",
            "PostgreSQL Row Level Security (RLS) enforcing strict tenant isolation",
            "Expiring, signed storage URLs for private ZIP file downloads",
            "Server-side verification for all payment captures and administrative actions",
          ],
        },
        {
          title: "Your rights under the Data Privacy Act",
          callout: {
            title: "Republic Act No. 10173 Rights",
            text: "You hold statutory rights to access, correct, object to, or request deletion of your personal data held by WebSystemBuilders.",
          },
          paragraphs: [
            "Under the Philippine Data Privacy Act of 2012, you are entitled to:",
          ],
          items: [
            "Right to be Informed: Understand how your data is collected, handled, and stored.",
            "Right to Access: Request a copy of your personal data held in our database.",
            "Right to Rectification: Correct inaccurate, outdated, or incomplete data.",
            "Right to Erasure or Blocking: Request removal of personal data when no longer legally required.",
            "Right to Object: Withdraw consent for optional processing activities.",
            "Right to Data Portability: Obtain your digital account records in an accessible electronic format.",
            "Right to File a Complaint: Lodge a formal grievance with the National Privacy Commission.",
          ],
        },
        {
          title: "Children and student privacy",
          paragraphs: [
            "WebSystemBuilders does not knowingly collect personal data from individuals under 13 years of age. Individuals aged 13 to 17 may use the website and place orders only with the verified consent and involvement of a parent or legal guardian.",
            "For student capstone and academic projects, we enforce strict academic integrity guidelines and protect all submitted project specifications confidentially.",
          ],
        },
        {
          title: "Data breach notifications",
          paragraphs: [
            "In the unlikely event of a security incident involving unauthorized access to sensitive personal information, WebSystemBuilders will notify affected individuals and the National Privacy Commission within 72 hours of verification, as mandated by NPC Circular 16-03.",
          ],
        },
        {
          title: "Policy updates",
          paragraphs: [
            "We may update this Privacy Policy to reflect improvements to our technical systems, payment methods, or legal obligations. Material changes will be highlighted with a revised effective date and published directly on this page.",
          ],
        },
        {
          title: "Contact and complaints",
          paragraphs: [
            "To exercise your privacy rights, request data correction, or ask compliance questions, contact:",
            "AG Evangelista — Personal Information Controller, WebSystemBuilders",
            "Location: Metro Manila, Philippines | Email: evangelista.agdiaz@gmail.com",
            "You may also contact the National Privacy Commission of the Philippines directly at https://privacy.gov.ph or via email at info@privacy.gov.ph.",
          ],
        },
      ]}
    />
  );
}
