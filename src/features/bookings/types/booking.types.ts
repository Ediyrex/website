export interface BookingPrefill {
  name?: string;
  email?: string;
  notes?: string;
  guests?: string[];
}

export interface BookingModalOptions {
  calLink?: string;
  prefill?: BookingPrefill;
  title?: string;
  description?: string;
}

export interface BookingModalState {
  isOpen: boolean;
  calLink: string;
  prefill?: BookingPrefill;
  title?: string;
  description?: string;
}

export interface BookingContextValue {
  isOpen: boolean;
  calLink: string;
  prefill?: BookingPrefill;
  title?: string;
  description?: string;
  openBookingModal: (options?: BookingModalOptions) => void;
  closeBookingModal: () => void;
}
