export interface IpInfo {
  ip: string;
  countryName: string;
  isp: string;
  countryCode: string;
  countryNameKey?: string;
  ispKey?: string;
}

export type Language = 'en' | 'fa';

export type Translations = { [key: string]: string | Translations };
