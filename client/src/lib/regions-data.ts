export interface RegionData {
  id: number;
  name: string;
  slug: string;
  temperature: string;
  population: string;
  climate: string;
  capital: string;
  popularLocations: string[];
  attractions: string[];
  description: {
    en: string;
    fr: string;
  };
  economy: string[];
  imageUrl: string;
}

export const REGIONS_DATA: RegionData[] = [
  {
    id: 1,
    name: "Adamawa",
    slug: "adamawa",
    temperature: "18-28°C",
    population: "1.2 million",
    climate: "Tropical savanna",
    capital: "Ngaoundéré",
    popularLocations: ["Ngaoundéré", "Meiganga", "Tibati", "Tignère"],
    attractions: ["Ngaoundéré Grand Mosque", "Lamido Palace", "Bénoué National Park", "Vina Falls"],
    description: {
      en: "Known as the gateway to Northern Cameroon, Adamawa is famous for its rolling hills, cattle ranching, and the historic city of Ngaoundéré.",
      fr: "Connue comme la porte d'entrée du Nord Cameroun, l'Adamaoua est célèbre pour ses collines ondulantes, l'élevage de bétail et la ville historique de Ngaoundéré."
    },
    economy: ["Cattle ranching", "Agriculture", "Trade", "Transportation hub"],
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 2,
    name: "Centre",
    slug: "centre",
    temperature: "20-30°C",
    population: "4.2 million",
    climate: "Tropical rainforest",
    capital: "Yaoundé",
    popularLocations: ["Yaoundé", "Mbalmayo", "Ebolowa", "Sangmélima"],
    attractions: ["National Museum", "Mvog-Betsi Zoo", "Cathedral of Our Lady of Victories", "Nachtigal Falls"],
    description: {
      en: "Home to the capital city Yaoundé, Centre region is the political heart of Cameroon with lush forests and government institutions.",
      fr: "Abritant la capitale Yaoundé, la région du Centre est le cœur politique du Cameroun avec des forêts luxuriantes et des institutions gouvernementales."
    },
    economy: ["Government services", "Education", "Forestry", "Small-scale agriculture"],
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 3,
    name: "East",
    slug: "east",
    temperature: "19-32°C",
    population: "900,000",
    climate: "Equatorial rainforest",
    capital: "Bertoua",
    popularLocations: ["Bertoua", "Batouri", "Yokadouma", "Abong-Mbang"],
    attractions: ["Dja Biosphere Reserve", "Lobéké National Park", "Boumba Bek National Park", "Traditional Pygmy villages"],
    description: {
      en: "Rich in biodiversity and mineral resources, the East region features dense rainforests and is home to indigenous Baka communities.",
      fr: "Riche en biodiversité et en ressources minérales, la région de l'Est présente des forêts tropicales denses et abrite les communautés indigènes Baka."
    },
    economy: ["Mining", "Forestry", "Ecotourism", "Traditional crafts"],
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 4,
    name: "Far North",
    slug: "far-north",
    temperature: "25-45°C",
    population: "4.0 million",
    climate: "Semi-arid Sahel",
    capital: "Maroua",
    popularLocations: ["Maroua", "Garoua", "Kousseri", "Mokolo"],
    attractions: ["Waza National Park", "Mandara Mountains", "Rhumsiki Peak", "Traditional Kapsiki villages"],
    description: {
      en: "The hottest and most arid region, Far North offers unique landscapes, traditional architecture, and diverse ethnic cultures.",
      fr: "La région la plus chaude et la plus aride, l'Extrême-Nord offre des paysages uniques, une architecture traditionnelle et des cultures ethniques diverses."
    },
    economy: ["Cotton farming", "Livestock", "Handicrafts", "Cross-border trade"],
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 5,
    name: "Littoral",
    slug: "littoral",
    temperature: "22-32°C",
    population: "3.2 million",
    climate: "Tropical coastal",
    capital: "Douala",
    popularLocations: ["Douala", "Kribi", "Edéa", "Limbe"],
    attractions: ["Kribi Beach", "Limbe Wildlife Centre", "Douala Maritime Museum", "Wouri River Bridge"],
    description: {
      en: "Cameroon's economic hub featuring beautiful beaches, the major port of Douala, and vibrant coastal culture.",
      fr: "Le centre économique du Cameroun avec de belles plages, le grand port de Douala et une culture côtière dynamique."
    },
    economy: ["Port activities", "Manufacturing", "Oil refining", "Tourism"],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 6,
    name: "North",
    slug: "north",
    temperature: "20-40°C",
    population: "2.4 million",
    climate: "Sudanian savanna",
    capital: "Garoua",
    popularLocations: ["Garoua", "Figuil", "Guider", "Tcholliré"],
    attractions: ["Bénoué National Park", "Faro National Park", "Rey Bouba Palace", "Traditional Fulani architecture"],
    description: {
      en: "Known for its vast savannas, traditional emirates, and wildlife parks. The region showcases authentic Fulani culture.",
      fr: "Connue pour ses vastes savanes, ses émirats traditionnels et ses parcs animaliers. La région présente une culture peule authentique."
    },
    economy: ["Agriculture", "Livestock", "Cotton production", "Textiles"],
    imageUrl: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 7,
    name: "Northwest",
    slug: "northwest",
    temperature: "15-28°C",
    population: "2.0 million",
    climate: "Highland tropical",
    capital: "Bamenda",
    popularLocations: ["Bamenda", "Kumbo", "Wum", "Ndop"],
    attractions: ["Mount Oku", "Lake Oku", "Kimbi-Fungom National Park", "Traditional Fon palaces"],
    description: {
      en: "Mountainous region with cool climate, rich cultural heritage, and traditional kingdoms. Known for its scenic landscapes.",
      fr: "Région montagneuse au climat frais, riche patrimoine culturel et royaumes traditionnels. Connue pour ses paysages pittoresques."
    },
    economy: ["Agriculture", "Coffee production", "Handicrafts", "Small-scale mining"],
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 8,
    name: "South",
    slug: "south",
    temperature: "20-30°C",
    population: "750,000",
    climate: "Equatorial rainforest",
    capital: "Ebolowa",
    popularLocations: ["Ebolowa", "Sangmélima", "Kribi", "Campo"],
    attractions: ["Campo Ma'an National Park", "Kribi Waterfalls", "Ebodje Turtle Beach", "Pygmy cultural sites"],
    description: {
      en: "Dense forests, pristine beaches, and rich biodiversity. The region offers exceptional ecotourism opportunities.",
      fr: "Forêts denses, plages immaculées et riche biodiversité. La région offre des opportunités d'écotourisme exceptionnelles."
    },
    economy: ["Forestry", "Fishing", "Ecotourism", "Cocoa farming"],
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 9,
    name: "Southwest",
    slug: "southwest",
    temperature: "18-32°C",
    population: "1.5 million",
    climate: "Tropical monsoon",
    capital: "Buea",
    popularLocations: ["Buea", "Limbe", "Kumba", "Mamfe"],
    attractions: ["Mount Cameroon", "Limbe Botanic Garden", "Buea German Colonial Architecture", "Limbe Black Sand Beaches"],
    description: {
      en: "Home to Mount Cameroon, beautiful black sand beaches, and colonial history. The region combines mountain and coastal attractions.",
      fr: "Abritant le mont Cameroun, de belles plages de sable noir et une histoire coloniale. La région combine attractions montagneuses et côtières."
    },
    economy: ["Oil palm", "Rubber production", "Tourism", "Port activities"],
    imageUrl: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 10,
    name: "West",
    slug: "west",
    temperature: "16-26°C",
    population: "2.0 million",
    climate: "Highland tropical",
    capital: "Bafoussam",
    popularLocations: ["Bafoussam", "Dschang", "Bangangté", "Foumban"],
    attractions: ["Foumban Royal Palace", "Dschang Museum", "Bamoun Cultural Centre", "Lake Baleng"],
    description: {
      en: "Rich cultural heritage with traditional kingdoms, highlands agriculture, and artisanal crafts. The Bamoun kingdom is particularly notable.",
      fr: "Riche patrimoine culturel avec des royaumes traditionnels, l'agriculture des hautes terres et l'artisanat. Le royaume bamoun est particulièrement remarquable."
    },
    economy: ["Coffee production", "Agriculture", "Handicrafts", "Cultural tourism"],
    imageUrl: "https://images.unsplash.com/photo-1571115764595-644cb6852ba4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  }
];

export function getRegionData(slug: string): RegionData | undefined {
  return REGIONS_DATA.find(region => region.slug === slug);
}

export function getRegionDataById(id: number): RegionData | undefined {
  return REGIONS_DATA.find(region => region.id === id);
}