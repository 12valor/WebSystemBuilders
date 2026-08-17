# WebSystemBuilders - Site Pages & Admin Panel Summary

This document provides a concise overview of every page and admin panel tab within the WebSystemBuilders application codebase.

---

## 1. Public & Marketing Pages

- **Home Page (`/`)**  
  Main landing page presenting ready-made web systems, custom development services, core value propositions, and primary audience paths for students and business owners.

- **About Us (`/about`)**  
  Company background and mission statement detailing WebSystemBuilders' focus on delivering clean, database-driven web software packages and custom web builds.

- **Development Process (`/process`)**  
  Step-by-step breakdown of how systems are scoped, built, verified, and delivered to ensure clear expectations and transparent timelines.

- **Portfolio (`/portfolio`)**  
  Showcases featured software builds and past system implementations with screenshots, tech stacks, and live demo links.

- **Frequently Asked Questions (`/faq`)**  
  Addresses common questions regarding source code licensing, payment options, delivery timelines, customization, and technical support.

- **Contact (`/contact`)**  
  Public general inquiry page allowing visitors and clients to get in touch with the WebSystemBuilders team.

- **Get Started (`/get-started`)**  
  High-level launchpad guiding users to explore ready-made systems or submit a custom development request.

- **For Students (`/for-students`)**  
  Dedicated landing page for academic clients outlining ethical software development services, project packages, and learning resources.

- **For Business (`/for-business`)**  
  Tailored presentation for business owners highlighting enterprise-ready software templates, custom workflow automation, and commercial rights.

- **Custom Software Development (`/services/custom-development`)**  
  Detailed service outline explaining bespoke web application engineering, scoping requirements, and contract expectations.

- **Request a Quote (`/request-a-quote`)**  
  Structured intake form enabling potential clients to submit detailed project requirements for a custom software proposal.

---

## 2. Systems Catalog Pages

- **Systems Catalog (`/systems`)**  
  Searchable and filterable catalog displaying available ready-made software systems with price, tech stack, and feature tags.

- **System Details (`/systems/[slug]`)**  
  In-depth product view featuring full architecture specifications, screenshots, included modules, live preview links, and purchase triggers.

- **System Live Preview (`/systems/preview`)**  
  Interactive frame view for testing and evaluating system demo builds prior to purchasing.

---

## 3. Checkout & Order Fulfillment Pages

- **Checkout (`/checkout/[slug]`)**  
  Secure checkout interface for reviewing system details and paying through PayPal Checkout.

- **Checkout Preview (`/checkout/preview`)**  
  Standalone demonstration page for inspecting the checkout interface layout without creating live orders.

- **Order Status (`/checkout/status/[orderNumber]`)**  
  Real-time status page displaying payment verification, order receipt details, and immediate download links upon completion.

- **Secure Download (`/downloads/[token]`)**  
  Expiring, token-authenticated file delivery page for downloading purchased source code ZIP packages safely.

---

## 4. Authentication & User Onboarding Pages

- **Sign In (`/auth/sign-in`)**  
  Customer and administrator login portal supporting email magic links, credentials, and Google OAuth.

- **Sign Up (`/auth/sign-up`)**  
  Account registration page enabling new users to create accounts and begin the onboarding process.

- **Forgot Password (`/auth/forgot-password`)**  
  Self-service recovery page requesting password reset email links.

- **Reset Password (`/auth/reset-password`)**  
  Secure interface for setting a new password using a tokenized recovery link.

- **Verify Email (`/auth/verify-email`)**  
  Confirmation notice page informing users to verify their email address before accessing protected account features.

- **Unauthorized Access (`/auth/unauthorized`)**  
  Standard access restriction alert displayed when a user lacks privileges for a protected path.

- **Onboarding Wizard (`/onboarding`)**  
  Guided post-registration setup step collecting initial user profile preferences and intent.

---

## 5. Customer Account & Dashboard Pages

- **Account Profile (`/account`)**  
  Central customer profile management page for updating personal information and security credentials.

- **Dashboard Overview (`/dashboard`)**  
  Unified customer hub displaying recent orders, active downloads, and quick support access.

- **Order History (`/account/orders`)**  
  Comprehensive listing of all past system purchases and custom development orders associated with the account.

- **Order Details (`/account/orders/[orderNumber]`)**  
  Detailed receipt view for a specific order displaying itemized line items, license summary, and download access.

- **My Downloads (`/account/downloads`)**  
  Centralized repository of all owned software packages and corresponding active download links.

- **Customer Support (`/account/support`)**  
  Support portal for creating, viewing, and tracking technical help tickets and customer inquiries.

---

## 6. Legal & Policy Pages

- **Terms of Service (`/legal/terms`)**  
  Binding legal terms outlining platform usage rules, user responsibilities, and service obligations.

- **Privacy Policy (`/legal/privacy`)**  
  Privacy compliance declaration describing data collection, usage, storage, and customer privacy protections.

- **Delivery Policy (`/legal/delivery`)**  
  Explicit policy defining digital file delivery methods, download link expirations, and access limits.

- **Software License Agreement (`/legal/license`)**  
  Commercial source code license terms defining permissions, usage restrictions, and intellectual property rights.

- **Refund Policy (`/legal/refunds`)**  
  Transparent guidelines governing refund eligibility, digital asset return exceptions, and handling procedures.

---

## 7. Admin Panel Tabs & Workspaces

- **Overview (`/admin`)**  
  Central executive dashboard presenting business performance metrics, recent sales activity, system health, and high-level platform alerts.

- **Systems (`/admin/systems`)**  
  Product catalog management interface for creating, editing, publishing, archiving, and uploading source deliverables for ready-made systems.
  - *New System (`/admin/systems/new`)*: Form workspace for publishing new software products to the public catalog.
  - *Edit System (`/admin/systems/[id]/edit`)*: Editor interface for updating pricing, media, versions, and technical metadata of an existing system.

- **Categories (`/admin/categories`)**  
  Organization panel for managing catalog taxonomies, category slugs, display ordering, and system tagging.

- **Media (`/admin/media`)**  
  Assets workspace for uploading, storing, and organizing product screenshots, system preview graphics, and marketing images.

- **Content (`/admin/content`)**  
  Management hub for updating dynamic marketing content, editorial copy, site announcements, and homepage hero messaging.

- **Inquiries (`/admin/inquiries`)**  
  Lead management dashboard for reviewing, filtering, and responding to client custom development quotes and contact submissions.

- **Orders (`/admin/orders`)**  
  Commercial ledger for tracking customer orders and PayPal status, explicitly issuing fulfillments, and managing refunds. Legacy provider records remain read-only historical entries.

- **Support (`/admin/support`)**  
  Helpdesk management panel for triaging customer support tickets, assigning priorities, and sending official resolution responses.

- **Audit Log (`/admin/audit-log`)**  
  Security and compliance log tracking all administrative actions, data mutations, settings changes, and authentication events.

- **Settings (`/admin/settings`)**  
  Platform control panel for managing administrator roles, integration credentials (Supabase, PayPal, Resend), and system configuration.

- **Sellers (`/admin/sellers`)**  
  Administrator workspace for reviewing registered software vendors, seller permissions, and payout settings.
