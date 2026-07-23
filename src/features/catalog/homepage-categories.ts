export type HomepageCategory = {
  index: string;
  audience: "Business" | "Students" | "Students + Business";
  name: string;
  description: string;
  href: string;
  emphasis?: "light" | "brand";
};

/**
 * Phase 1 presentation data only. Public systems and categories will be loaded
 * from the administrator-controlled catalog once Supabase is introduced.
 */
export const homepageCategories: HomepageCategory[] = [
  {
    index: "01",
    audience: "Business",
    name: "Point of sale",
    description: "Explore systems designed around sales, transactions, and operational visibility.",
    href: "#businesses",
    emphasis: "light",
  },
  {
    index: "02",
    audience: "Business",
    name: "Inventory management",
    description: "Organize stock, movements, records, and day-to-day inventory workflows.",
    href: "#businesses",
  },
  {
    index: "03",
    audience: "Business",
    name: "Warehouse management",
    description: "Support receiving, storage, tracking, and warehouse operations.",
    href: "#businesses",
  },
  {
    index: "04",
    audience: "Students",
    name: "Capstone systems",
    description: "Practical technical foundations for ethical student project development.",
    href: "#students",
  },
  {
    index: "05",
    audience: "Students",
    name: "Thesis-related systems",
    description: "Technical systems and guidance that respect academic requirements.",
    href: "#students",
  },
  {
    index: "06",
    audience: "Students + Business",
    name: "Custom development",
    description: "Start with your goals and requirements, then receive a tailored scope and quotation.",
    href: "#custom",
    emphasis: "brand",
  },
];