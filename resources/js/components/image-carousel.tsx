'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Lens } from '@/components/ui/lens';

interface ImageCarouselProps {
    images: string[];
    productName?: string;
}

export function ImageCarousel({ images, productName = 'Product' }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full">
            {/* Main Image Display */}
            <div className="relative overflow-hidden rounded-lg">
                <div className="aspect-square w-full">
                    <Lens>
                        <img
                            src={images.length > 0 ? images[currentIndex] : '/products/Placeholder_Medicine.png'}
                            alt={`${productName} ${currentIndex + 1}`}
                            loading="lazy"
                            crossOrigin="anonymous"
                            className="h-full w-full rounded-lg border object-cover"
                        />
                    </Lens>
                </div>
            </div>

            {/* Navigation Buttons - Only show if multiple images */}
            {images.length > 1 && (
                <>
                    {/* Previous Button */}
                    <button
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-2 z-50 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:scale-110 hover:bg-white focus:ring-2 focus:ring-ring focus:outline-none"
                        aria-label="Previous image"
                        type="button"
                    >
                        <ChevronLeft className="h-5 w-5 text-foreground" />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-2 z-50 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:scale-110 hover:bg-white focus:ring-2 focus:ring-ring focus:outline-none"
                        aria-label="Next image"
                        type="button"
                    >
                        <ChevronRight className="h-5 w-5 text-foreground" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="mt-4 flex justify-center gap-2">
                        {Array.isArray(images) &&
                            images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all focus:ring-2 focus:ring-ring focus:outline-none ${
                                        index === currentIndex ? 'w-8 bg-foreground' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                    }`}
                                    aria-label={`Go to image ${index + 1}`}
                                    type="button"
                                />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}
