import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-16 bg-gray-900 text-gray-300">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-4">
                {/* Brand */}
                <div>
                    <img src="/Logo KFA member of BioFarma 300x300-01.png" alt="KFA Logo" className="mb-3 h-20 w-auto" />
                    <p className="mt-3 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, voluptates.</p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Navigasi</h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/shop" className="hover:text-white">
                                Belanja
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="hover:text-white">
                                Tentang Kami
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:text-white">
                                Kontak
                            </a>
                        </li>
                        <li>
                            <a href="/faq" className="hover:text-white">
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Kontak</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Phone size={16} /> 021-3857-245
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={16} /> sekretariat@kimiafarmaapotek.co.id
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={16} /> Jl. Budi Utomo No.1 Jakarta Pusat
                        </li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Ikuti Kami</h3>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" className="hover:text-white">
                            <Facebook size={20} />
                        </a>
                        <a href="https://instagram.com" target="_blank" className="hover:text-white">
                            <Instagram size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" className="hover:text-white">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Kimia Farma Apotek. All rights reserved.
            </div>
        </footer>
    );
}
