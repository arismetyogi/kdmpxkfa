// src/components/PriceDisplay.tsx
import React from 'react';
import { cn } from "@/lib/utils"; // Make sure you have this utility

// Updated props to include the new 'decimal' option
interface PriceDisplayProps {
  price: number | null | undefined;
  currency?: string;
  className?: string;
  decimalClassName?: string;
  decimal?: 'hidden'; // The prop to control decimal visibility
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  currency = "Rp",
  className,
  decimalClassName,
  decimal,
}) => {
  if (price === null || typeof price === 'undefined' || isNaN(price)) {
    return <span className={className}>{currency} 0</span>;
  }

  // If decimal is hidden, round the price and format without fraction digits.
  if (decimal === 'hidden') {
    // --- CHANGE IS HERE ---
    // Explicitly round the price to the nearest integer.
    const roundedPrice = Math.round(price); 
    
    const formattedPrice = new Intl.NumberFormat('id-ID').format(roundedPrice);
    return (
        <span className={className}>
            {currency} {formattedPrice}
        </span>
    );
  }

  // Original logic for when decimals are visible.
  const formattedPriceWithDecimals = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  const [integerPart, decimalPart] = formattedPriceWithDecimals.split(',');

  return (
    <span className={className}>
      {currency} {integerPart}
      <span className={cn(
        "font-normal text-[0.7em] tracking-tighter align-baseline",
        decimalClassName
      )}>
        ,{decimalPart}
      </span>
    </span>
  );
};

export default PriceDisplay;