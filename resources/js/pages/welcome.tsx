import { Head, Link } from '@inertiajs/react';
import { usePermission } from '@/hooks/user-permissions';
import { Pill, Stethoscope, Baby, HeartPulse } from 'lucide-react';
import Hero from '@/components/Hero';
import LogoLoop from '@/components/LogoLoop';

export default function Welcome() {
    const { user } = usePermission();

    const isUser = user?.roles?.some((role) => ['user'].includes(role.toLowerCase()));
    const dashRoute = isUser ? 'dashboard' : 'admin.dashboard';

     const partners = [
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
    
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
    
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
    
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
    
    { src: "/Logo KFA member of BioFarma 300x300-01.png", alt: "Kimia Farma" },
    
  ];

    return (
        <>
            <Head title="Selamat Datang di Kimia Farma">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
                <style>{`
                    body {
                        font-family: 'Instrument Sans', sans-serif;
                    }
                `}</style>
            </Head>

           <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* =========== Header =========== */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* === 2 Logo sebelahan === */}
                <div className="flex items-center gap-4">
                    <Link href="/">
                    <img
                        src="/Logo KFA member of BioFarma 300x300-01.png"
                        alt="Logo 1"
                        className="h-18 w-auto"
                    />
                    </Link>
                    <Link href="/">
                    <img
                        src="/danantara.webp"
                        alt="Logo 2"
                        className="h-18 w-auto"
                    />
                    </Link>
                </div>

                {/* === Menu kanan === */}
                <div className="flex items-center gap-3 text-sm">
                    {user ? (
                    <>
                        <Link
                        href={route(dashRoute)}
                        className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                        {isUser ? "Dashboard" : "Admin Dashboard"}
                        </Link>
                        <Link
                        className="rounded-md px-4 py-2 text-gray-200 transition hover:bg-white/20"
                        method="post"
                        href={route("logout")}
                        >
                        Logout
                        </Link>
                    </>
                    ) : (
                    <>
                        <Link
                        href={route("login")}
                        className="rounded-md border border-orange-400 bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-700"
                        >
                        Login
                        </Link>
                        {/* 
                        <Link
                        href={route("register")}
                        className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                        Daftar
                        </Link> 
                        */}
                    </>
                    )}
                </div>
                </div>
            </header>

                {/*Card */}
            <main className="relative">
                <Hero/>
             </main>

        <LogoLoop logos={partners} speed={100} fadeOut scaleOnHover logoHeight={60} gap={48} />
        <h1>oioaksbk</h1>
        
      

            </div>
        </>
    );
}




  

