import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';

interface SelectOption {
    label: string;
    value: string | number;
}

interface SearchableSelectProps {
    options: SelectOption[];
    value: string | number | null;
    onChange: (value: any) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    maxResults?: number;
}

export default function SearchableSelect({
                                             options,
                                             value,
                                             onChange,
                                             placeholder = 'Select an option...',
                                             searchPlaceholder = 'Search...',
                                             maxResults = 10,
                                         }: SearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const filteredOptions = useMemo(() => {
        const nq = query.trim().toLowerCase();
        if (!nq) return options.slice(0, maxResults);

        const results = options.filter(
            (opt) =>
                opt.label.toLowerCase().includes(nq)
        );

        return results.slice(0, maxResults);
    }, [options, query, maxResults]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                    {value
                        ? options.find((opt) => String(opt.value) === String(value))?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command shouldFilter={false}>
                    {/* disable shadcn’s auto filter */}
                    <CommandInput
                        placeholder={searchPlaceholder}
                        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((opt) => (
                                <CommandItem
                                    className={'text-sm'}
                                    key={opt.value}
                                    value={opt.value.toString()}
                                    onSelect={(val) => {
                                        const selected = options.find((o) => String(o.value) === val);
                                        if (selected) {
                                            onChange(selected.value);
                                            setOpen(false);
                                        }
                                    }}
                                >
                                    {opt.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
