import SearchableSelect from '@/components/searchable-select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Apotek, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import React, { useEffect } from 'react';

interface UserMappingModalProps {
    isOpen: boolean;
    user?: User | null;
    apoteks: Apotek[];
    onClose: () => void;
}

export default function UserMappingModal({ isOpen, onClose, user, apoteks }: UserMappingModalProps) {
    // ✅ Initialize useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        apotek_id: user?.apotek_id?.toString() ?? null,
    });

    // ✅ Reset form when modal opens/closes or user changes
    useEffect(() => {
        if (user) {
            setData('apotek_id', user.apotek_id?.toString() ?? null);
        } else {
            reset();
        }
    }, [user, isOpen]);

    const handleApotekChange = (value: string | number) => {
        setData('apotek_id', value.toString());
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        post(route('admin.users.map', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (err) => {
                console.error('Form errors:', err);
            },
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    reset();
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Map User to Apotek</DialogTitle>
                    <DialogDescription>Update the user's apotek details below.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        {/* User Name */}
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={user?.name ?? ''} className="mt-1" disabled />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={user?.email ?? ''} className="mt-1" disabled />
                        </div>

                        {/* Apotek */}
                        <div>
                            <Label htmlFor="apotek_id">Apotek</Label>
                            <SearchableSelect
                                options={apoteks.map((a) => ({
                                    value: a.id.toString(),
                                    label: `${a.sap_id} - ${a.name}`,
                                }))}
                                value={data.apotek_id || null}
                                onChange={handleApotekChange}
                                placeholder="Select an apotek..."
                                searchPlaceholder="Search apoteks..."
                                maxResults={10}
                            />
                            {errors.apotek_id && <p className="mt-1 text-sm text-red-600">{errors.apotek_id}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
