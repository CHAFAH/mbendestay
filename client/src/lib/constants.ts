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
  { value: "apartment", label: "Apartment", icon: "🏢", description: "Modern apartments in urban areas" },
  { value: "guestHouse", label: "Guest House", icon: "🏡", description: "Private accommodations for visitors" },
  { value: "room", label: "Room", icon: "🛏️", description: "Single rooms in shared accommodations" },
  { value: "studio", label: "Studio", icon: "🏠", description: "Compact living spaces for singles" },
  { value: "officeSpace", label: "Office Space", icon: "🏢", description: "Professional workspaces and offices" },
  { value: "commercial", label: "Commercial", icon: "🏬", description: "Retail and business properties" },
  { value: "house", label: "House", icon: "🏠", description: "Complete family homes with privacy" },
  { value: "villa", label: "Villa", icon: "🏰", description: "Luxury homes with premium amenities" },
  { value: "duplex", label: "Duplex", icon: "🏘️", description: "Two-story connected homes" },
  { value: "penthouse", label: "Penthouse", icon: "🏙️", description: "Top-floor luxury apartments" },
  { value: "townhouse", label: "Townhouse", icon: "🏘️", description: "Multi-story homes in residential complexes" },
  { value: "bungalow", label: "Bungalow", icon: "🏡", description: "Single-story detached homes" },
  { value: "cottage", label: "Cottage", icon: "🏞️", description: "Cozy homes in rural or suburban areas" },
  { value: "chalet", label: "Chalet", icon: "🏔️", description: "Mountain or countryside retreats" },
  { value: "loft", label: "Loft", icon: "🏗️", description: "Open-plan urban living spaces" },
  { value: "hostel", label: "Hostel", icon: "🏨", description: "Budget-friendly shared accommodations" },
  { value: "serviced_apartment", label: "Serviced Apartment", icon: "🏢", description: "Fully furnished with hotel-like services" },
  { value: "compound", label: "Compound", icon: "🏘️", description: "Multiple buildings within gated areas" },
  { value: "farm_house", label: "Farm House", icon: "🚜", description: "Rural properties with agricultural land" },
  { value: "beach_house", label: "Beach House", icon: "🏖️", description: "Coastal properties near beaches" }
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
        "Properties listed for 2 months",
        "Photo and video uploads",
        "Tenant messaging system",
        "Basic property analytics",
        "Monthly subscription",
      ],
      fr: [
        "Propriétés listées pendant 2 mois",
        "Téléchargement de photos et vidéos",
        "Système de messagerie locataires",
        "Analyses de base des propriétés",
        "Abonnement mensuel",
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
        "Properties listed for 12 months",
        "Priority listing placement",
        "Advanced property analytics",
        "Tenant messaging system",
        "Photo and video uploads",
        "Save 40,000 FCFA yearly",
      ],
      fr: [
        "Propriétés listées pendant 12 mois",
        "Placement d'annonce prioritaire",
        "Analyses avancées des propriétés",
        "Système de messagerie locataires",
        "Téléchargement de photos et vidéos",
        "Économisez 40,000 FCFA par an",
      ]
    },
    savings: {
      en: "Save 40,000 FCFA",
      fr: "Économisez 40,000 FCFA"
    },
  },
  // For renters to browse properties (paid)
  renter_monthly: {
    price: 10000,
    duration: "month",
    type: "renter",
    features: {
      en: [
        "Browse all properties",
        "Contact landlords directly",
        "Advanced search filters",
        "Save favorite properties",
        "Property alerts and notifications",
        "Premium support",
      ],
      fr: [
        "Parcourir toutes les propriétés",
        "Contacter directement les propriétaires",
        "Filtres de recherche avancés",
        "Sauvegarder les propriétés favorites",
        "Alertes et notifications de propriétés",
        "Support premium",
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
