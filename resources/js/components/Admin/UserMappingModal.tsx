import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Apotek } from '@/types';
import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import SearchableSelect from '@/components/searchable-select';

interface User {
    id?: number;
    name?: string;
    email?: string;
    apotek_id?: number;
    apotek?: Apotek;
    tenantId?: number;
    tenantName?: string;
}

interface UserMappingModalProps {
    isOpen: boolean;
    user?: User | null;
    apoteks: Apotek[];
    onClose: () => void;
}

export default function UserMappingModal({ isOpen, onClose, user, apoteks }: UserMappingModalProps) {
    const form = useForm({
        name: user?.name || '',
        email: user?.email || '',
        apotek_id: user?.apotek_id || null,
        tenantId: user?.tenantId || 'default',
        tenantName: user?.tenantName || '',
    });

    // reset form when modal opens/closes or apotek_id changes
    useEffect(() => {
        if (isOpen) {
            form.setData({
                name: user?.name || '',
                email: user?.email || '',
                apotek_id: user?.apotek_id || null,
                tenantId: user?.tenantId || 'default',
                tenantName: user?.tenantName || '',
            });
            form.clearErrors();
        }
    }, [isOpen, user]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(route('admin.users.update', user?.id), {
            onSuccess: () => {
                onClose();
                toast.success('User mapped successfully.');
            },
            onError: (e) => {
                toast.error('Failed to map user.', e);
            },
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
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
                            <Input
                                id="name"
                                name="name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Enter user's full name"
                                className="mt-1"
                                disabled
                            />
                            {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder="Enter user's email"
                                className="mt-1"
                                disabled
                            />
                            {form.errors.email && <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>}
                        </div>

                        {/* Apotek */}
                        <div>
                            <Label htmlFor="apotek_id">Apotek</Label>
                            <SearchableSelect
                                options={apoteks.map((a) => ({
                                    value: a.id,
                                    label: `${a.sap_id} - ${a.name}`,
                                }))}
                                value={form.data.apotek_id}
                                onChange={(id: any) =>
                                    form.setData((prev) => ({
                                        ...prev,
                                        apotek_id: id ? parseInt(id) : null,
                                    }))
                                }
                                placeholder="Select an apotek..."
                                searchPlaceholder="Search apoteks..."
                                maxResults={10}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={form.processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing || !form.data.name.trim()}>
                            {form.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    'Save'
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
