/** Design tokens — single source of truth for spacing, color, and typography */

export const colors = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E8E8E8',
  textPrimary: '#0D0D0D',
  textSecondary: '#6B6B6B',
  textMuted: '#ABABAB',

  // Type indicators — subtle, not saturated
  espi: '#1A6EBD',   // calm blue
  ebi: '#2E7D4F',    // muted green

  error: '#C0392B',
  separator: '#F0F0F0',
} as const;

export const typography = {
  fontSizeXS: 11,
  fontSizeSM: 13,
  fontSizeMD: 15,
  fontSizeLG: 17,
  fontSizeXL: 20,

  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,

  lineHeightTight: 18,
  lineHeightNormal: 22,
  lineHeightRelaxed: 26,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
} as const;
