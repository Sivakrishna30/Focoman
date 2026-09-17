"use server";

import { requireVerifiedUser, requireStudioMember } from "@/lib/serverAuth";
import { getMarketplaceProfile, upsertMarketplaceProfile, searchMarketplaceProfiles, getMarketplaceProfileBySlug } from "@focoman/db";
import { MarketplaceProfile } from "@focoman/types";

export async function fetchMarketplaceProfile(studioId: string, idToken: string) {
  try {
    const decoded = await requireVerifiedUser(idToken);
    await requireStudioMember(decoded.uid, studioId);
    
    const profile = await getMarketplaceProfile(studioId);
    return { success: true, profile };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveMarketplaceProfile(studioId: string, profileData: Partial<Omit<MarketplaceProfile, 'id' | 'studioId' | 'verifiedMetrics' | 'createdAt' | 'updatedAt'>>, idToken: string) {
  try {
    const decoded = await requireVerifiedUser(idToken);
    const authContext = await requireStudioMember(decoded.uid, studioId, "STUDIO_OWNER");
    
    const profile = await upsertMarketplaceProfile(studioId, profileData);
    return { success: true, profile };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function searchPublicMarketplace(city?: string, tags?: string[]) {
  // No auth required - public search
  try {
    const profiles = await searchMarketplaceProfiles({ city, tags });
    return { success: true, profiles };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPublicMarketplaceProfile(slug: string) {
  // No auth required - public viewing
  try {
    const profile = await getMarketplaceProfileBySlug(slug);
    if (!profile) return { success: false, error: "Profile not found or is not public." };
    return { success: true, profile };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
