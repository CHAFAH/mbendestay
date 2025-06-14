import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PROPERTY_TYPES } from "@/lib/constants";

interface SearchFormProps {
  onSearch: (filters: any) => void;
  className?: string;
}

export default function SearchForm({ onSearch, className = "" }: SearchFormProps) {
  const [region, setRegion] = useState("");
  const [division, setDivision] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [priceRange, setPriceRange] = useState([10000, 500000]);

  // Fetch regions
  const { data: regions = [] } = useQuery({
    queryKey: ["/api/regions"],
  });

  // Fetch divisions when region changes
  const { data: divisions = [] } = useQuery({
    queryKey: [`/api/regions/${region}/divisions`],
    enabled: !!region && region !== "all",
  });

  // Reset division when region changes
  useEffect(() => {
    setDivision("");
  }, [region]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: any = {};
    
    // Only add filters if they have specific values (not "all" or empty)
    if (region && region !== "all" && region !== "") {
      filters.regionId = parseInt(region);
    }
    if (division && division !== "all" && division !== "") {
      filters.divisionId = parseInt(division);
    }
    if (propertyType && propertyType !== "all" && propertyType !== "") {
      filters.propertyType = propertyType;
    }
    if (priceRange[0] > 10000) {
      filters.minPrice = priceRange[0];
    }
    if (priceRange[1] < 500000) {
      filters.maxPrice = priceRange[1];
    }
    
    onSearch(filters);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Region Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-700">Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((r: any) => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Division Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-700">Division</Label>
          <Select value={division} onValueChange={setDivision} disabled={!region || region === "all"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={region && region !== "all" ? "Select Division" : "Select Region First"} />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="all">All Divisions</SelectItem>
              {divisions.map((d: any) => (
                <SelectItem key={d.id} value={d.slug}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-700">Property Type</Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Type</SelectItem>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-700">
            Price Range: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} XCFA
          </Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={10000}
            max={500000}
            step={10000}
            className="w-full"
          />
        </div>

        {/* Search Button */}
        <div>
          <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
