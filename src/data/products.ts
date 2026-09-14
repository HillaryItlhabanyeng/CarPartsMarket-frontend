export type ProductCategory = "Electronics" | "Books" | "Furniture" | "Clothing" | "Other";
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
export const categories: Array<"All Categories" | ProductCategory> = ["All Categories", "Electronics", "Books", "Furniture", "Clothing", "Other"];

export const products: Product[] = [
  { id: "1", title: "Proline Intel Celeron Laptop", description: "Reliable laptop for lectures, assignments and everyday student work.", price: 3699, location: "Bellville Campus", image: "/laptop.jpg", category: "Electronics", condition: "Good", seller: "Sipho M.", createdAt: "2026-09-05" },
  { id: "2", title: "A4 Counter Books - 3 Quire", description: "A set of clean, unused counter books for notes and coursework.", price: 40, location: "Wellington Campus", image: "/a4.jpg", category: "Books", condition: "New", seller: "Naledi K.", createdAt: "2026-09-04" },
  { id: "3", title: "Laptop Cooling Pad", description: "USB cooling pad with quiet fans to keep your laptop comfortable during long study sessions.", price: 250, location: "Mowbray Campus", image: "/coolpad.jpg", category: "Electronics", condition: "Like New", seller: "Thabo R.", createdAt: "2026-09-03" },
  { id: "4", title: "Deli Scientific Calculator", description: "Student-friendly scientific calculator in excellent working condition.", price: 550, location: "District 6 Campus", image: "/calculator.jpg", category: "Electronics", condition: "Good", seller: "Ayesha P.", createdAt: "2026-09-02" },
  { id: "5", title: "iPhone 11 64GB", description: "Unlocked iPhone 11 with a bright display and dependable battery life.", price: 5200, location: "District 6 Campus", image: "/iphone.jpg", category: "Electronics", condition: "Good", seller: "Lerato N.", createdAt: "2026-09-01" },
  { id: "6", title: "Bugani FreeBuds B20", description: "Wireless earbuds with charging case, suitable for calls and study playlists.", price: 930, location: "Mowbray Campus", image: "/earbuds.jpg", category: "Electronics", condition: "Like New", seller: "Wazeer S.", createdAt: "2026-08-30" },
  { id: "7", title: "Nortik Home Office Desk", description: "Compact desk with enough space for a laptop, books and a desk lamp.", price: 1500, location: "Wellington Campus", image: "/desks.jpg", category: "Furniture", condition: "Good", seller: "Thabo R.", createdAt: "2026-08-29" },
  { id: "8", title: "Brightup Backpack", description: "Durable everyday backpack with a padded laptop sleeve.", price: 765, location: "Bellville Campus", image: "/backpack.jpg", category: "Other", condition: "Like New", seller: "Sipho M.", createdAt: "2026-08-28" },
  { id: "9", title: "Introduction to Economics", description: "Well-kept prescribed economics textbook with helpful highlighted sections.", price: 180, location: "Bellville Campus", image: "/old.jpg", category: "Books", condition: "Good", seller: "Lerato N.", createdAt: "2026-08-27" },
  { id: "10", title: "Campus Hoodie", description: "Warm navy hoodie for cool lecture mornings and campus walks.", price: 320, location: "Mowbray Campus", image: "/hoodie.jpg", category: "Clothing", condition: "Like New", seller: "Ayesha P.", createdAt: "2026-08-26" },
  { id: "11", title: "Adidas Campus Sneakers", description: "Comfortable Adidas sneakers with plenty of life left in them.", price: 850, location: "District 6 Campus", image: "/adidas.jpg", category: "Clothing", condition: "Good", seller: "Wazeer S.", createdAt: "2026-08-25" },
  { id: "12", title: "Study Desk Chair", description: "Supportive chair with adjustable height for a home study setup.", price: 700, location: "Bellville Campus", image: "/selo.jpg", category: "Furniture", condition: "Fair", seller: "Naledi K.", createdAt: "2026-08-24" },
  { id: "13", title: "MacBook Carry Sleeve", description: "Padded protective sleeve for a 13-inch laptop.", price: 280, location: "Wellington Campus", image: "/macOS.png", category: "Other", condition: "New", seller: "Sipho M.", createdAt: "2026-08-23" },
  { id: "14", title: "Kitchen Starter Set", description: "Useful starter kitchen items for a student residence or first flat.", price: 420, location: "Mowbray Campus", image: "/kitchen.jpg", category: "Other", condition: "Good", seller: "Lerato N.", createdAt: "2026-08-22" },
  { id: "15", title: "Business Statistics Guide", description: "Concise study guide with practice questions and worked examples.", price: 150, location: "District 6 Campus", image: "/books.png", category: "Books", condition: "Like New", seller: "Ayesha P.", createdAt: "2026-08-21" },
  { id: "16", title: "Portable Bluetooth Speaker", description: "Compact speaker with clear sound for residence rooms and outdoor study breaks.", price: 460, location: "Bellville Campus", image: "/mac.png", category: "Electronics", condition: "Good", seller: "Wazeer S.", createdAt: "2026-08-20" },
  { id: "17", title: "Puma Training Jacket", description: "Lightweight training jacket suitable for sport and everyday wear.", price: 390, location: "Wellington Campus", image: "/puma.png", category: "Clothing", condition: "Good", seller: "Thabo R.", createdAt: "2026-08-19" },
  { id: "18", title: "Bedding Set", description: "Fresh, clean bedding set in a simple neutral pattern.", price: 600, location: "Mowbray Campus", image: "/bedding.jpg", category: "Other", condition: "Like New", seller: "Naledi K.", createdAt: "2026-08-18" },
];

export const getProduct = (id: string) => products.find((product) => product.id === id);