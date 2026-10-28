/**
 * Focoman Pro Entitlements & Lifetime Test Accounts System
 *
 * Provides centralized checking for:
 * 1. Whitelisted lifetime test accounts (zero payment, perpetual full Pro).
 * 2. Modular capability verification across Basic vs Pro tiers.
 * 3. Data preservation rules: unselected modules retain historic data without data loss.
 */

export const LIFETIME_PRO_EMAILS: readonly string[] = [
  "sivakrishna.era@gmail.com",
  "unpredictable.knucklehead.era@gmail.com",
  "randyrajesh678@gmail.com",
  "sweetchinmusixyt@gmail.com",
] as const;

/**
 * Checks whether an email address belongs to a whitelisted lifetime Pro test account.
 */
export function isLifetimeProEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return LIFETIME_PRO_EMAILS.some((item) => item.toLowerCase() === clean);
}

/**
 * Evaluates whether a studio possesses Pro access based on owner email whitelist or active subscription plan.
 */
export function isStudioProEntitled(
  ownerEmail?: string | null,
  planInfo?: { plan?: string; selectedCapabilities?: string[] } | null
): boolean {
  if (isLifetimeProEmail(ownerEmail)) return true;
  if (!planInfo) return false;
  return (
    planInfo.plan === "COMPLETE" ||
    planInfo.plan === "PROFESSIONAL" ||
    (Array.isArray(planInfo.selectedCapabilities) && planInfo.selectedCapabilities.length > 0)
  );
}

/**
 * Returns effective features for a studio:
 * - Lifetime Pro accounts always receive all modules enabled (oms, crm, erp, whatsapp, reports, marketplace).
 * - Standard accounts receive their explicitly enabled modules or default to basic free core (oms + marketplace).
 */
export function getEffectiveStudioFeatures(
  ownerEmail?: string | null,
  configuredFeatures?: {
    oms?: boolean;
    crm?: boolean;
    erp?: boolean;
    whatsapp?: boolean;
    reports?: boolean;
    marketplace?: boolean;
  } | null,
  planInfo?: { plan?: string; selectedCapabilities?: string[] } | null
) {
  if (isLifetimeProEmail(ownerEmail) || planInfo?.plan === "COMPLETE" || planInfo?.plan === "PROFESSIONAL") {
    return {
      oms: true,
      crm: true,
      erp: true,
      whatsapp: true,
      reports: true,
      marketplace: true,
    };
  }

  return {
    oms: configuredFeatures?.oms ?? true,
    crm: configuredFeatures?.crm ?? false,
    erp: configuredFeatures?.erp ?? false,
    whatsapp: configuredFeatures?.whatsapp ?? false,
    reports: configuredFeatures?.reports ?? false,
    marketplace: true,
  };
}
