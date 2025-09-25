import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const idrFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
});

export const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
})
