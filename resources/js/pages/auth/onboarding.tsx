import CascadingRegionSelect from '@/components/cascading-region-select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

type PrefilledData = {
    username: string | null;
    email: string | null;
    name: string | null;
    phone: string | null;
    tenant_id: string | null;
    tenant_name: string | null;
    province_code: string | null;
    city_code: string | null;
    district_code: string | null;
    village_code: string | null;
    address: string | null;
    zipcode: string | null;
    latitude: string | null;
    longitude: string | null;
};

interface OnboardingPageProps {
    prefilled_data: PrefilledData;
}

export default function OnboardingPage({ prefilled_data }: OnboardingPageProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: prefilled_data.email || '',
        name: prefilled_data.name || '',
        phone: prefilled_data.phone || '',
        tenant_id: prefilled_data.tenant_id || '',
        tenant_name: prefilled_data.tenant_name || '',
        province_code: prefilled_data.province_code || '',
        city_code: prefilled_data.city_code || '',
        district_code: prefilled_data.district_code || '',
        village_code: prefilled_data.village_code || '',
        address: prefilled_data.address || '',
        zipcode: prefilled_data.zipcode || '',
        sia_number: '',
        sia_document: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('onboarding.store'));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData('sia_document', e.target.files[0]);
        }
    };

    return (
        <>
            <Head title="Complete Onboarding" />

            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Welcome! 🎉</CardTitle>
                        <CardDescription>Please complete your onboarding details below:</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{errors.name}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} disabled />
                                {errors.email && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{errors.email}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                {errors.phone && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{errors.phone}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Tenant ID */}
                            <div className="space-y-2">
                                <Label htmlFor="tenant_id">Tenant ID</Label>
                                <Input
                                    id="tenant_id"
                                    type="text"
                                    value={data.tenant_id}
                                    onChange={(e) => setData('tenant_id', e.target.value)}
                                    disabled
                                />
                            </div>

                            {/* Tenant Name */}
                            <div className="space-y-2">
                                <Label htmlFor="tenant_name">Tenant Name</Label>
                                <Input
                                    id="tenant_name"
                                    type="text"
                                    value={data.tenant_name}
                                    onChange={(e) => setData('tenant_name', e.target.value)}
                                    disabled
                                />
                            </div>

                            {/* Cascading Region Select */}
                            <CascadingRegionSelect
                                onProvinceChange={(value) => setData('province_code', value)}
                                onCityChange={(value) => setData('city_code', value)}
                                onDistrictChange={(value) => setData('district_code', value)}
                                onVillageChange={(value) => setData('village_code', value)}
                                initialProvince={data.province_code}
                                initialCity={data.city_code}
                                initialDistrict={data.district_code}
                                initialVillage={data.village_code}
                            />

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Enter your full address"
                                    required
                                />
                                {errors.address && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{errors.address}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Zipcode */}
                            <div className="space-y-2">
                                <Label htmlFor="zipcode">Zipcode</Label>
                                <Input
                                    id="zipcode"
                                    type="text"
                                    value={data.zipcode}
                                    onChange={(e) => setData('zipcode', e.target.value)}
                                    placeholder="Enter zipcode"
                                />
                                {errors.zipcode && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{errors.zipcode}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* SIA Number */}
                            <div className="space-y-2">
                                <Label htmlFor="sia_number">SIA Number</Label>
                                <Input
                                    id="sia_number"
                                    type="text"
                                    value={data.sia_number}
                                    onChange={(e) => setData('sia_number', e.target.value)}
                                    placeholder="Enter your SIA number"
                                    required
                                />
                                {errors.sia_number && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{errors.sia_number}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* SIA Document */}
                            <div className="space-y-2">
                                <Label htmlFor="sia_document">SIA Document</Label>
                                <Input id="sia_document" type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
                                {errors.sia_document && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{errors.sia_document}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Submit */}
                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Saving...' : 'Complete Onboarding'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
