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

export type WeeklyHour = {
  day: string;
  open: string;
  close: string;
  active: boolean;
}

export type Availability = {
  timeZone: string;
  weeklyHours: Record<string, TimeRange[]>; 
}

export type Billboard = {
  title: string;
  image: string;
}

type ProviderDetails = {
	// Paystack
	subaccountCode:   string  
	settlementBank:   string 
	percentageCharge: number 

	// Stripe
	accountId:    string 
	accessToken:  string 
	refreshToken: string 
	stripeUserId: string 
}

type PaymentProvider = {
	name:        string        
	status:      string         
	connectAt:  Date       
	details:     ProviderDetails
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
  adminID?: string;
  adminIds?: string[];
  name?: string;
  availability: Availability; 
  dateOverrides?: DateSpecificHours[];
  serviceBookings?: ServiceBooking[];
  category?: string;
  description?: string;
  founded?: string;
  location?: string;
  email?: string;
  phone?: string;
  diaries: Diary[]
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
  consultationFee: {
    amount: number;
    enabled: boolean;
    unit: string;
    currency: string;
  }
}

export type InitialFirmState = {
  firm: Firm | null
}