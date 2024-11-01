/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Utility function to adjust color brightness
const adjustBrightness = (hex: string, percent: number) => {
  // Remove the # if present
  hex = hex.replace(/^#/, '');

  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Adjust brightness
  r = Math.min(255, Math.max(0, Math.round(r * (1 + percent))));
  g = Math.min(255, Math.max(0, Math.round(g * (1 + percent))));
  b = Math.min(255, Math.max(0, Math.round(b * (1 + percent))));

  // Convert back to hex
  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};


const brandColor = '#0059ff';
const errorColor = '#dc2626';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: brandColor,
    tabIconDefault: '#687076',
    tabIconSelected: brandColor,
    // Add semantic colors
    border: '#E5E7EB',
    cardBackground: '#FFFFFF',
    inputBackground: '#F9FAFB',
    error: errorColor,
    primary: {
      main: brandColor,
      disabled: '#93c5fd',
      text: '#FFFFFF',
    },
    secondary: {
      text: '#687076',  // same as tabIconDefault for consistency
    }
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: brandColor,
    tabIconDefault: '#9BA1A6',
    tabIconSelected: brandColor,
    // Add semantic colors
    border: '#374151',
    cardBackground: '#1F2937',
    inputBackground: '#1F2937',
    error: errorColor,
    primary: {
      main: brandColor,
      disabled: '#1D4ED8',
      text: '#FFFFFF',
    },
    secondary: {
      text: '#9BA1A6',  // same as tabIconDefault for consistency
    }
  },
};

