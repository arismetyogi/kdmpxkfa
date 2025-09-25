import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/types';

interface ProductShowModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function ProductShowModal({ isOpen, onClose, product }: ProductShowModalProps) {
    if (!isOpen) return null;

    return (
        <Dialog
            open={!!product}
            onOpenChange={() => {
                product = null;
                onClose();
            }}
        >
            <DialogContent className="max-h-[90vh] w-[95%] overflow-y-auto sm:max-w-lg md:max-w-2xl">
                {product && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{product.name}</DialogTitle>
                            <DialogDescription>{product.description || 'Tidak ada deskripsi tersedia.'}</DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <img src={product.image} alt={product.name} className="w-full rounded-lg border object-cover sm:w-1/3" />
                            <div className="flex-1 space-y-2">
                                <p>
                                    <strong>Harga:</strong> Rp{product.price.toLocaleString()}
                                </p>
                                <p>
                                    <strong>Kategori:</strong> {product.category?.subcategory2}
                                </p>
                                <p>
                                    <strong>Kemasan:</strong> {product.order_unit}
                                </p>
                                <p>
                                    <strong>Kuantitas:</strong> {product.content}
                                </p>
                            </div>
                        </div>

                        {/* 🔹 Tabs untuk Benefit & Dosage */}
                        <Tabs defaultValue="benefit" className="mt-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="benefit">Benefit</TabsTrigger>
                                <TabsTrigger value="dosage">Dosage</TabsTrigger>
                            </TabsList>

                            <TabsContent value="benefit" className="mt-2 text-sm text-gray-700">
                                {product.pharmacology ? <p>{product.pharmacology}</p> : 'Belum ada informasi benefit.'}
                            </TabsContent>

                            <TabsContent value="dosage" className="mt-2 text-sm text-gray-700">
                                <div className="space-y-1">
                                    {product.dosage?.map((line: string, idx: number) => {
                                        const formatted = line
                                            .replace(/Dewasa:/g, '<strong>Dewasa:</strong>')
                                            .replace(/Anak-anak:/g, '<strong>Anak-anak:</strong>');
                                        return (
                                            <p
                                                key={idx}
                                                dangerouslySetInnerHTML={{
                                                    __html: formatted + (line.endsWith('.') ? '' : '.'),
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </DialogContent>
            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </Dialog>
    );
}
