import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "WebSystemBuilders Privacy Policy — how personal data is collected, processed, stored, and protected.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Official Legal Policy"
      title="Privacy Policy"
      description="Effective date: 7 August 2026 — Explaining how WebSystemBuilders collects, uses, discloses, stores, and protects personal data under the Data Privacy Act of 2012 (Republic Act No. 10173)."
      sideNote={{
        title: "Data Controller Notice",
        text: "Personal Information Controller: AG Evangelista, operating as WebSystemBuilders (Metro Manila, Philippines). Contact: evangelista.agdiaz@gmail.com.",
      }}
      sections={[
        {
          title: "Scope",
          paragraphs: [
            "This Policy applies to personal data processed through the WebSystemBuilders website, customer accounts, ordering and payment-verification process, customer support or chat, and custom-development inquiries. It does not govern independent third-party websites or services that have their own privacy policies.",
          ],
        },
        {
          title: "Personal data we collect",
          paragraphs: [
            "Depending on how you use the service, we may collect the following categories of personal information:",
          ],
          subsections: [
            {
              title: "Account and profile data",
              items: [
                "Name and email address",
                "Account type, such as student or business owner",
                "Account identifiers and authentication information processed through Supabase",
                "Account preferences and status",
              ],
              paragraphs: [
                "We will never ask you to send your password, GCash MPIN, one-time password (OTP), or other account-security code through chat or email.",
              ],
            },
            {
              title: "Order and payment-verification data",
              items: [
                "Products or services ordered, prices, dates, and order status",
                "PayMongo checkout identifiers, payment status, amount, currency, and reconciliation records received from the payment provider",
                "For legacy manual orders, GCash or QRPH screenshots and transaction references previously submitted for verification",
                "Verification notes, delivery records, invoices, and refund records",
                "License or access information connected with a purchased system",
              ],
              paragraphs: [
                "New PayMongo checkout does not ask you to upload proof. Historical manual proof data is retained only for legitimate transaction, support, accounting, and dispute purposes.",
              ],
            },
            {
              title: "Communications and project data",
              items: [
                "Messages sent through customer chat, contact forms, or email",
                "Support requests, feedback, and complaint records",
                "Requirements, files, content, and technical information voluntarily provided for a custom-development project",
              ],
              paragraphs: [
                "Do not submit confidential, sensitive, or third-party personal data unless it is genuinely necessary and you are authorized to provide it.",
              ],
            },
            {
              title: "Technical, cookie, and usage data",
              items: [
                "IP address, browser type, operating system, device information, referring page, and approximate location derived from an IP address",
                "Pages viewed, buttons or links used, timestamps, session information, and error or security logs",
                "Cookie identifiers and similar information used to maintain sessions, secure accounts, remember preferences, or measure website performance",
              ],
            },
          ],
        },
        {
          title: "How we collect personal data",
          paragraphs: [
            "We collect personal data directly from you when you register, place an order, contact us, or provide project requirements. We also collect limited technical information automatically and receive payment-status information from providers acting on our behalf. Legacy manual orders may include proof uploaded under the earlier process.",
          ],
        },
        {
          title: "Why we process personal data",
          paragraphs: [
            "We process personal data only for declared and legitimate purposes, including to:",
          ],
          items: [
            "Create, authenticate, secure, and administer accounts",
            "Distinguish student and business-owner account experiences",
            "Process orders, verify PayMongo webhook events, and review legacy manual GCash or QRPH payments",
            "Deliver software files, access credentials, licenses, updates, and support",
            "Evaluate, quote, manage, and complete custom-development projects",
            "Communicate about orders, service notices, support, complaints, and refunds",
            "Detect payment fraud, invalid webhook events, legacy fake proofs, abuse, security incidents, and technical errors",
            "Maintain transaction, accounting, tax, legal, and dispute records",
            "Improve website reliability and understand service usage",
            "Comply with lawful requests and applicable Philippine laws",
          ],
        },
        {
          title: "Cookies and analytics",
          paragraphs: [
            "We may use essential cookies for sign-in, session continuity, security, and saved preferences. These are necessary for requested website functions. If we use non-essential analytics or advertising cookies, we will identify them in a cookie notice and request consent where required. You may block cookies through your browser, but essential website functions may stop working correctly.",
          ],
        },
        {
          title: "When we disclose personal data",
          paragraphs: [
            "We do not sell or rent personal data. We may disclose only what is reasonably necessary to:",
          ],
          items: [
            "Supabase, which may process authentication, database, file-storage, or related service data on our behalf",
            "Hosting, communications, security, technical-support, or professional advisers engaged to operate or protect the service",
            "Contractors working on a custom project, only when access is necessary and subject to appropriate confidentiality and data-protection obligations",
            "Payment channels or financial institutions when needed to verify, trace, refund, or investigate a payment",
            "Government agencies, regulators, law-enforcement bodies, courts, or other parties when disclosure is required or authorized by law",
            "A successor or transferee in a legitimate reorganization or transfer of the service, subject to applicable privacy requirements",
          ],
        },
        {
          title: "Storage and cross-border processing",
          paragraphs: [
            "Personal data may be stored or processed using cloud infrastructure located outside the Philippines. When cross-border processing occurs, we use contractual or other reasonable measures intended to provide a comparable level of protection and require providers to protect the data consistently with applicable law.",
          ],
        },
        {
          title: "Retention and deletion",
          paragraphs: [
            "We retain personal data only while necessary for its stated purpose, legitimate business needs, legal claims, or a period required by law. Our intended schedule is:",
          ],
          items: [
            "Account and profile data: while the account is active and for up to two years after closure, unless earlier deletion is appropriate or longer retention is legally required",
            "Orders, invoices, transaction records, and refund records: for the applicable legal recordkeeping period, generally five years from the relevant tax filing deadline",
            "Payment screenshots: normally deleted within 90 days after payment verification and completion of the applicable refund window, unless needed for fraud investigation or legal compliance",
            "Customer-support and project communications: for up to two years after the last interaction or project completion",
            "Security, device, and technical logs: normally up to 12 months, unless needed to investigate abuse or a security incident",
            "Deleted-data backups: may remain in protected backup cycles for up to 90 additional days before being overwritten",
          ],
        },
        {
          title: "Security",
          paragraphs: [
            "We use reasonable organizational, physical, and technical safeguards appropriate to the nature and risk of the data, which may include access controls, authenticated administration, encryption in transit, limited provider access, backups, logging, software updates, and incident-response procedures. No internet service is completely secure, so we cannot guarantee absolute security.",
            "You are responsible for keeping your password confidential, using a strong and unique password, and notifying us promptly if you suspect unauthorized account access.",
          ],
        },
        {
          title: "Your privacy rights",
          paragraphs: [
            "Under the Data Privacy Act of 2012, subject to applicable law and valid limitations, you may exercise the right to:",
          ],
          items: [
            "Be informed about the processing of your personal data",
            "Request reasonable access to personal data we hold about you",
            "Correct inaccurate or incomplete personal data",
            "Object to certain processing or withdraw consent where consent is the basis",
            "Request blocking, erasure, or destruction when the legal conditions are met",
            "Obtain a portable copy of electronically processed data where applicable",
            "Be indemnified for damage caused by unlawful or unauthorized processing",
            "Lodge a complaint with the National Privacy Commission",
          ],
        },
        {
          title: "Children and minors",
          paragraphs: [
            "The service is not directed to children under 13. A person under 18 may use the service only with the involvement and consent of a parent or legal guardian who accepts responsibility for the account and transaction. If we learn that personal data was collected from a child without appropriate authority, we will take reasonable steps to delete it.",
          ],
        },
        {
          title: "Data breaches",
          paragraphs: [
            "We maintain procedures for assessing and responding to security incidents. Where required by the Data Privacy Act and applicable National Privacy Commission rules, we will notify the Commission and affected individuals of a qualifying personal data breach.",
          ],
        },
        {
          title: "Changes to this Policy",
          paragraphs: [
            "We may update this Policy to reflect operational, technological, or legal changes. The revised version will show a new effective date. When a change materially affects how existing personal data is processed, we will provide appropriate notice and obtain consent when required.",
          ],
        },
        {
          title: "Contact and complaints",
          paragraphs: [
            "Questions and privacy requests may be sent to: WebSystemBuilders Privacy Contact — AG Evangelista, Metro Manila, Philippines — evangelista.agdiaz@gmail.com.",
            "You may also contact or file a complaint with the National Privacy Commission of the Philippines through its official website at https://privacy.gov.ph/.",
          ],
        },
      ]}
    />
  );
}

