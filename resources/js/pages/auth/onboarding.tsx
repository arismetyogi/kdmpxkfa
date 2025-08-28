import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

type PrefilledData = {
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
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("onboarding.store")); // ⬅️ adjust backend route
    };

    return (
        <>
            <Head title="Complete Onboarding" />

            <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl">
                <h1 className="text-2xl font-semibold mb-4">Welcome! 🎉</h1>
                <p className="text-gray-600 mb-6">
                    Please complete your onboarding details below:
                </p>

                <form onSubmit={submit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg"
                            disabled
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium">Phone Number</label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                    </div>

                    {/* Tenant ID */}
                    <div>
                        <label className="block text-sm font-medium">Tenant ID</label>
                        <input
                            type="text"
                            value={data.tenant_id}
                            onChange={(e) => setData("tenant_id", e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg"
                            disabled
                        />
                    </div>

                    {/* Tenant Name */}
                    <div>
                        <label className="block text-sm font-medium">Tenant Name</label>
                        <input
                            type="text"
                            value={data.tenant_name}
                            onChange={(e) => setData("tenant_name", e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg"
                            disabled
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? "Saving..." : "Complete Onboarding"}
                    </button>
                </form>
            </div>
        </>
    );
}
