import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  Zap,
} from "lucide-react";
import { TEL_HREF, WHATSAPP_HREF } from "../data/properties";
import type { Property } from "../types";

const CATEGORY_COLORS: Record<Property["category"], string> = {
  "Industrial Plot": "bg-primary text-primary-foreground",
  "Factory Space": "bg-secondary text-secondary-foreground",
  Warehouse: "bg-accent text-accent-foreground",
};

const AVAILABILITY_COLORS: Record<Property["availability"], string> = {
  Available: "text-green-700 bg-green-50 border border-green-200",
  Immediate: "text-blue-700 bg-blue-50 border border-blue-200",
  Negotiable: "text-orange-700 bg-orange-50 border border-orange-200",
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

interface PropertyModalProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyModal({
  property,
  open,
  onOpenChange,
}: PropertyModalProps) {
  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 rounded-sm"
        data-ocid="property.dialog"
      >
        {/* Image */}
        <div className="relative h-52 sm:h-64 overflow-hidden rounded-t-sm">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2 flex-wrap">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-sm ${CATEGORY_COLORS[property.category]}`}
            >
              {property.category.toUpperCase()}
            </span>
            <div className="flex items-center gap-2">
              {property.isHot && (
                <span className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-sm">
                  <Zap className="w-3 h-3" />
                  HOT DEAL
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-sm ${AVAILABILITY_COLORS[property.availability]}`}
              >
                {property.availability}
              </span>
            </div>
          </div>
          {/* Property ID */}
          <span className="absolute top-3 right-3 bg-black/60 text-white/90 font-mono text-xs px-2 py-1 rounded-sm">
            {property.propId}
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-display font-bold text-foreground leading-tight">
              {property.name}
            </DialogTitle>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>VKI {property.sector}, Jaipur-302012</span>
            </div>
          </DialogHeader>

          {/* Tags */}
          {property.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {property.tags.map((tag) => (
                <span key={tag} className={`tag-pill ${getTagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-foreground/80 text-sm sm:text-base leading-relaxed border-l-2 border-primary pl-3">
            {property.description}
          </p>

          {/* Key Details Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Property Details
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                { label: "Total Area", value: property.size },
                { label: "Price / Rent", value: property.price },
                { label: "Location", value: `VKI ${property.sector}` },
                { label: "Type", value: property.type },
                { label: "Availability", value: property.availability },
                { label: "Address", value: "VKI Area, Jaipur-302012" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-muted/60 rounded-sm p-3 border border-border"
                >
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-semibold font-mono text-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Key Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {property.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Power / Infrastructure note */}
          <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/20 rounded-sm p-3">
            <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/70">
              All properties in VKI Area have access to JVVNL industrial power
              grid, JNNJUM municipal water supply, and metalled road
              connectivity under Jaipur Industrial Development.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href={TEL_HREF}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3.5 rounded-sm font-bold text-sm hover:opacity-90 btn-glow-primary transition-smooth"
              data-ocid="property.modal_call_button"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-5 py-3.5 rounded-sm font-bold text-sm hover:opacity-90 btn-glow-secondary transition-smooth"
              data-ocid="property.modal_whatsapp_button"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Enquiry
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            <ArrowRight className="w-3 h-3" /> Our team responds within 2
            business hours
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
