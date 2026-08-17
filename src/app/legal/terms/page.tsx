import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "WebSystemBuilders Terms and Conditions — terms governing website access, system purchases, and custom development.",
};

export default function TermsPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Official Legal Agreement"
      title="Terms and Conditions"
      description="Effective date: 7 August 2026 — Governing access to and use of the WebSystemBuilders website, ready-made software systems, and custom-development services."
      sideNote={{
        title: "Operator Information",
        text: "WebSystemBuilders is operated by AG Evangelista, individual operator (Metro Manila, Philippines). Contact: evangelista.agdiaz@gmail.com.",
      }}
      sections={[
        {
          title: "Operator information",
          paragraphs: [
            "These Terms and Conditions (“Terms”) govern access to and use of the WebSystemBuilders website and the purchase of ready-made software systems or custom-development services. The service is operated by AG Evangelista, an individual operating under the name WebSystemBuilders (“WebSystemBuilders,” “we,” “us,” or “our”). WebSystemBuilders is not presented as a corporation or as a legal entity separate from its individual operator.",
            "By creating an account, placing an order, submitting payment, requesting custom work, or using a delivered system, you agree to these Terms. If you do not agree, do not use the service or submit an order.",
          ],
        },
        {
          title: "Eligibility and accounts",
          paragraphs: [
            "You must provide accurate, current, and complete information. You are responsible for activity under your account and for keeping login credentials confidential. Do not share your password or permit unauthorized access.",
            "If you are under 18, you may transact only with the involvement and consent of a parent or legal guardian, who must review and accept these Terms and take responsibility for the transaction.",
            "We may reject, suspend, or close accounts reasonably associated with fraud, fake payment proof, unauthorized access, infringement, abusive conduct, or violation of these Terms. We will not suspend access arbitrarily where doing so would violate applicable consumer rights.",
          ],
        },
        {
          title: "Services and product information",
          paragraphs: [
            "WebSystemBuilders offers ready-made software systems delivered digitally, and custom software design and development based on an agreed scope.",
            "Each listing, proposal, quotation, or written agreement may state its own price, inclusions, compatibility, license, delivery estimate, support period, revision limits, dependencies, and special conditions. Those specific terms form part of the agreement. If they conflict with these general Terms, the more specific written terms control for that order unless prohibited by law.",
            "We aim to describe each product and service accurately. Buyers must review the stated features, technical requirements, screenshots, demos, and limitations before ordering and ask questions about compatibility when uncertain.",
          ],
        },
        {
          title: "Orders and contract formation",
          paragraphs: [
            "Submitting an order or payment proof is an offer to purchase. An order becomes accepted only when we verify payment and send an order confirmation, delivery notice, or written acceptance. An automated acknowledgment that information was received does not by itself confirm acceptance.",
            "We may decline or cancel an unaccepted order because of an incorrect price, unavailable product, suspected fraud, technical error, unlawful request, or inability to perform the requested work. If verified funds were received for an order we cannot accept, we will return the applicable amount using a reasonable available method.",
          ],
        },
        {
          title: "Prices, PayPal, and manual verification",
          paragraphs: [
            "Prices are displayed or quoted in Philippine pesos unless stated otherwise. Any applicable taxes, fees, or additional costs will be disclosed as required.",
            "PayPal payments are captured and verified through the provider's server APIs and signed webhooks. If GCash / QRPH is configured, verified customers may instead follow the administrator-published QR instructions and submit a private proof image. Do not send money based only on a message from an unverified person. We will never request your MPIN, one-time password, or full account credentials.",
            "A PayPal browser approval or return does not by itself prove payment; server capture and reconciliation must succeed. GCash / QRPH payment is not complete until funds and proof are manually verified. Altered, duplicated, reversed, insufficient, or fraudulent payments may cause rejection, suspension, and referral to the proper authorities. The operator will provide the applicable electronic invoice or receipt required by law.",
          ],
        },
        {
          title: "Digital delivery",
          paragraphs: [
            "Delivery may occur through a download link, repository invitation, email attachment, license key, hosted account, access credentials, or another agreed digital method. Delivery is complete when the purchased files or access are made available through the agreed method, even if the buyer delays downloading or accessing them.",
            "The buyer must provide a working email address and promptly download or secure delivered materials. Unless a listing or written agreement provides otherwise, delivery estimates are good-faith estimates and may be affected by payment-verification time, project dependencies, buyer delays, security checks, or events beyond reasonable control.",
          ],
        },
        {
          title: "License for ready-made systems",
          paragraphs: [
            "Unless a product listing or written agreement expressly states otherwise, purchasing a ready-made system grants the buyer a limited, non-exclusive, non-transferable license to use and modify one delivered copy for the buyer's own academic, portfolio, internal, or business purpose.",
            "The buyer may not, without prior written permission: resell, redistribute, sublicense, publish, leak, or give away the source code or system as a competing product; claim authorship of WebSystemBuilders' original work or remove required copyright notices; share download links or credentials with unauthorized persons; or violate laws.",
            "Academic buyers remain responsible for following their school's rules on originality, attribution, collaboration, and academic integrity. We do not guarantee that a purchased system may be submitted as solely the buyer's original work.",
          ],
        },
        {
          title: "Custom-development projects",
          paragraphs: [
            "Custom work requires a written scope, quotation, or project agreement covering deliverables, timeline, price, payment schedule, revisions, acceptance, support, and ownership. The buyer must provide timely, accurate requirements, content, approvals, credentials, and feedback.",
            "Unless a written agreement says otherwise: ownership or the agreed license to custom deliverables transfers only after full payment; WebSystemBuilders retains ownership of pre-existing code, reusable components, tools, templates, and general methods; third-party and open-source components remain governed by their own licenses.",
          ],
        },
        {
          title: "Buyer-provided materials",
          paragraphs: [
            "You represent that you own or have permission to use all content, data, branding, credentials, code, and other materials you provide. You grant WebSystemBuilders a limited permission to use those materials only as needed to evaluate, build, test, deliver, secure, or support the requested service.",
            "Do not provide illegally obtained data, malware, infringing material, or unnecessary sensitive personal information. We may refuse unlawful or unsafe project requirements.",
          ],
        },
        {
          title: "Refunds, repairs, and replacements",
          paragraphs: [
            "Because digital files and source code can be copied after access is granted, change-of-mind refunds are generally unavailable after files, credentials, repository access, license keys, or other digital access have been delivered.",
            "This rule does not remove any remedy that cannot lawfully be waived. If a system or service is defective, materially different from its description, missing an agreed essential feature, incompatible despite an express compatibility promise, or not delivered as agreed, contact us promptly with details and reasonable evidence. Depending on the circumstances and applicable law, an appropriate remedy may include correction, repair, replacement, completion, price adjustment, or refund.",
          ],
        },
        {
          title: "Support, updates, and compatibility",
          paragraphs: [
            "Support, installation, deployment, customization, maintenance, hosting, updates, domain fees, and third-party subscriptions are included only when the listing or written agreement says so. Unless expressly promised, a purchase does not include perpetual support or compatibility with every future browser, OS, library, device, or third-party API change.",
          ],
        },
        {
          title: "Acceptable use",
          paragraphs: [
            "You must not use the website or delivered systems to: break the law, infringe intellectual property, invade privacy, or commit fraud; introduce malware, probe vulnerabilities without permission, disrupt systems, or bypass security; harass, impersonate, deceive, or collect personal data without a lawful basis; or resell licensed materials contrary to the applicable license.",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "The website, branding, original source code, interface designs, documentation, graphics, text, and other original materials supplied by WebSystemBuilders are protected by applicable intellectual-property laws. No ownership transfers except as expressly stated in a product license or written custom-development agreement.",
          ],
        },
        {
          title: "Third-party services and components",
          paragraphs: [
            "The website and delivered systems may depend on third-party hosting, databases, APIs, libraries, payment channels, or open-source software. Third-party services are governed by their own terms, availability, and privacy practices.",
          ],
        },
        {
          title: "Service availability and changes",
          paragraphs: [
            "We may perform maintenance, correct errors, improve security, or change website features. We do not promise uninterrupted website availability. Material changes will not retroactively reduce rights already earned under an accepted and paid order.",
          ],
        },
        {
          title: "Disclaimers",
          paragraphs: [
            "Except for express written commitments and rights that cannot be excluded by law, products and services are provided with the features and limitations stated in the applicable listing or agreement. The buyer is responsible for reviewing and testing a system before production use.",
          ],
        },
        {
          title: "Limitation of liability",
          paragraphs: [
            "To the extent permitted by law, neither party is liable for indirect, incidental, or consequential loss. Where liability may lawfully be limited, WebSystemBuilders' aggregate liability arising from a specific order will not exceed the amount actually paid for that order.",
          ],
        },
        {
          title: "Suspension and termination",
          paragraphs: [
            "You may stop using the website and request account closure. We may suspend or terminate access for a material breach, security threat, fraud, infringement, or unlawful use.",
          ],
        },
        {
          title: "Privacy",
          paragraphs: [
            "Our collection and processing of personal data are governed by the WebSystemBuilders Privacy Policy. By using the service, you acknowledge that you have been given an opportunity to review that Policy.",
          ],
        },
        {
          title: "Electronic communications",
          paragraphs: [
            "You agree that orders, confirmations, proposals, invoices, delivery notices, approvals, and other communications may be provided electronically.",
          ],
        },
        {
          title: "Governing law and dispute resolution",
          paragraphs: [
            "These Terms are governed by the laws of the Republic of the Philippines. Before starting formal proceedings, contact evangelista.agdiaz@gmail.com with the order number, facts, and requested resolution to attempt good-faith resolution.",
          ],
        },
        {
          title: "Changes to these Terms",
          paragraphs: [
            "We may update these Terms for future use of the service. Continued use after proper notice of changes constitutes acceptance to the extent permitted by law.",
          ],
        },
        {
          title: "Severability and no waiver",
          paragraphs: [
            "If a provision is held invalid or unenforceable, the remaining provisions remain effective. Failure to enforce a provision once is not a waiver of the right to enforce it later.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "WebSystemBuilders — AG Evangelista, individual operator — Metro Manila, Philippines — evangelista.agdiaz@gmail.com",
          ],
        },
      ]}
    />
  );
}
