import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Pill, Tablets, SmilePlus, Milk, Columns3, HelpCircle, Package, PillBottle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';


const FilterCard = ({ icon: Icon, label, isSelected, onClick, color = 'gray' }) => {
    const colorStyles = {
        red: {
          base: "border-red-500/30 text-red-800 bg-red-50 hover:bg-red-100",
          selected: "bg-red-100 border-red-500 ring-2 ring-red-500/50",
          icon: "text-red-500",
        },
        yellow: {
          base: "border-yellow-500/30 text-yellow-800 bg-yellow-50 hover:bg-yellow-100",
          selected: "bg-yellow-100 border-yellow-500 ring-2 ring-yellow-500/50",
          icon: "text-yellow-500",
        },
        green: {
          base: "border-green-500/30 text-green-800 bg-green-50 hover:bg-green-100",
          selected: "bg-green-100 border-green-500 ring-2 ring-green-500/50",
          icon: "text-green-500",
        },
        gray: {
          base: "border-border text-card-foreground hover:bg-blue-50",
          selected: "border-primary ring-2 ring-primary/50 bg-blue-100",
          icon: "text-primary",
        },
    };
    
    const styles = colorStyles[color] || colorStyles.gray;
    
    return (
        <Card
          onClick={onClick}
          className={cn(
            "flex items-center w-full p-2 gap-4 cursor-pointer transition-all duration-200",
            "hover:bg-accent",
            styles.base,
            isSelected && styles.selected
          )}
        >
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
    color: PropTypes.oneOf(['red', 'yellow', 'green', 'gray']),
};


// --- Icon and Color Mappings (No changes needed here) ---
const categoryConfig = {
    "Obat": { icon: Pill, color: "red" },
    "Vitamin & Suplemen": { icon: Tablets, color: "yellow" },
    "Kesehatan": { icon: SmilePlus, color: "green" },
    "Semua Produk": { icon: Package, color: "gray" },
    default: { icon: HelpCircle, color: "gray" },
};

const packageIcons = {
    "PC": Pill,
    "TUB": PillBottle,
    "BT": Milk,
    "STR": Columns3,
    "Semua Paket": Package,
    default: Package,
};

// --- Main Filters Component (This is where the changes are) ---
export default function Filters({
  onFilterChange,
  categories,
  packages,
  activeFilters, // <-- CHANGE #1: Receive the current filters as a prop
}) {
  // CHANGE #2: Remove the internal component state.
  // The 'activeFilters' prop is now the source of truth.
  // const [selectedCategories, setSelectedCategories] = useState(["Semua Produk"]);
  // const [selectedPackages, setSelectedPackages] = useState(["Semua Paket"]);
  
  const [isOpen, setIsOpen] = useState(false);
  const { categories: selectedCategories, packages: selectedPackages } = activeFilters;

  const toggleCategory = (pack) => {
    // CHANGE #3 (continued): Call parent with the complete new state.
    onFilterChange({ categories: [pack], packages: selectedPackages });
  };
  const togglePackage = (pack) => {
    // CHANGE #3 (continued): Call parent with the complete new state.
    onFilterChange({ categories: selectedCategories, packages: [pack] });
  };

  const clearAllFilters = () => {
    // CHANGE #3 (continued): Tell parent to reset to the default state.
    onFilterChange({
      categories: ["Semua Produk"],
      packages: ["Semua Paket"],
    });
  };

  // CHANGE #4: Remove the useEffect hook. The parent component (`Index.tsx`)
  // now handles the side effect of making the API request.
  /*
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      packages: selectedPackages,
    });
  }, [selectedCategories, selectedPackages]);
  */

  return (
    <div className="lg:w-64 w-full p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      
      {/* ============ NEW: Mobile Collapsible Header ============ */}
      <button 
        className="flex items-center justify-between w-full mb-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold">Filters</h2>
        <div className="flex items-center gap-4">
            <span
              onClick={clearAllFilters}
              className="text-sm text-blue-500 hover:underline"
            >
              Clear All
            </span>
            <ChevronDown 
                className={cn("h-5 w-5 transition-transform duration-300", isOpen && "rotate-180")} 
            />
        </div>
      </button>

      {/* ============ NEW: Static Desktop Header ============ */}
      <div className="hidden items-center justify-between mb-4 lg:flex">
        <h2 className="text-xl font-bold">Filters</h2>
        <button
          onClick={clearAllFilters}
          className="text-sm text-blue-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* ============ NEW: Collapsible Content Wrapper ============ */}
      {/* This uses a max-height transition for smooth collapse/expand animation.
          On large screens (lg:), it's always visible. */}
      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? 'max-h-[1000px]' : 'max-h-0',
        'lg:max-h-full lg:overflow-visible'
      )}>
        {/* Category Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="flex flex-col gap-2"> 
            {categories.map((cat) => {
              const config = categoryConfig[cat] || categoryConfig.default;
              return (
                <FilterCard
                  key={cat}
                  label={cat}
                  icon={config.icon}
                  color={config.color}
                  isSelected={selectedCategories.includes(cat)}
                  onClick={() => toggleCategory(cat)}
                />
              );
            })}
          </div>
        </div>

        {/* Packaging Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Packaging</h3>
          <div className="flex flex-col gap-2"> 
            {packages.map((pack) => (
              <FilterCard
                key={pack}
                label={pack}
                icon={packageIcons[pack] || packageIcons.default}
                isSelected={selectedPackages.includes(pack)}
                onClick={() => togglePackage(pack)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// CHANGE #5: Update prop types to include the new required prop
Filters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  packages: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilters: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string),
    packages: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};