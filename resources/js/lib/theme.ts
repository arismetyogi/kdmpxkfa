// Utility functions for working with theme colors
export const themeColors = {
    // Background colors
    background: 'bg-background',
    card: 'bg-card',
    popover: 'bg-popover',

    // Foreground colors
    foreground: 'text-foreground',
    cardForeground: 'text-card-foreground',
    popoverForeground: 'text-popover-foreground',

    // Primary colors
    primary: 'bg-primary',
    primaryForeground: 'text-primary-foreground',

    // Secondary colors
    secondary: 'bg-secondary',
    secondaryForeground: 'text-secondary-foreground',

    // Muted colors
    muted: 'bg-muted',
    mutedForeground: 'text-muted-foreground',

    // Accent colors
    accent: 'bg-accent',
    accentForeground: 'text-accent-foreground',

    // Destructive colors
    destructive: 'bg-destructive',
    destructiveForeground: 'text-destructive-foreground',

    // Border colors
    border: 'border-border',
    input: 'border-input',
    ring: 'ring-ring',

    // Chart colors
    chart1: 'bg-chart-1',
    chart2: 'bg-chart-2',
    chart3: 'bg-chart-3',
    chart4: 'bg-chart-4',
    chart5: 'bg-chart-5',

    // Sidebar colors
    sidebar: 'bg-sidebar',
    sidebarForeground: 'text-sidebar-foreground',
    sidebarPrimary: 'bg-sidebar-primary',
    sidebarPrimaryForeground: 'text-sidebar-primary-foreground',
    sidebarAccent: 'bg-sidebar-accent',
    sidebarAccentForeground: 'text-sidebar-accent-foreground',
    sidebarBorder: 'border-sidebar-border',
    sidebarRing: 'ring-sidebar-ring',
};

// Utility function to get color classes
export const getColorClass = (color: keyof typeof themeColors) => {
    return themeColors[color];
};

// Utility function to apply theme classes
export const applyTheme = (element: HTMLElement, theme: 'light' | 'dark') => {
    if (theme === 'dark') {
        element.classList.add('dark');
    } else {
        element.classList.remove('dark');
    }
};
