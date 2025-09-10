import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    console.log(user);
    // Check if user has admin or manager role
    const isUser = user?.roles?.some((role) => ['user'].includes(role.name.toLowerCase()));

    const dashRoute = isUser ? 'dashboard' : 'admin.dashboard';

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-background p-6 text-foreground lg:justify-center lg:p-8">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={route(dashRoute)}
                                    className="inline-block rounded-sm border border-border px-5 py-1.5 text-sm leading-normal text-foreground hover:border-accent-foreground"
                                >
                                    {isUser ? 'Dashboard' : 'Admin Dashboard'}
                                </Link>
                                <Link className="inline-block rounded-sm border px-4 py-1.5 border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground" method="post" href={route('logout')}>Logout</Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-foreground hover:border-border"
                                >
                                    Log in
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                {/* Logo dan Teks Selamat Datang */}
                <div className="mb-10 text-center">
                    <AppLogoIcon className="mx-auto size-60 text-sidebar-primary dark:text-sidebar-primary" />
                    <h1 className="text-2xl font-semibold text-foreground dark:text-foreground">Selamat Datang, {auth.user?.name || 'Pengguna'} 👋</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Silakan pilih modul yang ingin Anda akses di bawah ini</p>
                </div>

                {/* Card Menu */}
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Pemesanan Barang Card */}
                        <Link
                            href={route('orders.products')}
                            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex flex-col items-start gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white dark:bg-green-900/30 dark:text-green-300 dark:group-hover:bg-green-600 dark:group-hover:text-white">
                                    📝
                                </div>
                                <h2 className="text-lg font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400">Pemesanan Barang</h2>
                                <p className="text-sm text-muted-foreground">
                                    Buat dan kelola pesanan barang sesuai kebutuhan operasional.
                                </p>
                            </div>
                        </Link>
                        {/* Penerimaan Barang Card */}
                        <Link
                            href={route('orders.products')}
                            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex flex-col items-start gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30 dark:text-blue-300 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                                    📦
                                </div>
                                <h2 className="text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">Penerimaan Barang</h2>
                                <p className="text-sm text-muted-foreground">
                                    Kelola dan catat proses penerimaan barang dengan mudah dan cepat.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
