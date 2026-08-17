export type UserProfile = {
  id: string;
  email: string | null;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
  country: string | null;
  bio: string | null;
  buyerEnabled: boolean;
  sellerEnabled: boolean;
  sellerStatus: "none" | "pending_review" | "approved" | "rejected";
  interests: string[];
  onboardingCompleted: boolean;
  createdAt: string;
};

export type SellerProfile = {
  profileId: string;
  displayName: string;
  bio: string | null;
  country: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  bannerImageUrl: string | null;
  bankDetails: Record<string, unknown> | null;
  status: "pending_review" | "approved" | "rejected";
  adminNotes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
};
