export const CAMEROON_REGIONS = [
  { id: 1, name: "Centre", slug: "centre" },
  { id: 2, name: "Littoral", slug: "littoral" },
  { id: 3, name: "West", slug: "west" },
  { id: 4, name: "Southwest", slug: "southwest" },
  { id: 5, name: "Northwest", slug: "northwest" },
  { id: 6, name: "East", slug: "east" },
  { id: 7, name: "Adamawa", slug: "adamawa" },
  { id: 8, name: "North", slug: "north" },
  { id: 9, name: "Far North", slug: "far-north" },
  { id: 10, name: "South", slug: "south" },
];

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "guestHouse", label: "Guest House" },
  { value: "room", label: "Room" },
  { value: "studio", label: "Studio" },
  { value: "officeSpace", label: "Office Space" },
  { value: "commercial", label: "Commercial" },
];

export const CONTRACT_TYPES = [
  { value: "short_stay", label: "Short Stay" },
  { value: "long_stay", label: "Long Stay" },
  { value: "daily", label: "Daily" },
  { value: "monthly", label: "Monthly" },
];

export const AMENITIES = [
  "Wi-Fi",
  "Kitchen",
  "Parking",
  "A/C",
  "Pet Friendly",
  "Swimming Pool",
  "Gym",
  "Laundry",
  "Balcony",
  "Garden",
  "Security",
  "Generator",
];

export const SUBSCRIPTION_PLANS = {
  monthly: {
    price: 10000,
    duration: "month",
    features: [
      "Up to 5 property listings",
      "Photo uploads",
      "Guest messaging system",
      "Chat support",
      "Basic analytics",
    ],
  },
  yearly: {
    price: 80000,
    duration: "year",
    features: [
      "Unlimited property listings",
      "Photo & video uploads",
      "Priority search placement",
      "Advanced analytics dashboard",
      "Contract templates",
      "Guest messaging system",
      "Chat support",
      "Priority support",
    ],
    savings: "Save 33%",
  },
};
