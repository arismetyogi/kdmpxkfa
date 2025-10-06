import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import NotificationSheet from '@/components/notification-sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { useEffect, useState } from 'react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { props } = usePage<SharedData>();
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

    // Fetch unread notification count periodically
    useEffect(() => {
        const fetchNotificationCount = async () => {
            try {
                const response = await fetch('/notifications/unread-count', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUnreadNotificationCount(data.unread_count || 0);
                }
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };

        // Fetch immediately
        fetchNotificationCount();

        // Set up interval to fetch notifications every 30 seconds
        const interval = setInterval(fetchNotificationCount, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2 flex-1">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="fixed top-5 right-1/36 items-center gap-2">
                {/* Notification bell with tooltip */}
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <NotificationSheet
                                newNotifications={unreadNotificationCount}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Notifications</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </header>
    );
}
