const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export interface MarketplaceStudio { studioId: string; brandName: string; studioName: string; city: string; email: string; mobile: string; prefix: string; }
const FALLBACK_STUDIOS: MarketplaceStudio[] = [
  { studioId: "STU-100201", brandName: "Luminary Studios", studioName: "Luminary Wedding Studios", city: "Hyderabad", email: "rajesh@luminary.com", mobile: "+91 98765 43210", prefix: "RAJ" },
  { studioId: "STU-100202", brandName: "Chennai Frames", studioName: "Chennai Frames Studio", city: "Chennai", email: "hello@chennaiframes.in", mobile: "+91 98840 11223", prefix: "CHN" },
  { studioId: "STU-100203", brandName: "Madras Lens", studioName: "Madras Lens Collective", city: "Chennai", email: "book@madraslens.in", mobile: "+91 99401 22334", prefix: "MAD" },
  { studioId: "STU-100204", brandName: "Moment Makers Mumbai", studioName: "Mumbai Moment Makers", city: "Mumbai", email: "hello@momentmakers.in", mobile: "+91 98201 33445", prefix: "MUM" },
  { studioId: "STU-100205", brandName: "Story Studio Bangalore", studioName: "Bangalore Story Studio", city: "Bangalore", email: "book@storystudio.in", mobile: "+91 99000 44556", prefix: "BLR" },
];
export const marketplaceApi = { getStudios: async (city?: string): Promise<MarketplaceStudio[]> => { const query = city ? `?city=${encodeURIComponent(city)}` : ""; try { const response = await fetch(`${BACKEND_BASE_URL}/api/marketplace/studios${query}`); if (!response.ok) throw new Error("Marketplace request failed"); return await response.json(); } catch { return city ? FALLBACK_STUDIOS.filter((studio) => studio.city === city) : FALLBACK_STUDIOS; } } };
