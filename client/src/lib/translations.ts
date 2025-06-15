export const translations = {
  // Landing page hero section
  findYourPerfectStay: {
    en: "Find Your Perfect Stay in Cameroon",
    fr: "Trouvez Votre Séjour Parfait au Cameroun"
  },
  discoverUnique: {
    en: "Discover unique accommodations across all 10 regions and 65 divisions of Cameroon",
    fr: "Découvrez des hébergements uniques dans les 10 régions et 65 divisions du Cameroun"
  },
  startExploring: {
    en: "Start Exploring",
    fr: "Commencer l'Exploration"
  },
  
  // Featured properties section
  featuredProperties: {
    en: "Featured Properties",
    fr: "Propriétés en Vedette"
  },
  featuredPropertiesDesc: {
    en: "Discover handpicked accommodations across Cameroon's most beautiful destinations",
    fr: "Découvrez des hébergements sélectionnés dans les plus belles destinations du Cameroun"
  },
  noPropertiesYet: {
    en: "No properties available yet. Be the first to list your property!",
    fr: "Aucune propriété disponible pour le moment. Soyez le premier à lister votre propriété!"
  },
  viewAllProperties: {
    en: "View All Properties",
    fr: "Voir Toutes les Propriétés"
  },
  
  // Navigation
  home: {
    en: "Home",
    fr: "Accueil"
  },
  browse: {
    en: "Browse",
    fr: "Parcourir"
  },
  messages: {
    en: "Messages",
    fr: "Messages"
  },
  dashboard: {
    en: "Dashboard",
    fr: "Tableau de bord"
  },
  login: {
    en: "Login",
    fr: "Connexion"
  },
  logout: {
    en: "Logout",
    fr: "Déconnexion"
  },
  profile: {
    en: "Profile",
    fr: "Profil"
  },
  
  // Search form
  searchPlaceholder: {
    en: "Where would you like to stay?",
    fr: "Où aimeriez-vous séjourner?"
  },
  selectRegion: {
    en: "Select Region",
    fr: "Sélectionner une Région"
  },
  allRegions: {
    en: "All Regions",
    fr: "Toutes les Régions"
  },
  selectDivision: {
    en: "Select Division",
    fr: "Sélectionner une Division"
  },
  allDivisions: {
    en: "All Divisions",
    fr: "Toutes les Divisions"
  },
  propertyType: {
    en: "Property Type",
    fr: "Type de Propriété"
  },
  allTypes: {
    en: "All Types",
    fr: "Tous les Types"
  },
  checkIn: {
    en: "Check In",
    fr: "Arrivée"
  },
  checkOut: {
    en: "Check Out",
    fr: "Départ"
  },
  priceRange: {
    en: "Price Range",
    fr: "Gamme de Prix"
  },
  search: {
    en: "Search",
    fr: "Rechercher"
  },
  
  // Property types
  apartment: {
    en: "Apartment",
    fr: "Appartement"
  },
  guestHouse: {
    en: "Guest House",
    fr: "Maison d'Hôtes"
  },
  room: {
    en: "Room",
    fr: "Chambre"
  },
  studio: {
    en: "Studio",
    fr: "Studio"
  },
  officeSpace: {
    en: "Office Space",
    fr: "Espace de Bureau"
  },
  commercial: {
    en: "Commercial",
    fr: "Commercial"
  },
  
  // Property details
  perNight: {
    en: "per night",
    fr: "par nuit"
  },
  guests: {
    en: "guests",
    fr: "invités"
  },
  bedrooms: {
    en: "bedrooms",
    fr: "chambres"
  },
  bathrooms: {
    en: "bathrooms",
    fr: "salles de bain"
  },
  viewDetails: {
    en: "View Details",
    fr: "Voir les Détails"
  },
  contactLandlord: {
    en: "Contact Landlord",
    fr: "Contacter le Propriétaire"
  },
  
  // Subscription
  subscriptionRequired: {
    en: "Subscription Required",
    fr: "Abonnement Requis"
  },
  subscribeToView: {
    en: "Subscribe to view full property details",
    fr: "Abonnez-vous pour voir les détails complets de la propriété"
  },
  monthlyPlan: {
    en: "Monthly Plan",
    fr: "Plan Mensuel"
  },
  yearlyPlan: {
    en: "Yearly Plan",
    fr: "Plan Annuel"
  },
  perMonth: {
    en: "per month",
    fr: "par mois"
  },
  perYear: {
    en: "per year",
    fr: "par an"
  },
  subscribe: {
    en: "Subscribe",
    fr: "S'abonner"
  },
  
  // Forms
  name: {
    en: "Name",
    fr: "Nom"
  },
  email: {
    en: "Email",
    fr: "Email"
  },
  phone: {
    en: "Phone",
    fr: "Téléphone"
  },
  message: {
    en: "Message",
    fr: "Message"
  },
  submit: {
    en: "Submit",
    fr: "Soumettre"
  },
  cancel: {
    en: "Cancel",
    fr: "Annuler"
  },
  save: {
    en: "Save",
    fr: "Enregistrer"
  },
  
  // Common actions
  loading: {
    en: "Loading...",
    fr: "Chargement..."
  },
  error: {
    en: "Error",
    fr: "Erreur"
  },
  success: {
    en: "Success",
    fr: "Succès"
  },
  close: {
    en: "Close",
    fr: "Fermer"
  },
  back: {
    en: "Back",
    fr: "Retour"
  },
  next: {
    en: "Next",
    fr: "Suivant"
  },
  
  // Region details
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
  }
};

export function useTranslation(lang: 'en' | 'fr' = 'en') {
  const t = (key: string): string => {
    return translations[key as keyof typeof translations]?.[lang] || key;
  };

  return { t, lang };
}