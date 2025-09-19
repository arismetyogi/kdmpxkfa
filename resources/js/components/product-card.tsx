import React from "react";
import { ShoppingCart } from "lucide-react";
import { Product } from '@/types/index.js';
import { motion } from "framer-motion";

interface ProductCardProps {
    product: Product;
    compact?: boolean;
    addToCart: (product: Product) => void;
    updateCartItems?: () => void;
}

export default function ProductCard({ product, addToCart, compact = false }: ProductCardProps) {
    const {
        id,
        name,
        price,
        base_uom,
        order_unit,
        image,
        is_active,
        content,
        category,
    } = product;

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const cardVariants = {
    hover: { 
      y: compact ? -3 : -5,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  if (compact) {
    return (
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border rounded-lg p-2 shadow-sm transition-colors flex flex-col justify-between h-full relative cursor-pointer"
          onClick={() => window.location.href = route('orders.show', { id })}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
      >
        
        {/* Floating Category Badge */}
        <div className="relative w-full mb-2 overflow-hidden rounded-md">
        {category?.main_category && (
          <span className="absolute top-1 z-10 right-1 text-xs px-1 py-0.5 rounded-full bg-blue-100 text-blue-800 whitespace-nowrap shadow">
            {category.main_category}
          </span>
        )}

        {/* Bagian Atas */}
        <div>
          <motion.img
            src={image}
            alt={name}
            className="w-full h-46 object-cover rounded-md mb-6"
            variants={imageVariants}
            whileHover="hover"
          />
          </div>

          <h3 className="font-semibold leading-tight text-sm mb-1">
            {name.length > 25 ? name.slice(0, 16) + "..." : name}
          </h3>

          <div className="flex items-center justify-between gap-1">
          <span className="text-xs text-muted-foreground block">
            {content} {base_uom} per {order_unit}
          </span>
          <div>
          <p className="text-md font-bold text-blue-600 pr-2">
            Rp {price?.toLocaleString('id-ID') ?? "0"}
          </p>
        </div>



        </div>
      </div>


      </motion.div>
    );
  }

    // Calculate price per order unit
    const pricePerOrderUnit = price / content;

    return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border rounded-lg p-3 shadow-sm transition-colors flex flex-col justify-between h-full relative cursor-pointer"
        onClick={() => window.location.href = route('orders.show', { id })}
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
    >
            {/* Floating Category Badge */}
            {category?.subcategory1 && (
                <span className="absolute top-2 right-2 rounded-full bg-blue-100 px-2 py-1 text-xs whitespace-nowrap text-blue-800 shadow">
                    {category.subcategory1}
                </span>
            )}

            {/* Bagian Atas */}
            <div>
                <img
                    src={image && image !== "" ? image : "/products/Placeholder_Medicine.png"}
                    alt={name}
                    className="w-full h-36 object-cover rounded-md mb-4"
                    onError={({ currentTarget }) => {
                        currentTarget.src = "/products/Placeholder_Medicine.png";
                    }}
                />

                <h3 className="mb-1 text-sm leading-tight font-semibold md:text-base">{name.length > 16 ? name.slice(0, 16) + '...' : name}</h3>

                <span className="block text-xs text-muted-foreground">
                    {content} {base_uom} per {order_unit}
                </span>

                <p className="mt-1 text-sm text-gray-500">
                    Status:{' '}
                    {is_active ? (
                        <span className="font-semibold text-blue-600">Tersedia</span>
                    ) : (
                        <span className="font-semibold text-red-600">HABIS</span>
                    )}
                </p>
            </div>

            {/* Bagian Bawah */}
            <div className="mt-3">
                <p className="text-lg font-bold text-blue-600 md:text-xl">Rp {price?.toLocaleString() ?? '0'}</p>
                <p className="text-xs text-muted-foreground">
                    Rp {pricePerOrderUnit?.toLocaleString() ?? '0'} per {base_uom}
                </p>

                {/* Full width Add to Cart button */}
                <motion.button
                    disabled={!is_active}
                    onClick={(e) => {
                        e.stopPropagation(); 
                        addToCart(product)}
                    }
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded text-white font-semibold transition-colors ${
                        is_active
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    <ShoppingCart size={16} /> Add to Cart
                </motion.button>
            </div>
        </motion.div>
    );
}
