export type LaunchReadinessIssue = { code: string; variable: string };
export function checkLaunchReadiness(environment: Record<string, string | undefined>): LaunchReadinessIssue[];
