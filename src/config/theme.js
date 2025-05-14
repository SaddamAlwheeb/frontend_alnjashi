// src/config/theme.js
// Centralized theme configuration for consistent UI design

export const lightTheme = {
  dark: false,
  colors: {
    primary: '#1867C0',
    secondary: '#5CBBF6',
    accent: '#8C9EFF',
    success: '#4CAF50',
    info: '#2196F3',
    warning: '#FB8C00',
    error: '#FF5252',
    background: '#F5F7FA',
    surface: '#FFFFFF',
  },
}

export const darkTheme = {
  dark: true,
  colors: {
    primary: '#2196F3',
    secondary: '#424242',
    accent: '#FF4081',
    success: '#4CAF50',
    info: '#2196F3',
    warning: '#FB8C00',
    error: '#FF5252',
    background: '#121212',
    surface: '#1E1E1E',
  },
}

// Custom variable overrides
export const customVariables = {
  borderRadius: {
    root: '8px',
    button: '8px',
    card: '12px',
    chip: '16px',
  },
  // Font sizes
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  // Shadow levels
  elevation: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
    lg: '0 10px 25px rgba(0,0,0,0.1), 0 2px 10px rgba(0,0,0,0.04)',
    xl: '0 20px 40px rgba(0,0,0,0.12)',
  },
}

// Custom font settings
export const fontSettings = {
  fontFamily: {
    primary: 'Tajawal, sans-serif',
    secondary: 'Cairo, sans-serif',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}

// Animation settings
export const animationSettings = {
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
}
