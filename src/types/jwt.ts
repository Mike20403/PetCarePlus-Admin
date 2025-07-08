export interface JwtPayload {
  sub: string;  // Subject (usually user ID)
  exp: number;  // Expiration time
  iat: number;  // Issued at time
  iss?: string; // Issuer
  aud?: string; // Audience
  [key: string]: unknown; // Allow for additional custom claims
}

// Queue item for token refresh
export interface RefreshQueueItem {
  resolve: (value?: string | null | undefined) => void;
  reject: (reason?: unknown) => void;
}

// Profile update request type
export interface ProfileUpdateRequest {
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  [key: string]: string | undefined;
}