import type { Config } from 'tailwindcss';
import planetaryPreset from '../../packages/design-tokens/tailwind.preset';

const config: Config = {
  presets: [planetaryPreset as Config],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'holokai-gold': '#f59e0b',
        'holokai-abyss': '#020205',
      },
    },
  },
  plugins: [],
};

export default config;
