import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type PrefilledData = {
    username: string | null;
    email: string | null;
    name: string | null;
    phone: string | null;
    tenant_id: string | null;
    tenant_name: string | null;
};

interface OnboardingPageProps {
    prefilled_data: PrefilledData;
}

export default function OnboardingPage({ prefilled_data }: OnboardingPageProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: prefilled_data.email || "",
        name: prefilled_data.name || "",
        phone: prefilled_data.phone || "",
        tenant_id: prefilled_data.tenant_id || "",
        tenant_name: prefilled_data.tenant_name || "",
        sia_number: "",
        sia_document: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("onboarding.store"));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData("sia_document", e.target.files[0]);
        }
    };

    return (
        <>
            <Head title="Complete Onboarding" />

            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Welcome! 🎉</CardTitle>
                        <CardDescription>
                            Please complete your onboarding details below:
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
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
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    disabled
                                />
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
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                />
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
                                    onChange={(e) => setData("tenant_id", e.target.value)}
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
                                    onChange={(e) => setData("tenant_name", e.target.value)}
                                    disabled
                                />
                            </div>

                            {/* SIA Number */}
                            <div className="space-y-2">
                                <Label htmlFor="sia_number">SIA Number</Label>
                                <Input
                                    id="sia_number"
                                    type="text"
                                    value={data.sia_number}
                                    onChange={(e) => setData("sia_number", e.target.value)}
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
                                <Input
                                    id="sia_document"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required
                                />
                                {errors.sia_document && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{errors.sia_document}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing ? "Saving..." : "Complete Onboarding"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
