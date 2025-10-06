import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

interface Notification {
    id: string;
    type: string;
    data: {
        order_id: number;
        order_number: string;
        customer_name: string;
        customer_email: string;
        message: string;
        created_at: string;
    };
    read_at: string | null;
    created_at: string;
}

interface NotificationSheetProps {
    newNotifications?: number;
}

export default function NotificationSheet({ newNotifications = 0 }: NotificationSheetProps) {
    const { props } = usePage<SharedData>();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(newNotifications);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get user from props
    const user = props.auth?.user;

    useEffect(() => {
        // Update unread count when new notifications come in
        setUnreadCount(newNotifications);
    }, [newNotifications]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch('/notifications', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unread_count || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const openSheet = () => {
        setIsOpen(true);
        fetchNotifications(); // Fetch notifications when sheet opens
    };

    const closeSheet = () => {
        setIsOpen(false);
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const response = await fetch(`/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                // Update the notification as read in the UI
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification.id === notificationId ? { ...notification, read_at: new Date().toISOString() } : notification,
                    ),
                );
                setUnreadCount((prev) => Math.max(prev - 1, 0));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/notifications/read-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                // Update all notifications as read in the UI
                setNotifications((prev) => prev.map((notification) => ({ ...notification, read_at: new Date().toISOString() })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const hasUnread = unreadCount > 0;

    return (
        <>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full" onClick={openSheet}>
                {hasUnread ? <BellRing className="h-6 w-6 text-foreground" /> : <Bell className="h-6 w-6 text-foreground" />}

                {hasUnread && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}

                <span className="sr-only">Notifications</span>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="right" className="w-[400px] p-0 sm:w-[540px]">
                    <SheetHeader className="border-b p-4">
                        <div className="flex items-center justify-between">
                            <SheetTitle>Notifications</SheetTitle>
                            <div className="flex items-center gap-2">
                                {hasUnread && (
                                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 px-2 mr-4 text-xs">
                                        Mark all as read
                                    </Button>
                                )}
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="h-full overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No notifications</div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className={`p-4 ${!notification.read_at ? 'bg-accent/30' : ''}`}>
                                        <Link
                                            href={
                                                (user?.roles && (
                                                    user.roles.includes('admin-apotek') ||
                                                    user.roles.includes('admin') ||
                                                    user.roles.includes('super-admin')
                                                ))
                                                    ? route('admin.orders.show', notification.data.order_number)
                                                    : route('history.show', notification.data.order_number)
                                            }
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium">{notification.data.message}</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Order #{notification.data.order_number} • {formatDate(notification.created_at)}
                                                    </p>
                                                </div>
                                                {!notification.read_at && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="ml-2 h-6 w-6 flex-shrink-0 p-0.5"
                                                    >
                                                        <X className="h-3 w-3" />
                                                        <span className="sr-only">Mark as read</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
