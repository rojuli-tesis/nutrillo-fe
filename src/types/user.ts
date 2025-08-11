export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  points?: number;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
} 