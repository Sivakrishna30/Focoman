import { PLAN_CAPABILITIES, PLAN_PRICES, TRIAL_DURATION_DAYS } from '@focoman/config';
import { CapabilityId, PlanType, StudioPlan } from '@focoman/types';
import { getStudioPlan as getStudioPlanFromDb, upsertStudioPlan as upsertStudioPlanInDb } from '@focoman/db'; // Assume db exports these

/**
 * Resolve the effective plan for a studio, considering trial status.
 * If the studio is currently in trial, the effective plan is COMPLETE.
 */
export function getEffectivePlan(studioPlan?: StudioPlan): PlanType {
  if (!studioPlan) return 'FREE';
  if (studioPlan.isTrial && studioPlan.trialExpiresAt) {
    const now = new Date();
    const expires = new Date(studioPlan.trialExpiresAt);
    if (now <= expires) {
      return 'COMPLETE';
    }
  }
  return studioPlan.plan;
}

/**
 * Returns true if the given capability is available for the studio's effective plan.
 */
export function hasCapability(capability: CapabilityId, studioPlan?: StudioPlan): boolean {
  const effectivePlan = getEffectivePlan(studioPlan);
  const caps = PLAN_CAPABILITIES[effectivePlan] ?? [];
  return caps.includes(capability);
}

/**
 * Checks if a trial is still active.
 */
export function isTrialActive(studioPlan?: StudioPlan): boolean {
  if (!studioPlan?.isTrial) return false;
  if (!studioPlan.trialExpiresAt) return false;
  return new Date() <= new Date(studioPlan.trialExpiresAt);
}

/**
 * Checks if a trial has expired.
 */
export function isTrialExpired(studioPlan?: StudioPlan): boolean {
  if (!studioPlan?.isTrial) return false;
  if (!studioPlan.trialExpiresAt) return false;
  return new Date() > new Date(studioPlan.trialExpiresAt);
}

/**
 * Returns the plan that the studio should fall back to after trial expiry.
 * By spec, it falls back to FREE.
 */
export function getEffectivePlanAfterTrial(studioPlan?: StudioPlan): PlanType {
  if (!studioPlan) return 'FREE';
  if (studioPlan.isTrial && isTrialExpired(studioPlan)) {
    return 'FREE';
  }
  return studioPlan.plan;
}

/**
 * Initialize a studio with a FREE plan and start a 14‑day trial.
 * This should be called when a new studio document is created.
 */
export async function initializeStudioPlan(studioId: string, nowIso: string = new Date().toISOString()): Promise<void> {
  const trialExpires = new Date();
  trialExpires.setDate(trialExpires.getDate() + TRIAL_DURATION_DAYS);
  const plan: StudioPlan = {
    plan: 'FREE',
    isTrial: true,
    trialStartedAt: nowIso,
    trialExpiresAt: trialExpires.toISOString(),
    updatedAt: nowIso,
  };
  await upsertStudioPlanInDb(studioId, plan);
}

/**
 * Change a studio's plan (admin / owner only).
 * Does NOT affect existing data – data is retained.
 */
export async function updateStudioPlan(studioId: string, newPlan: PlanType, nowIso: string = new Date().toISOString()): Promise<void> {
  const existing = await getStudioPlanFromDb(studioId);
  const plan: StudioPlan = {
    plan: newPlan,
    isTrial: false,
    updatedAt: nowIso,
  };
  // Preserve trial fields if they existed
  if (existing?.isTrial) {
    plan.isTrial = false; // ending trial on upgrade/downgrade
  }
  await upsertStudioPlanInDb(studioId, plan);
}
