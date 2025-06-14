import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  // Fetch regions
  const { data: regions = [] } = useQuery({
    queryKey: ["/api/regions"],
  });

  // Fetch divisions when region changes
  const { data: divisions = [] } = useQuery({
    queryKey: [`/api/regions/${region}/divisions`],
    enabled: !!region,
  });

  // Reset division when region changes
  useEffect(() => {
    setDivision("");
  }, [region]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      region,
      division,
      propertyType,
      checkIn,
      checkOut,
    });
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
          <Select value={division} onValueChange={setDivision} disabled={!region}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
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

        {/* Dates */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-700">Dates</Label>
          <div className="flex space-x-2">
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="flex-1"
            />
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="flex-1"
            />
          </div>
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
