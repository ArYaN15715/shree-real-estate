export interface PropertyFeature {
  label: string;
}

export interface Property {
  id: number;
  propId: string;
  name: string;
  category: "Industrial Plot" | "Factory Space" | "Warehouse";
  size: string;
  price: string;
  sector: string;
  availability: "Available" | "Immediate" | "Negotiable";
  type: "Freehold" | "Lease";
  isHot: boolean;
  tags: string[];
  description: string;
  features: string[];
  image: string;
}
