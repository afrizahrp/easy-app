import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const isLocationMatch = (
//   targetLocation: any,
//   locationName: any
// ): boolean => {
//   return (
//     locationName === targetLocation ||
//     locationName.startsWith(`${targetLocation}/`)
//   );
// };

export const isLocationMatch = (href: string, locationName: string) => {
  const normalizePath = (path: string) => path.replace(/\/$/, '');
  return normalizePath(href) === normalizePath(locationName);
};

export const getDynamicPath = (pathname: string) => {
  return pathname;
};

export const RGBToHex = (r: number, g: number, b: number): string => {
  const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const redHex: string = componentToHex(r);
  const greenHex: string = componentToHex(g);
  const blueHex: string = componentToHex(b);

  return '#' + redHex + greenHex + blueHex;
};

export function hslToHex(hsl: string): string {
  // Remove "hsla(" and ")" from the HSL string
  let hslValues = hsl.replace('hsla(', '').replace(')', '');

  // Split the HSL string into an array of H, S, and L values
  const [h, s, l] = hslValues.split(' ').map((value) => {
    if (value.endsWith('%')) {
      // Remove the "%" sign and parse as a float
      return parseFloat(value.slice(0, -1));
    } else {
      // Parse as an integer
      return parseInt(value);
    }
  });

  // Function to convert HSL to RGB
  function hslToRgb(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    // Convert RGB values to integers
    const rInt = Math.round(r * 255);
    const gInt = Math.round(g * 255);
    const bInt = Math.round(b * 255);

    // Convert RGB values to a hex color code
    const rgbToHex = (value: number): string => {
      const hex = value.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${rgbToHex(rInt)}${rgbToHex(gInt)}${rgbToHex(bInt)}`;
  }

  // Call the hslToRgb function and return the hex color code
  return hslToRgb(h, s, l);
}

export const hexToRGB = (hex: string, alpha?: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export const Years = [
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
];

export const getDefaultYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  return [`${currentYear - 1}`, `${currentYear}`];
};

export const CURRENCY = 'IDR';

export const formatCurrency = (
  amount: number,
  currency: string = CURRENCY,
  locale: string = 'id-ID'
): string => {
  return `${amount.toLocaleString(locale)} ${currency}`;
};

// src/lib/utils.ts
// src/lib/utils.ts

export const generateYearColorPalette = (years: string[]) => {
  // Pemetaan warna statis untuk setiap tahun (gradient dari gelap ke terang)
  const yearColorMap: { [key: string]: [string, string] } = {
    '2025': ['hsl(120, 70%, 30%)', 'hsl(120, 70%, 50%)'], // Hijau
    '2024': ['hsl(220, 70%, 40%)', 'hsl(220, 70%, 60%)'], // Biru
    '2023': ['hsl(30, 70%, 40%)', 'hsl(30, 70%, 60%)'], // Oranye
    '2022': ['hsl(60, 70%, 50%)', 'hsl(60, 70%, 70%)'], // Kuning
    '2021': ['hsl(300, 70%, 40%)', 'hsl(300, 70%, 60%)'], // Ungu
    '2020': ['hsl(180, 70%, 40%)', 'hsl(180, 70%, 60%)'], // Cyan
    '2019': ['hsl(30, 70%, 40%)', 'hsl(30, 70%, 60%)'], // Oranye
    '2018': ['hsl(90, 70%, 40%)', 'hsl(90, 70%, 60%)'], // Hijau muda
    '2017': ['hsl(270, 70%, 40%)', 'hsl(270, 70%, 60%)'], // Magenta
    '2016': ['hsl(150, 70%, 40%)', 'hsl(150, 70%, 60%)'], // Hijau kebiruan
    '2015': ['hsl(240, 70%, 40%)', 'hsl(240, 70%, 60%)'], // Biru tua
    '2014': ['hsl(330, 70%, 40%)', 'hsl(330, 70%, 60%)'], // Pink
    '2013': ['hsl(15, 70%, 40%)', 'hsl(15, 70%, 60%)'], // Merah oranye
    '2012': ['hsl(210, 70%, 40%)', 'hsl(210, 70%, 60%)'], // Biru muda
  };

  // Kembalikan array warna hanya untuk tahun yang ada di input
  return years.map((year) => {
    // Gunakan warna dari yearColorMap, fallback ke biru jika tahun tidak ditemukan
    return yearColorMap[year] || ['hsl(220, 70%, 40%)', 'hsl(220, 70%, 60%)'];
  });
};

export function lightenColor(hex: string, amount: number): string {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const r = Math.min(
    255,
    Math.floor(parseInt(color.slice(0, 2), 16) * (1 + amount))
  );
  const g = Math.min(
    255,
    Math.floor(parseInt(color.slice(2, 4), 16) * (1 + amount))
  );
  const b = Math.min(
    255,
    Math.floor(parseInt(color.slice(4, 6), 16) * (1 + amount))
  );
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export const formatTime = (time: number | Date | string): string => {
  if (!time) return '';

  const date = new Date(time);
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return formattedTime;
};

// object check
export function isObjectNotEmpty(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return Object.keys(obj).length > 0;
}

export const formatDate = (date: string | number | Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

// random word
export function getWords(inputString: string): string {
  // Remove spaces from the input string
  const stringWithoutSpaces = inputString.replace(/\s/g, '');

  // Extract the first three characters
  return stringWithoutSpaces.substring(0, 3);
}

// for path name
// export function getDynamicPath(pathname: any): any {
//   const prefixes = ['en', 'bn', 'ar'];

//   for (const prefix of prefixes) {
//     if (pathname.startsWith(`/${prefix}/`)) {
//       return `/${pathname.slice(prefix.length + 2)}`;
//     }
//   }

//   return pathname;
// }

// translate

interface Translations {
  [key: string]: string;
}

export const translate = (title: string, trans: Translations): string => {
  const lowercaseTitle = title.toLowerCase();

  if (trans?.hasOwnProperty(lowercaseTitle)) {
    return trans[lowercaseTitle];
  }

  return title;
};
