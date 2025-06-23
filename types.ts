export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string
  isVerified: boolean;
  createdAt: string; 
};

export type InitialUserState = {
  isLoading: boolean;
  isError: boolean;
  user: User | null;
};

export type TimeRange = {
  open: string;
  close: string;
}

export type DateSpecificHours = {
  date: string; 
  timeRanges: TimeRange[];
  isClosed: boolean;
}

export type Billboard = {
  title: string;
  image: string;
}

export type PaymentProvider = {
  name: string;
  status: string; // e.g., "connected", "disconnected"
}

export type ServiceType = {
  id?: string;
  name: string;
  description?: string;
  durationMins: number;
  locationType: string;
  isActive: boolean;
}

export type ServiceBooking = {
  id?: string;
  firmID: string;
  clientID: string;
  serviceType: ServiceType;
  status: string;
  paymentRef: string;
  bookedAt: string;        
  scheduledFor: string;    
  duration: number;
  completedAt?: string;
  cancelledAt?: string;
  notes?: string;
}

export type Firm = {
  id?: string;
  adminID?: string;
  adminIds?: string[];
  name?: string;
  weeklyHours: Record<string, TimeRange[]>; 
  dateOverrides?: DateSpecificHours[];
  serviceTypes?: ServiceType[];
  serviceBookings?: ServiceBooking[];
  category?: string;
  description?: string;
  founded?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  liveFirm?: string;
  serviceUrl?: string;
  instagram?: string;
  x?: string;
  facebook?: string;
  photos?: string[];
  billboard?: Billboard;
  theme?: string;
  subscriptionPlan?: string;
  scans?: number;
  qrCode?: string;
  analytics?: Record<string, number>;
  paymentProviders?: PaymentProvider[];
  integrations?: string[];
  createdAt?: string;
  updatedAt?: string;
  practiceAreas?: string[];
}

export type InitialFirmState = {
  firm: Firm | null
}
