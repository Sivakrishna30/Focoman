/**
 * Focoman Marketplace API Service
 * Phase 3 / Future Capability per Focoman Product Discovery Document
 */

export interface MarketplaceStudio {
  studioId: string;
  brandName: string;
  studioName: string;
  city: string;
  email: string;
  mobile: string;
  prefix: string;
}

export const marketplaceApi = {
  getStudios: async (city?: string): Promise<MarketplaceStudio[]> => {
    // Marketplace is a Phase 3 direction. Return empty real list or query real Firestore collection when configured.
    return [];
  }
};
