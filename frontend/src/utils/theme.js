// Theme constants for SignalDesk AI
export const colors = {
  // Primary backgrounds
  background: '#0A0A0F',
  backgroundSecondary: '#14141F',
  backgroundTertiary: '#1A1A28',
  card: '#16161F',
  cardHighlight: '#1F1F2E',
  
  // Signal colors
  buy: '#10B981',
  buyDark: '#059669',
  buyGlow: 'rgba(16, 185, 129, 0.2)',
  sell: '#EF4444',
  sellDark: '#DC2626',
  sellGlow: 'rgba(239, 68, 68, 0.2)',
  
  // Accent colors
  gold: '#F59E0B',
  goldGlow: 'rgba(245, 158, 11, 0.2)',
  electric: '#3B82F6',
  electricGlow: 'rgba(59, 130, 246, 0.2)',
  purple: '#8B5CF6',
  purpleGlow: 'rgba(139, 92, 246, 0.2)',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  
  // Border colors
  border: '#1F1F2E',
  borderLight: '#2A2A3E',
  
  // Status colors
  active: '#10B981',
  inactive: '#6B7280',
  warning: '#F59E0B',
  error: '#EF4444',
  success: '#10B981',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
  },
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
  },
  // Labels
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Numeric (monospace style)
  numeric: {
    fontSize: 18,
    fontWeight: '600',
  },
  numericLarge: {
    fontSize: 28,
    fontWeight: '700',
  },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};
