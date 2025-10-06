import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Package,
    Pill,
    Tablets,
    Droplet,
    Heart,
    Baby,
    Syringe,
    BriefcaseMedical,
    SmilePlus,
    Bone,
    Brush,
    Popcorn,
    HelpCircle,
    Milk,
    GlassWater,
    PillBottle,
    Droplets ,
    Salad, 
    Columns3,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';
import { Card } from '@/components/ui/card';

const PillButton = ({ icon: Icon, label, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
            'hover:shadow-sm hover:bg-accent hover:text-white',
            isSelected
                ? 'bg-primary text-white border-primary hover:bg-primary/90'
                : 'bg-background text-foreground border-border',
        )}
    >
        <Icon className={cn('h-4 w-4 hover:text-white', isSelected ? 'text-white' : 'text-muted-foreground')} />
        <span>{label}</span>
    </button>
);

PillButton.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

const categoryConfig = {
    'Semua Produk': { icon: Package },
    'Suplemen Diet': { icon: Tablets },
    'Essential Oil': { icon: Droplet },
    'Kesehatan Wanita': { icon: Heart },
    'Vitamin & Multivitamin': { icon: Pill },
    'Nutrisi Ibu Hamil': { icon: Salad },
    'Obat - Obatan': { icon: Syringe },
    'Perlengkapan Medis': { icon: BriefcaseMedical },
    'Pembersih Make Up': { icon: Droplets  },
    'Produk Dewasa': { icon: SmilePlus },
    'Perawatan Bayi': { icon: Baby  },
    'Minuman': {icon: GlassWater},
    'Makanan Ringan': { icon: Popcorn },
    'Tulang Otot & Sendi': { icon: Bone },
    Masker: { icon: SmilePlus },
    'Perlengkapan Kebersihan': { icon: Brush },
    default: { icon: HelpCircle },
};

const packageIcons = {
    PC: Pill,
    TUB: PillBottle,
    BTL: Milk,
    STR: Columns3,
    TAB: Tablets,
    DUS: Package,
    KPL: Pill,
    BTR: PillBottle,
    POT: PillBottle,
    KPS: Pill,
    BH: Package,
    SC: Package,
    RLL: Package,
    'Semua Paket': Package,
    default: Package,
};

export default function Filters({ onFilterChange, categories, packages, activeFilters }) {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isPackageOpen, setIsPackageOpen] = useState(true);
    const { categories: selectedCategories, packages: selectedPackages } = activeFilters;

    const toggleCategory = (cat) => {
        onFilterChange({ categories: [cat], packages: selectedPackages });
    };

    const togglePackage = (pack) => {
        onFilterChange({ categories: selectedCategories, packages: [pack] });
    };

    const clearAll = () => {
        onFilterChange({
            categories: ['Semua Produk'],
            packages: ['Semua Paket'],
        });
    };

    return (
        <div className="w-full rounded-md border p-4 lg:h-auto lg:w-64">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={clearAll} className="text-sm text-blue-500 hover:underline">
                    Clear All
                </button>
            </div>

            {/* CATEGORY SECTION */}
            <div className="mb-6">
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex w-full items-center justify-between"
                >
                    <h3 className="font-semibold">Categories</h3>
                    <ChevronDown
                        className={cn(
                            'h-5 w-5 transition-transform duration-300',
                            isCategoryOpen && 'rotate-180',
                        )}
                    />
                </button>

                <AnimatePresence>
                    {isCategoryOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 flex flex-wrap gap-2"
                        >
                            {categories.map((cat) => {
                                const config = categoryConfig[cat] || categoryConfig.default;
                                return (
                                    <PillButton
                                        key={cat}
                                        icon={config.icon}
                                        label={cat}
                                        isSelected={selectedCategories.includes(cat)}
                                        onClick={() => toggleCategory(cat)}
                                    />
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* PACKAGE SECTION */}
            <div>
                <button
                    onClick={() => setIsPackageOpen(!isPackageOpen)}
                    className="flex w-full items-center justify-between"
                >
                    <h3 className="font-semibold">Packaging</h3>
                    <ChevronDown
                        className={cn(
                            'h-5 w-5 transition-transform duration-300',
                            isPackageOpen && 'rotate-180',
                        )}
                    />
                </button>

                <AnimatePresence>
                    {isPackageOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 flex flex-wrap gap-2"
                        >
                            {packages.map((pack) => (
                                <PillButton
                                    key={pack}
                                    icon={packageIcons[pack] || packageIcons.default}
                                    label={pack}
                                    isSelected={selectedPackages.includes(pack)}
                                    onClick={() => togglePackage(pack)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
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
