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
  "Water Included",
  "Electricity Included",
  "Shared Accommodation",
];

export const SUBSCRIPTION_PLANS = {
  // For landlords to list properties
  landlord_monthly: {
    price: 10000,
    duration: "month",
    type: "landlord",
    listingDuration: 2, // months
    features: {
      en: [
        "List properties for 2 months",
        "Up to 10 property listings",
        "Photo and video uploads",
        "Tenant messaging system",
        "Basic property analytics",
      ],
      fr: [
        "Lister les propriétés pendant 2 mois",
        "Jusqu'à 10 annonces de propriétés",
        "Téléchargement de photos et vidéos",
        "Système de messagerie locataires",
        "Analyses de base des propriétés",
      ]
    },
  },
  landlord_yearly: {
    price: 80000,
    duration: "year",
    type: "landlord",
    listingDuration: 12, // months
    features: {
      en: [
        "List properties for 12 months",
        "Unlimited property listings",
        "Premium photo and video uploads",
        "Priority tenant messaging",
        "Advanced property analytics",
        "Featured listings boost",
      ],
      fr: [
        "Lister les propriétés pendant 12 mois",
        "Annonces de propriétés illimitées",
        "Téléchargements premium photos/vidéos",
        "Messagerie locataires prioritaire",
        "Analyses avancées des propriétés",
        "Boost des annonces en vedette",
      ]
    },
    savings: {
      en: "Save 33%",
      fr: "Économisez 33%"
    },
  },
  // For renters to search properties (free)
  renter_free: {
    price: 0,
    duration: "unlimited",
    type: "renter",
    features: {
      en: [
        "Browse all properties",
        "Contact landlords directly",
        "Save favorite properties",
        "Basic search filters",
        "Property comparison",
      ],
      fr: [
        "Parcourir toutes les propriétés",
        "Contacter directement les propriétaires",
        "Sauvegarder les propriétés favorites",
        "Filtres de recherche de base",
        "Comparaison de propriétés",
      ]
    },
  },
};

// Simple translation function
export function useTranslation(lang: 'en' | 'fr' = 'en') {
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      // Hero section
      heroTitle: {
        en: "Find Your Perfect Stay in Cameroon",
        fr: "Trouvez Votre Séjour Parfait au Cameroun"
      },
      heroSubtitle: {
        en: "Discover comfortable accommodations across all 10 regions with verified hosts and secure payments",
        fr: "Découvrez des hébergements confortables dans les 10 régions avec des hôtes vérifiés et des paiements sécurisés"
      },
      searchPlaceholder: {
        en: "Search by city, region, or property type...",
        fr: "Rechercher par ville, région ou type de propriété..."
      },
      viewAllProperties: {
        en: "View All Properties",
        fr: "Voir Toutes les Propriétés"
      },
      exploreRegions: {
        en: "Explore Cameroon's Regions",
        fr: "Explorez les Régions du Cameroun"
      },
      exploreRegionsSubtitle: {
        en: "From the coastal beauty of Littoral to the cultural richness of the West, discover accommodations across all 10 regions",
        fr: "De la beauté côtière du Littoral à la richesse culturelle de l'Ouest, découvrez des hébergements dans les 10 régions"
      },
      listPropertyToday: {
        en: "List Your Property Today",
        fr: "Listez Votre Propriété Aujourd'hui"
      },
      verifiedListings: {
        en: "Verified Listings",
        fr: "Annonces Vérifiées"
      },
      verifiedListingsDesc: {
        en: "All hosts are verified with national ID for guest safety and trust",
        fr: "Tous les hôtes sont vérifiés avec une pièce d'identité nationale pour la sécurité et la confiance des clients"
      },
      mobilePayments: {
        en: "Mobile Payments",
        fr: "Paiements Mobiles"
      },
      mobilePaymentsDesc: {
        en: "Accept payments via MTN, Orange Money, and bank transfers",
        fr: "Acceptez les paiements via MTN, Orange Money et virements bancaires"
      },
      monthlySubscription: {
        en: "Monthly Subscription",
        fr: "Abonnement Mensuel"
      },
      featuredPropertiesMainPage: {
        en: "Featured Properties",
        fr: "Propriétés en Vedette"
      },
      featuredPropertiesMainPageDesc: {
        en: "Discover our most popular accommodations, carefully selected for their quality, location, and exceptional host service.",
        fr: "Découvrez nos hébergements les plus populaires, soigneusement sélectionnés pour leur qualité, leur emplacement et leur service d'hôte exceptionnel."
      },
      yearlySubscription: {
        en: "Yearly Subscription",
        fr: "Abonnement Annuel"
      },
      temperature: {
        en: "Temperature:",
        fr: "Température:"
      },
      population: {
        en: "Population:",
        fr: "Population:"
      },
      popularLocations: {
        en: "Popular Locations:",
        fr: "Lieux Populaires:"
      },
      keyAttractions: {
        en: "Key Attractions:",
        fr: "Attractions Principales:"
      },
      exploreProperties: {
        en: "Explore Properties",
        fr: "Explorer les Propriétés"
      },
      chooseMonthly: {
        en: "Choose Monthly",
        fr: "Choisir Mensuel"
      },
      chooseYearly: {
        en: "Choose Yearly",
        fr: "Choisir Annuel"
      },
      perMonth: {
        en: "per month",
        fr: "par mois"
      },
      perYear: {
        en: "per year",
        fr: "par an"
      },
      startHostingToday: {
        en: "Start Hosting Today",
        fr: "Commencer l'Hébergement Aujourd'hui"
      },
      learnMore: {
        en: "Learn More",
        fr: "En Savoir Plus"
      }
    };

    return translations[key]?.[lang] || key;
  };

  return { t, lang };
}
