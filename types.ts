export type BusinessHours = {
  [day: string]: { open: string; close: string }; 
};

export type Billboard = {
  label: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type PaymentProvider = {
  name: string;
  accountId: string;
};

export type Firm = {
  Id: string;
  CoverPhoto?: string;
  ProfilePhoto?: string;
  Name?: string;
  Category?: string;
  Description?: string;
  Founded?: string;
  Location?: string;
  Email?: string;
  Phone?: string;
  Website?: string;
  Domain?: string;
  Subdomain?: string;
  Instagram?: string;
  X?: string;
  Facebook?: string;
  BusinessHours?: BusinessHours;
  Photos?: string[];
  Billboard?: Billboard;
  Theme?: string;
  IsOnboarded?: boolean;
  SubscriptionPlan?: string;
  Scans?: number;
  QrCode?: string;
  Analytics?: Record<string, number>;
  PaymentProviders?: PaymentProvider[];
  Integrations?: string[];
  CreatedAt?: string;
  UpdatedAt?: string;
};

export type InitialFirmState = {
    firm: Firm | null
}
