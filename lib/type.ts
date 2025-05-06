// color type
export type color =
  | 'primary'
  | 'info'
  | 'warning'
  | 'success'
  | 'destructive'
  | 'secondary';
export type TextAreaColor =
  | 'primary'
  | 'info'
  | 'warning'
  | 'success'
  | 'destructive';
export type InputColor =
  | 'primary'
  | 'info'
  | 'warning'
  | 'success'
  | 'destructive';

//  variant
export type InputVariant =
  | 'flat'
  | 'underline'
  | 'bordered'
  | 'faded'
  | 'ghost'
  | 'flat-underline';
export type TextAreaVariant =
  | 'flat'
  | 'underline'
  | 'bordered'
  | 'faded'
  | 'ghost'
  | 'flat-underline';

// shadow
export type Shadow = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// radius

export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export type FormState =
  | {
      error?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
}

interface ThemeCssVars {
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;
  primary: string;
  'primary-foreground': string;
  secondary: string;
  // ... properti lain
  chartGird: string;
  chartLabel: string;
  tooltipBackground: string; // Tambahkan
  tooltipText: string; // Tambahkan
}

interface Theme {
  name: string;
  cssVars: {
    light: ThemeCssVars;
    dark: ThemeCssVars;
    // ... mode lain
  };
}

export const themes: Theme[] = [
  {
    name: 'Light',
    cssVars: {
      light: {
        background: 'white',
        foreground: 'black',
        card: 'white',
        'card-foreground': 'black',
        popover: 'white',
        'popover-foreground': 'black',
        primary: 'blue',
        'primary-foreground': 'white',
        secondary: 'gray',
        // ... properti lain
        chartGird: 'lightgray',
        chartLabel: 'black',
        tooltipBackground: 'white',
        tooltipText: 'black',
      },
      dark: {
        background: 'black',
        foreground: 'white',
        card: 'black',
        'card-foreground': 'white',
        popover: 'black',
        'popover-foreground': 'white',
        primary: 'blue',
        'primary-foreground': 'white',
        secondary: 'gray',
        // ... properti lain
        chartGird: 'darkgray',
        chartLabel: 'white',
        tooltipBackground: 'black',
        tooltipText: 'white',
      },
    },
  },
  // ... mode lain
];
