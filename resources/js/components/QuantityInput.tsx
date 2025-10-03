import { Minus, Plus } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from './ui/button';

// --- Sub-component: Quantity Input ---
interface QuantityInputProps {
    value: number;
    onChange: (newValue: number) => void;
    decrementDisabled?: boolean;
    incrementDisabled?: boolean;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ value, onChange, decrementDisabled, incrementDisabled }) => {
    // Memoize the UI so it only re-renders when props change
    return useMemo(
        () => (
            <div className="flex items-center justify-center">
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => onChange(value - 1)}
                    disabled={decrementDisabled}
                    className="h-8 w-8 rounded-full"
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <input
                    min={0}
                    value={value}
                    onChange={(e) => {
                        const newValue = Number(e.target.value);
                        if (!isNaN(newValue)) onChange(newValue);
                    }}
                    className="w-8 rounded-md text-center text-lg"
                />

                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => onChange(value + 1)}
                    disabled={incrementDisabled}
                    className="h-8 w-8 rounded-full"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        ),
        [value, onChange, decrementDisabled, incrementDisabled], // only re-render if these change
    );
};

export default QuantityInput;
