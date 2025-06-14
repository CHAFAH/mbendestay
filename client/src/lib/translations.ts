export interface Translations {
  // Navigation & General
  home: string;
  browse: string;
  messages: string;
  dashboard: string;
  profile: string;
  logout: string;
  login: string;
  search: string;
  filter: string;
  clear: string;
  apply: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  view: string;
  back: string;
  next: string;
  previous: string;
  loading: string;
  
  // Landing Page
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  viewAllProperties: string;
  exploreRegions: string;
  exploreRegionsSubtitle: string;
  listPropertyToday: string;
  becomeHost: string;
  verifiedListings: string;
  verifiedListingsDesc: string;
  mobilePayments: string;
  mobilePaymentsDesc: string;
  monthlySubscription: string;
  yearlySubscription: string;
  chooseMonthly: string;
  chooseYearly: string;
  perMonth: string;
  perYear: string;
  startHostingToday: string;
  learnMore: string;
  
  // Property Types
  apartment: string;
  guestHouse: string;
  room: string;
  studio: string;
  officeSpace: string;
  commercial: string;
  
  // Contract Types
  shortStay: string;
  longStay: string;
  daily: string;
  monthly: string;
  
  // Search & Filters
  location: string;
  propertyType: string;
  contractType: string;
  priceRange: string;
  region: string;
  division: string;
  selectRegion: string;
  selectDivision: string;
  selectPropertyType: string;
  selectContractType: string;
  minPrice: string;
  maxPrice: string;
  
  // Property Details
  propertyDetails: string;
  description: string;
  amenities: string;
  location_details: string;
  contact: string;
  inquire: string;
  reviews: string;
  rating: string;
  noReviews: string;
  writeReview: string;
  
  // Subscription Features
  upTo5Listings: string;
  photoUploads: string;
  guestMessaging: string;
  chatSupport: string;
  basicAnalytics: string;
  unlimitedListings: string;
  videoUploads: string;
  priorityPlacement: string;
  advancedAnalytics: string;
  contractTemplates: string;
  prioritySupport: string;
  
  // Dashboard
  welcomeBack: string;
  myProperties: string;
  myInquiries: string;
  analytics: string;
  subscription: string;
  addProperty: string;
  editProperty: string;
  deleteProperty: string;
  viewInquiries: string;
  
  // Messages
  conversations: string;
  noMessages: string;
  typeMessage: string;
  sendMessage: string;
  
  // Forms
  title: string;
  address: string;
  price: string;
  size: string;
  submit: string;
  required: string;
  
  // Status
  active: string;
  inactive: string;
  pending: string;
  approved: string;
  rejected: string;
  
  // Currency
  currency: string;
}

export const translations: Record<'en' | 'fr', Translations> = {
  en: {
    // Navigation & General
    home: 'Home',
    browse: 'Browse',
    messages: 'Messages',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    apply: 'Apply',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    
    // Landing Page
    heroTitle: 'Find Your Perfect Stay in Cameroon',
    heroSubtitle: 'Discover comfortable accommodations across all 10 regions with verified hosts and secure payments',
    searchPlaceholder: 'Search by city, region, or property type...',
    viewAllProperties: 'View All Properties',
    exploreRegions: "Explore Cameroon's Regions",
    exploreRegionsSubtitle: 'From the coastal beauty of Littoral to the cultural richness of the West, discover accommodations across all 10 regions',
    listPropertyToday: 'List Your Property Today',
    becomeHost: 'Become a Host',
    verifiedListings: 'Verified Listings',
    verifiedListingsDesc: 'All hosts are verified with national ID for guest safety and trust',
    mobilePayments: 'Mobile Payments',
    mobilePaymentsDesc: 'Accept payments via MTN, Orange Money, and bank transfers',
    monthlySubscription: 'Monthly Subscription',
    yearlySubscription: 'Yearly Subscription',
    chooseMonthly: 'Choose Monthly',
    chooseYearly: 'Choose Yearly',
    perMonth: 'per month',
    perYear: 'per year',
    startHostingToday: 'Start Hosting Today',
    learnMore: 'Learn More',
    
    // Property Types
    apartment: 'Apartment',
    guestHouse: 'Guest House',
    room: 'Room',
    studio: 'Studio',
    officeSpace: 'Office Space',
    commercial: 'Commercial',
    
    // Contract Types
    shortStay: 'Short Stay',
    longStay: 'Long Stay',
    daily: 'Daily',
    monthly: 'Monthly',
    
    // Search & Filters
    location: 'Location',
    propertyType: 'Property Type',
    contractType: 'Contract Type',
    priceRange: 'Price Range',
    region: 'Region',
    division: 'Division',
    selectRegion: 'Select Region',
    selectDivision: 'Select Division',
    selectPropertyType: 'Select Property Type',
    selectContractType: 'Select Contract Type',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    
    // Property Details
    propertyDetails: 'Property Details',
    description: 'Description',
    amenities: 'Amenities',
    location_details: 'Location',
    contact: 'Contact',
    inquire: 'Inquire',
    reviews: 'Reviews',
    rating: 'Rating',
    noReviews: 'No reviews yet',
    writeReview: 'Write a Review',
    
    // Subscription Features
    upTo5Listings: 'Up to 5 property listings',
    photoUploads: 'Photo uploads',
    guestMessaging: 'Guest messaging system',
    chatSupport: 'Chat support',
    basicAnalytics: 'Basic analytics',
    unlimitedListings: 'Unlimited property listings',
    videoUploads: 'Photo & video uploads',
    priorityPlacement: 'Priority search placement',
    advancedAnalytics: 'Advanced analytics dashboard',
    contractTemplates: 'Contract templates',
    prioritySupport: 'Priority support',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    myProperties: 'My Properties',
    myInquiries: 'My Inquiries',
    analytics: 'Analytics',
    subscription: 'Subscription',
    addProperty: 'Add Property',
    editProperty: 'Edit Property',
    deleteProperty: 'Delete Property',
    viewInquiries: 'View Inquiries',
    
    // Messages
    conversations: 'Conversations',
    noMessages: 'No messages yet',
    typeMessage: 'Type a message...',
    sendMessage: 'Send Message',
    
    // Forms
    title: 'Title',
    address: 'Address',
    price: 'Price',
    size: 'Size',
    submit: 'Submit',
    required: 'Required',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    
    // Currency
    currency: 'XCFA'
  },
  fr: {
    // Navigation & General
    home: 'Accueil',
    browse: 'Parcourir',
    messages: 'Messages',
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    logout: 'Déconnexion',
    login: 'Connexion',
    search: 'Rechercher',
    filter: 'Filtrer',
    clear: 'Effacer',
    apply: 'Appliquer',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    loading: 'Chargement...',
    
    // Landing Page
    heroTitle: 'Trouvez Votre Séjour Parfait au Cameroun',
    heroSubtitle: 'Découvrez des hébergements confortables dans les 10 régions avec des hôtes vérifiés et des paiements sécurisés',
    searchPlaceholder: 'Rechercher par ville, région ou type de propriété...',
    viewAllProperties: 'Voir Toutes les Propriétés',
    exploreRegions: 'Explorez les Régions du Cameroun',
    exploreRegionsSubtitle: 'De la beauté côtière du Littoral à la richesse culturelle de l\'Ouest, découvrez des hébergements dans les 10 régions',
    listPropertyToday: 'Listez Votre Propriété Aujourd\'hui',
    becomeHost: 'Devenir Hôte',
    verifiedListings: 'Annonces Vérifiées',
    verifiedListingsDesc: 'Tous les hôtes sont vérifiés avec une pièce d\'identité nationale pour la sécurité et la confiance des clients',
    mobilePayments: 'Paiements Mobiles',
    mobilePaymentsDesc: 'Acceptez les paiements via MTN, Orange Money et virements bancaires',
    monthlySubscription: 'Abonnement Mensuel',
    yearlySubscription: 'Abonnement Annuel',
    chooseMonthly: 'Choisir Mensuel',
    chooseYearly: 'Choisir Annuel',
    perMonth: 'par mois',
    perYear: 'par an',
    startHostingToday: 'Commencer l\'Hébergement Aujourd\'hui',
    learnMore: 'En Savoir Plus',
    
    // Property Types
    apartment: 'Appartement',
    guestHouse: 'Maison d\'Hôtes',
    room: 'Chambre',
    studio: 'Studio',
    officeSpace: 'Espace de Bureau',
    commercial: 'Commercial',
    
    // Contract Types
    shortStay: 'Séjour Court',
    longStay: 'Séjour Long',
    daily: 'Journalier',
    monthly: 'Mensuel',
    
    // Search & Filters
    location: 'Localisation',
    propertyType: 'Type de Propriété',
    contractType: 'Type de Contrat',
    priceRange: 'Gamme de Prix',
    region: 'Région',
    division: 'Division',
    selectRegion: 'Sélectionner une Région',
    selectDivision: 'Sélectionner une Division',
    selectPropertyType: 'Sélectionner le Type de Propriété',
    selectContractType: 'Sélectionner le Type de Contrat',
    minPrice: 'Prix Min',
    maxPrice: 'Prix Max',
    
    // Property Details
    propertyDetails: 'Détails de la Propriété',
    description: 'Description',
    amenities: 'Équipements',
    location_details: 'Localisation',
    contact: 'Contact',
    inquire: 'S\'enquérir',
    reviews: 'Avis',
    rating: 'Note',
    noReviews: 'Aucun avis pour le moment',
    writeReview: 'Écrire un Avis',
    
    // Subscription Features
    upTo5Listings: 'Jusqu\'à 5 annonces de propriétés',
    photoUploads: 'Téléchargement de photos',
    guestMessaging: 'Système de messagerie pour invités',
    chatSupport: 'Support par chat',
    basicAnalytics: 'Analyses de base',
    unlimitedListings: 'Annonces de propriétés illimitées',
    videoUploads: 'Téléchargement de photos et vidéos',
    priorityPlacement: 'Placement prioritaire dans les recherches',
    advancedAnalytics: 'Tableau de bord d\'analyses avancées',
    contractTemplates: 'Modèles de contrats',
    prioritySupport: 'Support prioritaire',
    
    // Dashboard
    welcomeBack: 'Bon retour',
    myProperties: 'Mes Propriétés',
    myInquiries: 'Mes Demandes',
    analytics: 'Analyses',
    subscription: 'Abonnement',
    addProperty: 'Ajouter une Propriété',
    editProperty: 'Modifier la Propriété',
    deleteProperty: 'Supprimer la Propriété',
    viewInquiries: 'Voir les Demandes',
    
    // Messages
    conversations: 'Conversations',
    noMessages: 'Aucun message pour le moment',
    typeMessage: 'Tapez un message...',
    sendMessage: 'Envoyer le Message',
    
    // Forms
    title: 'Titre',
    address: 'Adresse',
    price: 'Prix',
    size: 'Taille',
    submit: 'Soumettre',
    required: 'Obligatoire',
    
    // Status
    active: 'Actif',
    inactive: 'Inactif',
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    
    // Currency
    currency: 'FCFA'
  }
};

export type Language = 'en' | 'fr';