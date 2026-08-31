import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { DevelopmentNoticeBanner } from "@/components/marketing/development-notice-banner";
import { SiteNavigation } from "@/components/marketing/site-navigation";
import { getPublicSiteContent } from "@/features/content/site-content-repository";

export async function SiteHeader() {
  const { announcement } = await getPublicSiteContent();
  return (
    <>
      <AnnouncementBar announcement={announcement} />
      <SiteNavigation />
      <DevelopmentNoticeBanner />
    </>
  );
}

