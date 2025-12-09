/**
 * MonCVPro Design System
 * Unified design tokens, components, and utilities
 */

// ============================================================================
// COLOR SYSTEM
// ============================================================================

export const colors = {
    // Primary Colors
    primary: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6', // Main Primary
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
    },

    // Secondary Colors (Purple)
    secondary: {
        50: '#FAF5FF',
        100: '#F3E8FF',
        200: '#E9D5FF',
        300: '#D8B4FE',
        400: '#C084FC',
        500: '#A855F7',
        600: '#8B5CF6', // Main Secondary
        700: '#7C3AED',
        800: '#6D28D9',
        900: '#5B21B6',
    },

    // Success
    success: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        500: '#10B981',
        700: '#047857',
    },

    // Warning
    warning: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        500: '#F59E0B',
        700: '#B45309',
    },

    // Error
    error: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        500: '#EF4444',
        700: '#B91C1C',
    },

    // Neutral
    neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    }
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
    fontFamily: {
        sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: "'JetBrains Mono', 'Fira Code', monospace",
    },

    fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
    },

    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },

    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    }
};

// ============================================================================
// SPACING (8px Grid System)
// ============================================================================

export const spacing = {
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px  ← Base unit
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    8: '2rem',        // 32px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
};

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',

    // Colored shadows
    primarySm: '0 1px 3px 0 rgba(59, 130, 246, 0.3)',
    primaryMd: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
    primaryLg: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',
};

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
    duration: {
        fast: '150ms',
        base: '300ms',
        slow: '500ms',
    },

    timing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // Prebuilt transitions
    all: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
};

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const components = {
    button: {
        primary: {
            bg: colors.primary[600],
            bgHover: colors.primary[700],
            text: '#FFFFFF',
            shadow: shadows.primaryMd,
        },
        secondary: {
            bg: colors.secondary[600],
            bgHover: colors.secondary[700],
            text: '#FFFFFF',
            shadow: shadows.md,
        },
        outline: {
            bg: 'transparent',
            bgHover: colors.neutral[50],
            text: colors.primary[600],
            border: colors.primary[600],
        },
        ghost: {
            bg: 'transparent',
            bgHover: colors.neutral[100],
            text: colors.neutral[700],
        },
        danger: {
            bg: colors.error[500],
            bgHover: colors.error[700],
            text: '#FFFFFF',
        },
    },

    card: {
        base: {
            bg: '#FFFFFF',
            border: colors.neutral[200],
            shadow: shadows.base,
            radius: borderRadius.xl,
        },
        elevated: {
            bg: '#FFFFFF',
            border: 'transparent',
            shadow: shadows.lg,
            radius: borderRadius.xl,
        },
    },

    input: {
        base: {
            bg: '#FFFFFF',
            border: colors.neutral[300],
            borderFocus: colors.primary[500],
            text: colors.neutral[900],
            placeholder: colors.neutral[400],
            radius: borderRadius.lg,
            shadow: shadows.sm,
        },
    },

    badge: {
        primary: {
            bg: colors.primary[100],
            text: colors.primary[700],
        },
        success: {
            bg: colors.success[100],
            text: colors.success[700],
        },
        warning: {
            bg: colors.warning[100],
            text: colors.warning[700],
        },
        error: {
            bg: colors.error[100],
            text: colors.error[700],
        },
    },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get color with opacity
 * @param color - Hex color
 * @param opacity - 0-100
 */
export const withOpacity = (color: string, opacity: number): string => {
    const hex = color.replace('#', '');
    const alpha = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');
    return `#${hex}${alpha}`;
};

/**
 * Generate responsive spacing
 * @param base - Base spacing value
 * @param scale - Scale factor
 */
export const responsiveSpacing = (base: number, scale: number = 1.5) => ({
    mobile: `${base}px`,
    tablet: `${base * scale}px`,
    desktop: `${base * scale * scale}px`,
});

/**
 * Create consistent gradient
 * @param from - Start color
 * @param to - End color
 * @param direction - Gradient direction
 */
export const gradient = (
    from: string,
    to: string,
    direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-tr' = 'to-r'
) => {
    const directionMap = {
        'to-r': 'to right',
        'to-l': 'to left',
        'to-t': 'to top',
        'to-b': 'to bottom',
        'to-br': 'to bottom right',
        'to-tr': 'to top right',
    };

    return `linear-gradient(${directionMap[direction]}, ${from}, ${to})`;
};

// ============================================================================
// CSS CLASSES (for use with className)
// ============================================================================

export const classes = {
    // Container
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    containerFluid: 'w-full px-4 sm:px-6 lg:px-8',

    // Flex utilities
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    flexCol: 'flex flex-col',

    // Text
    headingXl: 'text-4xl sm:text-5xl font-bold',
    headingLg: 'text-3xl sm:text-4xl font-bold',
    headingMd: 'text-2xl sm:text-3xl font-bold',
    headingSm: 'text-xl sm:text-2xl font-semibold',

    // Gradients
    gradientPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600',
    gradientText: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600',

    // Effects
    hoverScale: 'transition-transform hover:scale-105',
    hoverLift: 'transition-all hover:-translate-y-1 hover:shadow-xl',
    smoothTransition: 'transition-all duration-300 ease-in-out',

    // Cards
    card: 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
    cardHover: 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300',

    // Buttons (base)
    btn: 'px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2',
    btnPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
    btnSecondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',

    // Inputs
    input: 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all',

    // Badges
    badge: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
    badgePrimary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    badgeSuccess: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',

    // Animations
    fadeIn: 'animate-in fade-in duration-300',
    slideInFromBottom: 'animate-in slide-in-from-bottom-4 duration-300',
    zoomIn: 'animate-in zoom-in-95 duration-300',
};

// Export everything as default
export default {
    colors,
    typography,
    spacing,
    shadows,
    borderRadius,
    transitions,
    breakpoints,
    zIndex,
    components,
    classes,
    withOpacity,
    responsiveSpacing,
    gradient,
};
