import { getFishSeedSellers } from "@/lib/sellers";
import { SellersContent } from "./sellers-content";

export const revalidate = 0;

export default async function SellersPage() {
  const sellers = await getFishSeedSellers();

  return <SellersContent sellers={sellers} />;
}
