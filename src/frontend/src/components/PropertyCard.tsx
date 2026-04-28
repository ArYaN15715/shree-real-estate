import { MapPin, Maximize2, MessageCircle, Zap } from "lucide-react";
import { WHATSAPP_HREF } from "../data/properties";
import type { Property } from "../types";

const CATEGORY_COLORS: Record<Property["category"], string> = {
  "Industrial Plot": "bg-primary text-primary-foreground",
  "Factory Space": "bg-secondary text-secondary-foreground",
  Warehouse: "bg-accent text-accent-foreground",
};

const TYPE_BORDER: Record<Property["type"], string> = {
  Freehold: "border-t-2 border-t-primary",
  Lease: "border-t-2 border-t-secondary",
};

const AVAILABILITY_DOT: Record<Property["availability"], string> = {
  Available: "bg-green-500",
  Immediate: "bg-blue-500",
  Negotiable: "bg-orange-400",
};

const TAG_COLOR: Record<string, string> = {
  "RIICO Zone": "border-primary/40 text-primary bg-primary/5",
  "24/7 Power": "border-amber-500/40 text-amber-700 bg-amber-50",
  "Water Supply": "border-blue-400/40 text-blue-700 bg-blue-50",
  "Road Access": "border-muted-foreground/30 text-muted-foreground bg-muted/40",
  "High Demand": "border-secondary/50 text-secondary bg-secondary/5",
  "Ready to Move": "border-green-500/40 text-green-700 bg-green-50",
  default: "border-border text-muted-foreground bg-muted/30",
};

function getTagColor(tag: string): string {
  return TAG_COLOR[tag] ?? TAG_COLOR.default;
}

interface PropertyCardProps {
  property: Property;
  index: number;
  onOpenDetail: (property: Property) => void;
}

export function PropertyCard({
  property,
  index,
  onOpenDetail,
}: PropertyCardProps) {
  return (
    <div
      className={`bg-card ${TYPE_BORDER[property.type]} border border-border rounded-sm overflow-hidden cursor-pointer group card-hover flex flex-col`}
      data-ocid={`properties.item.${index + 1}`}
    >
      {/* Image */}
      <button
        type="button"
        className="w-full relative h-44 overflow-hidden p-0 m-0 border-0 bg-transparent"
        onClick={() => onOpenDetail(property)}
        aria-label={`View details for ${property.name}`}
      >
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Hover CTA overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-smooth">
          <span className="bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-sm shadow-lg translate-y-3 group-hover:translate-y-0 transition-smooth">
            Quick Enquiry →
          </span>
        </div>

        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-sm ${CATEGORY_COLORS[property.category]}`}
        >
          {property.category.toUpperCase()}
        </span>

        {/* Property ID badge */}
        <span className="absolute top-3 right-3 bg-black/65 text-white/90 text-xs px-2 py-1 rounded-sm font-mono tracking-wider">
          {property.propId}
        </span>

        {/* Hot Deal tag */}
        {property.isHot && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-sm">
            <Zap className="w-3 h-3" />
            HOT DEAL
          </span>
        )}
      </button>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Title block */}
        <button
          type="button"
          className="text-left w-full bg-transparent border-0 p-0 cursor-pointer"
          onClick={() => onOpenDetail(property)}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-foreground text-base leading-snug group-hover:text-primary transition-smooth">
              {property.name}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${AVAILABILITY_DOT[property.availability]}`}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {property.availability}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-xs">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>VKI {property.sector}, Jaipur</span>
          </div>
        </button>

        {/* Data grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 rounded-sm p-2.5 border border-border">
            <p className="text-xs text-muted-foreground">Area</p>
            <p className="text-sm font-mono font-semibold text-foreground">
              {property.size}
            </p>
          </div>
          <div className="bg-muted/50 rounded-sm p-2.5 border border-border">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-sm font-mono font-bold text-primary">
              {property.price}
            </p>
          </div>
        </div>

        {/* Tags */}
        {property.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {property.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={`tag-pill ${getTagColor(tag)}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-bold py-2.5 rounded-sm hover:opacity-90 btn-glow-secondary transition-smooth"
            data-ocid={`properties.enquire_button.${index + 1}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Quick Enquiry
          </a>
          <button
            type="button"
            className="flex items-center justify-center gap-1 bg-muted border border-border text-muted-foreground text-xs px-3 py-2.5 rounded-sm hover:border-primary/50 hover:text-primary transition-smooth"
            onClick={() => onOpenDetail(property)}
            data-ocid={`properties.view_details_button.${index + 1}`}
            aria-label="View full details"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
