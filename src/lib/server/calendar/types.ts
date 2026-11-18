export interface GoogleOAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token?: string;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface GoogleCalendarEntry {
  id: string;
  summary: string;
  description?: string;
  timeZone?: string;
  primary?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
  colorId?: string;
  accessRole?: string;
  selected?: boolean;
}

export interface GoogleCalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  status?: string;
  htmlLink?: string;
  hangoutLink?: string;
  creator?: {
    email?: string;
    displayName?: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: string;
  }[];
  recurrence?: string[];
}
