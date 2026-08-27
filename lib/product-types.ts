export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  unit: string;
  thumbnail: string;
  createdAt: string;
  sellerName?: string;
  sellerDistrict?: string;
  sellerPhone?: string;
};

export const PRODUCT_CATEGORIES = [
  "Fish seed / মাছের পোনা",
  "Fisheries medicine / chemical",
  "Dairy medicine",
  "Human food",
  "Fish feed / raw materials",
  "Dairy feed / raw materials",
  "Import items",
] as const;

export const PRODUCT_UNITS = ["kg", "gram", "litre", "piece", "dozen", "pack", "thousand / হাজার"] as const;

export const BANGLADESH_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogra (Bogura)", "Brahmanbaria", 
  "Chandpur", "Chittagong (Chattogram)", "Chuadanga", "Comilla (Cumilla)", "Cox's Bazar", 
  "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", 
  "Jamalpur", "Jessore (Jashore)", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", 
  "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", 
  "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", 
  "Narail", "Narayanganj", "Narsingdi", "Natore", "Nawabganj (Chapainawabganj)", "Netrokona", 
  "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", 
  "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", 
  "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
] as const;

