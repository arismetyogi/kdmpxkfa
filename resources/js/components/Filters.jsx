import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Pill, Tablets, SmilePlus, Milk, Columns3, HelpCircle, Package, PillBottle, ChevronDown, Droplet, Heart, Baby, Syringe, BriefcaseMedical, Bone, Drama, Brush  } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';


const FilterCard = ({ icon: Icon, label, isSelected, onClick, color = 'gray' }) => {
const colorStyles = {
  red: { 
    base: "border-red-500/30 text-red-800 bg-red-50 hover:bg-red-100", 
    selected: "bg-red-100 border-red-500 ring-2 ring-red-500/50", 
    icon: "text-red-500" 
  },
  yellow: { 
    base: "border-yellow-500/30 text-yellow-800 bg-yellow-50 hover:bg-yellow-100", 
    selected: "bg-yellow-100 border-yellow-500 ring-2 ring-yellow-500/50", 
    icon: "text-yellow-500" 
  },
  green: { 
    base: "border-green-500/30 text-green-800 bg-green-50 hover:bg-green-100", 
    selected: "bg-green-100 border-green-500 ring-2 ring-green-500/50", 
    icon: "text-green-500" 
  },
  gray: { 
    base: "border-border text-card-foreground hover:bg-blue-50", 
    selected: "border-primary ring-2 ring-primary/50 bg-blue-100", 
    icon: "text-primary" 
  },
  blue: {
    base: "border-blue-500/30 text-blue-800 bg-blue-50 hover:bg-blue-100",
    selected: "bg-blue-100 border-blue-500 ring-2 ring-blue-500/50",
    icon: "text-blue-500"
  },
  purple: {
    base: "border-purple-500/30 text-purple-800 bg-purple-50 hover:bg-purple-100",
    selected: "bg-purple-100 border-purple-500 ring-2 ring-purple-500/50",
    icon: "text-purple-500"
  },
  pink: {
    base: "border-pink-500/30 text-pink-800 bg-pink-50 hover:bg-pink-100",
    selected: "bg-pink-100 border-pink-500 ring-2 ring-pink-500/50",
    icon: "text-pink-500"
  },
  orange: {
    base: "border-orange-500/30 text-orange-800 bg-orange-50 hover:bg-orange-100",
    selected: "bg-orange-100 border-orange-500 ring-2 ring-orange-500/50",
    icon: "text-orange-500"
  },
  teal: {
    base: "border-teal-500/30 text-teal-800 bg-teal-50 hover:bg-teal-100",
    selected: "bg-teal-100 border-teal-500 ring-2 ring-teal-500/50",
    icon: "text-teal-500"
  },
};
    
    const styles = colorStyles[color] || colorStyles.gray;
    
    return (
        <Card onClick={onClick} className={cn("flex items-center w-full p-2 gap-4 cursor-pointer transition-all duration-200", "hover:bg-accent", styles.base, isSelected && styles.selected)}>
            <Icon className={cn("h-6 w-6 flex-shrink-0", styles.icon)} />
            <span className="text-sm font-semibold">{label}</span>
        </Card>
    );
};

FilterCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.oneOf([
    'red', 'yellow', 'green', 'gray', 
    'blue', 'purple', 'pink', 'orange', 'teal'
  ]),
};

const categoryConfig = {
  "Semua Produk":            { icon: Package,              color: "gray" },
  "Suplemen Diet":           { icon: Tablets,             color: "yellow" },
  "Essential Oil":           { icon: Droplet,              color: "teal" },
  "Kesehatan Wanita":        { icon: Heart,                color: "pink" },
  "Vitamin & Multivitamin":  { icon: Pill,                color: "purple" }, // if “Pills” exists, else Tablets
  "Nutrisi Ibu Hamil":        { icon: Baby,                color: "pink" },
  "Obat - Obatan":            { icon: Syringe,             color: "red" },
  "Perlengkapan Medis":       { icon: BriefcaseMedical,    color: "blue" },
  "Produk Dewasa":            { icon: SmilePlus,                color: "orange" },
  "Tulang Otot & Sendi":       { icon: Bone,                color: "green" },
  "Masker":                   { icon: Drama,                 color: "pink" },
  "Perlengkapan Kebersihan":  { icon: Brush, color: "teal" },
  default: { icon: HelpCircle, color: "gray" },
};

const packageIcons = {
    "PC": Pill,
    "TUB": PillBottle,
    "BT": Milk,
    "STR": Columns3,
    "TAB": Tablets,
    "DUS": Package,
    "KPL": Pill,
    "BTR": PillBottle,
    "POT": PillBottle,
    "KPS": Pill,
    "BH": Package,
    "SC": Package,
    "RLL": Package,
    "Semua Paket": Package,
    default: Package,
};

export default function Filters({
  onFilterChange,
  categories,
  packages,
  activeFilters,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { categories: selectedCategories, packages: selectedPackages } = activeFilters;

  // <-- FIX: Restored correct multi-select logic for categories -->
  const toggleCategory = (pack) => {
    onFilterChange({ categories: [pack], packages: selectedPackages });
  };
  
  // This single-select logic for packages is correct.
  const togglePackage = (pack) => {
    onFilterChange({ categories: selectedCategories, packages: [pack] });
  };

  // <-- IMPROVEMENT: Added event propagation stop for better mobile UX -->
  const clearAllFilters = (e) => {
    // This stops the click from also triggering the collapsible button on mobile.
    e.stopPropagation();
    onFilterChange({
      categories: ["Semua Produk"],
      packages: ["Semua Paket"],
    });
  };

  return (
    <div className="lg:w-64 w-full p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      
      <button 
        className="flex items-center justify-between w-full mb-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold">Filters</h2>
        <div className="flex items-center gap-4">
            <span
              onClick={clearAllFilters} // Pass the event automatically
              className="text-sm text-blue-500 hover:underline"
            >
              Clear All
            </span>
            <ChevronDown 
                className={cn("h-5 w-5 transition-transform duration-300", isOpen && "rotate-180")} 
            />
        </div>
      </button>

      <div className="hidden items-center justify-between mb-4 lg:flex">
        <h2 className="text-xl font-bold">Filters</h2>
        <button
          onClick={clearAllFilters} // Event is not needed here
          className="text-sm text-blue-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className={cn("transition-all duration-300 ease-in-out overflow-hidden", isOpen ? 'max-h-[1000px]' : 'max-h-0', 'lg:max-h-full lg:overflow-visible')}>
        {/* ==================== CATEGORY SECTION ==================== */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Categories</h3>
          
          {/* PC View: Cards (Visible on lg and up) */}
          <div className="hidden flex-col gap-2 lg:flex">
            {categories.map((cat) => {
              const config = categoryConfig[cat] || categoryConfig.default;
              return (
                <FilterCard
                  key={`${cat}-card`}
                  label={cat}
                  icon={config.icon}
                  color={config.color}
                  isSelected={selectedCategories.includes(cat)}
                  onClick={() => toggleCategory(cat)}
                />
              );
            })}
          </div>

          {/* Mobile View: Checkboxes (Hidden on lg and up) */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 lg:hidden">
            {categories.map((cat) => (
                <div key={`${cat}-check`} className="flex items-center space-x-2">
                    <Checkbox
                        id={`cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                    />
                    <Label
                        htmlFor={`cat-${cat}`}
                        className="text-sm font-normal leading-none"
                    >
                        {cat}
                    </Label>
                </div>
            ))}
          </div>
        </div>

        {/* ==================== PACKAGING SECTION ==================== */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Packaging</h3>

          {/* PC View: Cards (Visible on lg and up) */}
          <div className="hidden flex-col gap-2 lg:flex">
            {packages.map((pack) => (
              <FilterCard
                key={`${pack}-card`}
                label={pack}
                icon={packageIcons[pack] || packageIcons.default}
                isSelected={selectedPackages.includes(pack)}
                onClick={() => togglePackage(pack)}
              />
            ))}
          </div>
          
          {/* Mobile View: Checkboxes (Hidden on lg and up) */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 lg:hidden">
            {packages.map((pack) => (
                <div key={`${pack}-check`} className="flex items-center space-x-2">
                    <Checkbox
                        id={`pack-${pack}`}
                        checked={selectedPackages.includes(pack)}
                        onCheckedChange={() => togglePackage(pack)}
                    />
                    <Label
                        htmlFor={`pack-${pack}`}
                        className="text-sm font-normal leading-none"
                    >
                        {pack}
                    </Label>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Filters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  packages: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilters: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string),
    packages: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};