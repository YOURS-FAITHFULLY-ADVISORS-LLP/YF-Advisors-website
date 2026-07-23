export interface AdminJWTPayload {
  id: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export interface AdminUser {
  id: string;
  role: 'admin';
}
