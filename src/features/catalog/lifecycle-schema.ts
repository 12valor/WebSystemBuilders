import { z } from "zod";

export const systemLifecycleStatusSchema = z.enum([
  "draft",
  "published",
  "unlisted",
  "archived",
]);

export type SystemLifecycleStatus = z.infer<typeof systemLifecycleStatusSchema>;

export const archiveSystemConfirmationSchema = z.literal("archive");

export function canUnpublishSystem(status: SystemLifecycleStatus) {
  return status === "published";
}

export function canArchiveSystem(status: SystemLifecycleStatus) {
  return status !== "archived";
}
