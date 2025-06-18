export type BusinessHours = {
  [day: string]: { open: string; close: string }; 
};

export type Billboard = {
  title: string;
  image: string;
};

export type PaymentProvider = {
  name: string;
  accountId: string;
};

export type Firm = {
  _id: string;
  name?: string;
  category?: string;
  description?: string;
  founded?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  x?: string;
  facebook?: string;
  businessHours?: BusinessHours;
  photos?: string[];
  billboard?: Billboard;
  theme?: string;
  isOnboarded?: boolean;
  liveFirm: string;
  subscriptionPlan?: string;
  scans?: number;
  qrCode?: string;
  analytics?: Record<string, number>;
  paymentProviders?: PaymentProvider[];
  integrations?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type InitialFirmState = {
    firm: Firm | null
}
