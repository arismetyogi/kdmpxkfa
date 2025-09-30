import SearchableSelect from '@/components/searchable-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCascadeSelection } from '@/hooks/useCascadeSelection';
import { useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { p } from '@/components/ui/p';
import ToggleDarkMode from '@/components/toggle-dark-mode';

type FormFields = {
    provinsi: string;
    kabupatenKota: string;
    kecamatan: string;
    kelurahanDesa: string;
    koperasiId: number | string; // Changed to accept ID instead of name
    suratPeminatan: File | null;
    selfAssessment: File | null;
    fotoDalam: File | null;
    fotoLuar: File | null;
    suratPernyataanApoteker: File | null;
    video360: File | null;
    gmapsLink: string;
};

type FlashProps = {
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        message?: string;
    };
};
export default function PermohonanForm() {
    const { data, setData, post, processing, errors, progress, reset } = useForm({
        provinsi: '',
        kabupatenKota: '',
        kecamatan: '',
        kelurahanDesa: '',
        koperasiId: '', // Changed from namaKoperasi to koperasiId
        suratPeminatan: null,
        selfAssessment: null,
        fotoDalam: null,
        fotoLuar: null,
        suratPernyataanApoteker: null,
        video360: null,
        gmapsLink: '',
    });

    const { cascadeData, loading, fetchCities, fetchDistricts, fetchVillages, fetchNamesByVillage } = useCascadeSelection();

    // Previews for image/video
    const [fotoDalamPreview, setFotoDalamPreview] = useState<string | null>(null);
    const [fotoLuarPreview, setFotoLuarPreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const isSubmitting = useRef(false);

    // Handle dependent selections
    useEffect(() => {
        if (data.provinsi) {
            fetchCities(data.provinsi);
        } else {
            // Reset dependent fields when province is cleared
            setData({
                ...data,
                provinsi: '',
                kabupatenKota: '',
                kecamatan: '',
                kelurahanDesa: '',
                koperasiId: '',
            });
        }
    }, [data.provinsi]);

    useEffect(() => {
        if (data.provinsi && data.kabupatenKota) {
            fetchDistricts(data.provinsi, data.kabupatenKota);
        } else {
            // Reset dependent fields when city is cleared
            setData({
                ...data,
                kabupatenKota: '',
                kecamatan: '',
                kelurahanDesa: '',
                koperasiId: '',
            });
        }
    }, [data.kabupatenKota]);

    useEffect(() => {
        if (data.provinsi && data.kabupatenKota && data.kecamatan) {
            fetchVillages(data.provinsi, data.kabupatenKota, data.kecamatan);
        } else {
            // Reset dependent fields when district is cleared
            setData({
                ...data,
                kecamatan: '',
                kelurahanDesa: '',
                koperasiId: '',
            });
        }
    }, [data.kecamatan]);

    useEffect(() => {
        if (data.provinsi && data.kabupatenKota && data.kecamatan && data.kelurahanDesa) {
            fetchNamesByVillage(data.provinsi, data.kabupatenKota, data.kecamatan, data.kelurahanDesa);
        } else {
            // Reset names when village is cleared
            setData({
                ...data,
                koperasiId: '',
            });
        }
    }, [data.kelurahanDesa]);

    function handleFile(
        key: keyof Pick<FormFields, 'suratPeminatan' | 'selfAssessment' | 'fotoDalam' | 'fotoLuar' | 'suratPernyataanApoteker' | 'video360'>,
        file: File | null,
    ) {
        setData(key as any, file as any);
        // Previews only for images/video
        if (key === 'fotoDalam') {
            if (fotoDalamPreview) URL.revokeObjectURL(fotoDalamPreview);
            setFotoDalamPreview(file ? URL.createObjectURL(file) : null);
        } else if (key === 'fotoLuar') {
            if (fotoLuarPreview) URL.revokeObjectURL(fotoLuarPreview);
            setFotoLuarPreview(file ? URL.createObjectURL(file) : null);
        } else if (key === 'video360') {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoPreview(file ? URL.createObjectURL(file) : null);
        }
    }

    const getFieldLabel = (field: string) => {
        const labels: Record<string, string> = {
            provinsi: 'Provinsi',
            kabupatenKota: 'Kabupaten/Kota',
            kelurahanDesa: 'Kelurahan/Desa',
            koperasiId: 'Nama Koperasi',
            namaKoperasi: 'Nama Koperasi',
            suratPeminatan: 'Surat Peminatan',
            selfAssessment: 'Self Assessment',
            fotoDalam: 'Foto Dalam',
            fotoLuar: 'Foto Luar',
            suratPernyataanApoteker: 'Surat Pernyataan Apoteker',
            video360: 'Video 360',
            gmapsLink: 'Link Google Maps',
        };

        return labels[field] || field;
    };
    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        isSubmitting.current = true;

        // Submit to the named route
        post(route('cooperation.store'), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                // Optionally reset files after success
                reset();
                // Show success toast
                toast.success('Pengajuan koperasi berhasil dikirim!');
                isSubmitting.current = false;
            },
            onError: (errors) => {
                console.log(errors);
                toast.error(
                    <div style={{ whiteSpace: "pre-line" }}>
                        {Object.entries(errors)
                            .map(([field, message]) => `• ${message}`)
                            .join("\n")}
                    </div>
                );
                // Show toast for non-validation errors or when using onError callback
                // Object.entries(errors).forEach(([field, message]) => {
                    // toast.error(`${getFieldLabel(field)}: ${message}`);
                // });
                isSubmitting.current = false;
            },
        });
    }

    const { flash } = usePage<FlashProps>().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.warning) toast.warning(flash.warning);
        if (flash?.message) toast.info(flash.message);
    }, [flash]);

    // Effect to handle validation errors that appear in the errors object
    useEffect(() => {
        // Show toast for validation errors only when form was submitted
        //     console.log(errors);
        if (Object.keys(errors).length > 0 && isSubmitting.current) {
            // Show toast for each validation error
            Object.entries(errors).forEach(([field, message]) => {
                if (typeof message === 'string') {
                    toast.error(`${getFieldLabel(field)}: ${message}`);
                } else if (Array.isArray(message)) {
                    message.forEach((msg) => {
                        toast.error(`${getFieldLabel(field)}: ${msg}`);
                    });
                }
            });
        }
    }, [errors]);

    const contohGmaps = 'https://maps.app.goo.gl/9XcZExampleLink123';

    return (
        <div className="max-w-3xl mx-auto my-4 relative">
            <Toaster />
            <div className="absolute top-2 right-4">
                <ToggleDarkMode/>
            </div>
            <Card className="mx-auto max-w-5xl bg-secondary/20 text-card-foreground">
                <CardHeader>
                    <CardTitle className="text-balance">Form Pengajuan Kerjasama Koperasi - Apotek</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-2">
                        {/* Lokasi */}
                        <fieldset className="space-y-2 rounded-lg bg-card p-4">
                            <legend className="font-semibold text-xl text-primary">Lokasi</legend>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="provinsi">Pilih Provinsi</Label>
                                    <SearchableSelect
                                        options={cascadeData.provinces.map((p) => ({ label: p, value: p }))}
                                        value={data.provinsi}
                                        onChange={(v) => {
                                            // Reset dependent selections
                                            setData({
                                                ...data,
                                                provinsi: String(v),
                                                kabupatenKota: '',
                                                kecamatan: '',
                                                kelurahanDesa: '',
                                                namaKoperasi: '',
                                            });
                                        }}
                                        placeholder={loading.provinces ? 'Memuat...' : 'Pilih provinsi'}
                                        disabled={loading.provinces}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="kabupatenKota">Pilih Kabupaten/Kota</Label>
                                    <SearchableSelect
                                        options={cascadeData.cities.map((c) => ({ label: c, value: c }))}
                                        value={data.kabupatenKota}
                                        onChange={(v) => {
                                            setData({
                                                ...data,
                                                kabupatenKota: String(v),
                                                kecamatan: '',
                                                kelurahanDesa: '',
                                                namaKoperasi: '',
                                            });
                                        }}
                                        placeholder={loading.cities ? 'Memuat...' : 'Pilih kabupaten/kota'}
                                        disabled={!data.provinsi || loading.cities}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="kecamatan">Pilih Kecamatan</Label>
                                    <SearchableSelect
                                        options={cascadeData.districts.map((d) => ({ label: d, value: d }))}
                                        value={data.kecamatan}
                                        onChange={(v) => {
                                            setData({
                                                ...data,
                                                kecamatan: String(v),
                                                kelurahanDesa: '',
                                                namaKoperasi: '',
                                            });
                                        }}
                                        placeholder={loading.districts ? 'Memuat...' : 'Pilih kecamatan'}
                                        disabled={!data.kabupatenKota || loading.districts}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="kelurahanDesa">Pilih Kelurahan/Desa</Label>
                                    <SearchableSelect
                                        options={cascadeData.villages.map((v) => ({ label: v, value: v }))}
                                        value={data.kelurahanDesa}
                                        onChange={(v) => {
                                            setData({
                                                ...data,
                                                kelurahanDesa: String(v),
                                                namaKoperasi: '',
                                            });
                                        }}
                                        placeholder={loading.villages ? 'Memuat...' : 'Pilih kelurahan/desa'}
                                        disabled={!data.kecamatan || loading.villages}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="koperasiId">Pilih Nama Koperasi</Label>
                                <SearchableSelect
                                    options={cascadeData.names.map((k) => ({ label: k.name, value: k.id }))}
                                    value={data.koperasiId}
                                    onChange={(v) => setData('koperasiId', v)}
                                    placeholder={loading.names ? 'Memuat...' : 'Pilih nama koperasi'}
                                    disabled={!data.kelurahanDesa || loading.names}
                                />
                            </div>
                        </fieldset>

                        {/* Dokumen */}
                        <fieldset className="space-y-2 rounded-lg bg-card p p-4">
                            <legend className="font-semibold text-xl text-primary">Dokumen</legend>

                            <div className="space-y-2">
                                <Label htmlFor="suratPeminatan">Upload Surat Peminatan</Label>
                                <Input
                                    id="suratPeminatan"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                    onChange={(e) => handleFile('suratPeminatan', e.currentTarget.files?.[0] || null)}
                                />
                                <details className="rounded-md bg-muted/50 p-3">
                                    <summary className="cursor-pointer text-sm">Contoh / Template</summary>
                                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                                        <p>
                                            Unduh template:{' '}
                                            <a className="underline" href="/examples/surat-peminatan-template.md" download>
                                                surat-peminatan-template.md
                                            </a>
                                        </p>
                                        <p>Format disarankan: PDF. Sertakan kop surat, tujuan, dan tanda tangan.</p>
                                    </div>
                                </details>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="selfAssessment">Upload Self Assessment</Label>
                                <Input
                                    id="selfAssessment"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xlsx,.xls"
                                    onChange={(e) => handleFile('selfAssessment', e.currentTarget.files?.[0] || null)}
                                />
                                <details className="rounded-md bg-muted/50 p-3">
                                    <summary className="cursor-pointer text-sm">Contoh / Template</summary>
                                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                                        <p>
                                            Unduh template:{' '}
                                            <a className="underline" href="/examples/self-assessment-template.md" download>
                                                self-assessment-template.md
                                            </a>
                                        </p>
                                        <p>Isi checklist kepatuhan dan bukti pendukung.</p>
                                    </div>
                                </details>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="suratPernyataanApoteker">Upload Surat Pernyataan Apoteker (Bersedia Menjadi Penanggung Jawab)</Label>
                                <Input
                                    id="suratPernyataanApoteker"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                    onChange={(e) => handleFile('suratPernyataanApoteker', e.currentTarget.files?.[0] || null)}
                                />
                                <details className="rounded-md bg-muted/50 p-3">
                                    <summary className="cursor-pointer text-sm">Contoh / Template</summary>
                                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                                        <p>
                                            Unduh template:{' '}
                                            <a className="underline" href="/examples/surat-pernyataan-apoteker-template.md" download>
                                                surat-pernyataan-apoteker-template.md
                                            </a>
                                        </p>
                                        <p>Lampirkan STRA/SIPA bila ada, tanda tangan apoteker.</p>
                                    </div>
                                </details>
                            </div>
                        </fieldset>

                        {/* Foto & Video */}
                        <fieldset className="space-y-2 rounded-lg bg-card p-4">
                            <legend className="font-semibold text-xl text-primary">Foto & Video</legend>

                            <div className="space-y-2">
                                <Label htmlFor="fotoDalam">Upload Foto Tampilan Dalam Bangunan</Label>
                                <Input
                                    id="fotoDalam"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFile('fotoDalam', e.currentTarget.files?.[0] || null)}
                                />
                                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {fotoDalamPreview && (
                                        <figure className="rounded-md border p-2">
                                            <img
                                                src={fotoDalamPreview || '/placeholder.svg'}
                                                alt="Pratinjau foto tampilan dalam"
                                                className="h-auto w-full rounded-sm"
                                            />
                                            <figcaption className="mt-2 text-xs text-muted-foreground">Pratinjau unggahan Anda</figcaption>
                                        </figure>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fotoLuar">Upload Foto Tampilan Luar Bangunan</Label>
                                <Input
                                    id="fotoLuar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFile('fotoLuar', e.currentTarget.files?.[0] || null)}
                                />
                                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {fotoLuarPreview && (
                                        <figure className="rounded-md border p-2">
                                            <img
                                                src={fotoLuarPreview || '/placeholder.svg'}
                                                alt="Pratinjau foto tampilan luar"
                                                className="h-auto w-full rounded-sm"
                                            />
                                            <figcaption className="mt-2 text-xs text-muted-foreground">Pratinjau unggahan Anda</figcaption>
                                        </figure>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="video360">Upload Video 360° Sekitar Bangunan</Label>
                                <Input
                                    id="video360"
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFile('video360', e.currentTarget.files?.[0] || null)}
                                />
                                <details className="rounded-md bg-muted/50 p-3">
                                    <summary className="cursor-pointer text-sm">Panduan</summary>
                                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                                        <p>Durasi 5–20 detik, format MP4/MOV, resolusi min. 720p, gerakan stabil.</p>
                                    </div>
                                </details>
                                {videoPreview && (
                                    <div className="rounded-md border p-2">
                                        <video src={videoPreview} controls className="h-auto w-full rounded-sm" aria-label="Pratinjau video 360" />
                                        <p className="mt-2 text-xs text-muted-foreground">Pratinjau unggahan Anda</p>
                                    </div>
                                )}
                            </div>
                        </fieldset>

                        {/* Titik Google Maps */}
                        <fieldset className="space-y-2 rounded-lg bg-card p-4">
                            <legend className="font-semibold text-xl text-primary">Titik Google Maps</legend>
                            <Label htmlFor="gmapsLink">Link Google Maps</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="gmapsLink"
                                    type="url"
                                    placeholder="https://maps.app.goo.gl/AWm9d281q6RpA1xR9"
                                    value={data.gmapsLink}
                                    onChange={(e) => setData('gmapsLink', e.currentTarget.value)}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => window.open('https://maps.google.com', '_blank', 'noopener,noreferrer')}
                                >
                                    Buka Google Maps
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Cara: buka Google Maps → pilih lokasi → klik Bagikan/Share → salin link → tempel di kolom atas.
                            </p>
                            <p className="text-xs text-muted-foreground">Contoh link valid: {contohGmaps}</p>
                        </fieldset>

                        {/* Submit */}
                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                            </Button>
                            {progress && (
                                <p className="text-sm text-muted-foreground" aria-live="polite">
                                    Mengunggah: {progress.percentage}%
                                </p>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
