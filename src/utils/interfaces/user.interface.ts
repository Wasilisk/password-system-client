export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  twoFA: boolean;
  createdAt: string;
  updatedAt: string;
  isPhoneVerified: boolean;
}
