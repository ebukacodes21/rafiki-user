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

export type ServiceBooking = {
  id?: string;
  firmID: string;
  clientID: string;
  status: string;
  paymentRef: string;
  bookedAt: string;        
  scheduledFor: string;    
  duration: number;
  completedAt?: string;
  cancelledAt?: string;
  notes?: string;
}

export type Diary = {
  userId: string;          
  displayName: string;
  email: string;
  provider: string;        
  accessToken: string;
  refreshToken: string;
  expiry: string;           
  calendarId: string;
  connectedAt: string;     
};

export type Firm = {
  id?: string;
  name?: string;
  adminID: string
  weeklyHours: Record<string, TimeRange[]>; 
  dateOverrides?: DateSpecificHours[];
  category?: string;
  description?: string;
  founded?: string;
  location?: string;
  email?: string;
  phone?: string;
  diaries: Diary[]
  website?: string;
  liveFirm?: string;
  instagram?: string;
  x?: string;
  facebook?: string;
  photos?: string[];
  billboard?: Billboard;
  theme?: string;
  subscriptionPlan?: string;
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
  practiceAreas?: string[];
}

export type InitialFirmState = {
  firm: Firm | null
}