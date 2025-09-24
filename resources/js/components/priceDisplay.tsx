// src/components/PriceDisplay.tsx
import React from 'react';
import { cn } from "@/lib/utils"; // Make sure you have this utility

const PriceDisplay = ({
  price,
  currency = "Rp",
  className,
  decimalClassName,
}: {
  price: number | null | undefined;
  currency?: string;
  className?: string;
  decimalClassName?: string;
}) => {
  if (price === null || typeof price === 'undefined' || isNaN(price)) {
    return <span className={className}>{currency} 0</span>;
  }

  // Format the number to a string with two decimal places, using Indonesian locale.
  // This will use '.' for thousands and ',' for the decimal separator.
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  const [integerPart, decimalPart] = formattedPrice.split(',');

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