export type SellerStatus = "Verified" | "Pending" | "Inactive";

export interface FishSeedSeller {
  id: string;
  name: string;
  hatcheryName: string;
  phone: string;
  district: string;
  locationDetails: string;
  fishTypes: string[];
  capacityPerMonth: string;
  status: SellerStatus;
  rating: number;
  joinedDate: string;
}

export type NewFishSeedSellerInput = Omit<FishSeedSeller, "id" | "joinedDate" | "rating">;
