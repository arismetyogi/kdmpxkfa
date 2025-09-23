interface MedicinePlaceholderProps {
    className?: string;
}

export function MedicinePlaceholder({ className = 'w-full h-36 rounded-md mb-4' }: MedicinePlaceholderProps) {
    return (
        <div className={`${className} flex items-center justify-center rounded-xl border-2 border-dashed bg-gray-200`}>
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9.5a1 1 0 011-1h16a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1v-5z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6" />
            </svg>
        </div>
    );
}
