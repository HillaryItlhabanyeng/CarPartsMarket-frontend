export type ProductCategory = "Electronics" | "Engines" | "Body" | "Interior" | "Transmissions" | "Braking system"| "Suspensions" | "Fuel system" | "Exhausts"| "Cooling system" | "Fluids" | "Other";
export type ProductCondition = "New" | "Like New" | "Good" | "Fair";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image: string;
  category: ProductCategory;
  condition: ProductCondition;
  seller: string;
  createdAt: string;
};

export const locations = ["Bellville Campus", "District 6 Campus", "Mowbray Campus", "Wellington Campus"];
export const conditions: Array<"All" | ProductCondition> = ["All", "New", "Like New", "Good", "Fair"];
export const categories: Array<"All Categories" | ProductCategory> = ["All Categories", "Electronics", "Engines", "Body", "Interior","Transmissions", "Braking system", "Suspensions", "Fuel system", "Exhausts", "Cooling system", "Fluids", "Other"];

export const products: Product[] = [
  { id: "1", title: "12V Battery", description: "Reliable Battery", price: 3699, location: "Bellville", image: "/12v.jpg", category: "Electronics", condition: "Good", seller: " ", createdAt: "2026-09-05" },
  { id: "2", title: "Absober", description: " ", price: 400, location: "Wellington", image: "/absorber.jpg", category: "Transmissions", condition: "New", seller: "Naledi K.", createdAt: "2026-09-04" },
  { id: "3", title: "Batteries", description: " ", price: 250, location: "Mowbray", image: "/batteries.jpg", category: "Electronics", condition: "Like New", seller: "Thabo R.", createdAt: "2026-09-03" },
  { id: "4", title: "Brake pad", description: " ", price: 550, location: "District 6", image: "/brakepad.jpg", category: "Braking system", condition: "Good", seller: "Ayesha P.", createdAt: "2026-09-02" },
  { id: "5", title: "Brakes", description: " ", price: 5200, location: "Durban", image: "/brakes.jpg", category: "Braking system", condition: "Good", seller: "Lerato N.", createdAt: "2026-09-01" },
  { id: "6", title: "clutch", description: " ", price: 930, location: "Mthatha", image: "/clutch.png", category: "Braking system", condition: "Like New", seller: "Wazeer S.", createdAt: "2026-08-30" },
  { id: "7", title: "Steering cover", description: " ", price: 1500, location: "Gorge", image: "/cover.jpg", category: "Interior", condition: "Good", seller: "Thabo R.", createdAt: "2026-08-29" },
  { id: "8", title: "Engine parts", description: " ", price: 765, location: "Bellville", image: "/engine parts.jpg", category: "Engines", condition: "Like New", seller: "Sipho M.", createdAt: "2026-08-28" },
  { id: "9", title: "Engine oil", description: " ", price: 180, location: "Gqeberha", image: "/engineoil.jpg", category: "Fluids", condition: "Good", seller: "Lerato N.", createdAt: "2026-08-27" },
  { id: "10", title: "Exhaust-muffler", description: " ", price: 320, location: "Mount Frere", image: "/exhaust-muffler.jpg", category: "Exhausts", condition: "Like New", seller: "Ayesha P.", createdAt: "2026-08-26" },
  { id: "11", title: "BMW headlights", description: " ", price: 850, location: "Kokstad", image: "/headlights.png", category: "Electronics", condition: "Good", seller: "Wazeer S.", createdAt: "2026-08-25" },
  { id: "12", title: "Led light", description: " ", price: 700, location: "Lephalale", image: "/led.jpg", category: "Electronics", condition: "Fair", seller: "Naledi K.", createdAt: "2026-08-24" },
  { id: "13", title: "Headlights", description: " ", price: 280, location: "Komani", image: "/lights.jpg", category: "Electronics", condition: "New", seller: "Sipho M.", createdAt: "2026-08-23" },
  { id: "14", title: "Sockets", description: " ", price: 420, location: "Soweto", image: "/sockets.jpg", category: "Other", condition: "Good", seller: "Lerato N.", createdAt: "2026-08-22" },
  { id: "15", title: "Spark plug set", description: " ", price: 150, location: "District 6 Campus", image: "/spark plug set.jpg", category: "Other", condition: "Like New", seller: "Ayesha P.", createdAt: "2026-08-21" },
  { id: "16", title: "Suspension", description: " ", price: 460, location: "Langa", image: "/suspension.jpg", category: "Suspensions", condition: "Good", seller: "Wazeer S.", createdAt: "2026-08-20" },
  { id: "17", title: "4 x Tires", description: "", price: 390, location: "Musina", image: "/tryes.jpg", category: "Body", condition: "Good", seller: "Thabo R.", createdAt: "2026-08-19" },
  { id: "18", title: "Transmission", description: " ", price: 600, location: "Mowbray", image: "/transmissions.png", category: "Transmissions", condition: "Like New", seller: "Naledi K.", createdAt: "2026-08-18" },
];

export const getProduct = (id: string) => products.find((product) => product.id === id);