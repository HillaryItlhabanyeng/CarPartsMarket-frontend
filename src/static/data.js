export const navItems = [
  { title: "Home", url: "/" },
  { title: "Find Parts", url: "/products" },
  { title: "My Vehicle", url: "/vehicle-fitment" },
  { title: "Best Sellers", url: "/best-selling" },
  { title: "FAQ", url: "/faq" },
];

export const categoriesData = [
  { id: "engine", title: "Engine Parts", subTitle: "Filters, belts, gaskets", image_Url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format&fit=crop&q=80" },
  { id: "brakes", title: "Brake System", subTitle: "Pads, discs, calipers", image_Url: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80" },
  { id: "suspension", title: "Suspension", subTitle: "Shocks, struts, arms", image_Url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80" },
  { id: "electrical", title: "Electrical", subTitle: "Batteries, sensors, lights", image_Url: "https://images.unsplash.com/photo-1601891339409-0a4e3a0f9f7f?w=600&auto=format&fit=crop&q=80" },
  { id: "body", title: "Body Parts", subTitle: "Panels, mirrors, trim", image_Url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80" },
  { id: "cooling", title: "Cooling System", subTitle: "Radiators, pumps, hoses", image_Url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&auto=format&fit=crop&q=80" },
  { id: "transmission", title: "Transmission", subTitle: "Clutch and gearbox parts", image_Url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80" },
  { id: "exhaust", title: "Exhaust", subTitle: "Mufflers, pipes, sensors", image_Url: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=600&auto=format&fit=crop&q=80" },
  { id: "service", title: "Service Parts", subTitle: "Oil, filters, plugs", image_Url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80" },
  { id: "accessories", title: "Accessories", subTitle: "Mats, covers, tools", image_Url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80" },
];

export const productData = [
  {
    id: 1,
    category: "Brake System",
    name: "Front brake pad set",
    description: "Premium replacement front brake pads with vehicle-specific fitment.",
    image_Url: [{ public_id: "demo", url: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=700&auto=format&fit=crop&q=80" }],
    shop: { name: "Demo Auto Parts", ratings: 4.8 },
    price: 950,
    discount_price: 799,
    rating: 4.8,
    total_sell: 54,
    stock: 12,
    vehicleMake: "Toyota",
    vehicleModel: "Hilux",
    vehicleYear: "2018",
    engineVariant: "2.8 GD-6",
  },
  {
    id: 2,
    category: "Service Parts",
    name: "Engine oil filter",
    description: "High-quality replacement oil filter for scheduled vehicle servicing.",
    image_Url: [{ public_id: "demo", url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=700&auto=format&fit=crop&q=80" }],
    shop: { name: "Demo Auto Parts", ratings: 4.7 },
    price: 280,
    discount_price: 229,
    rating: 4.7,
    total_sell: 81,
    stock: 24,
    vehicleMake: "Toyota",
    vehicleModel: "Corolla",
    vehicleYear: "2020",
  },
];

export const footerProductLinks = [
  { name: "Find Parts", link: "/products" },
  { name: "Best Sellers", link: "/best-selling" },
  { name: "My Vehicle", link: "/vehicle-fitment" },
  { name: "Categories", link: "/products" },
];

export const footercompanyLinks = [
  { name: "Buyer", link: "/profile" },
  { name: "Seller", link: "/shop-login" },
  { name: "Vehicle Fitment", link: "/vehicle-fitment" },
  { name: "Orders", link: "/profile" },
];

export const footerSupportLinks = [
  { name: "FAQ", link: "/faq" },
  { name: "Contact Us", link: "/inbox" },
  { name: "Shipping", link: "/faq" },
  { name: "Returns", link: "/faq" },
];
