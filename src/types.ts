export interface Voucher {
  id: string;
  filename: string;
  title?: string;
  ocrText: string;
  image_url: string;
  uploaded_at: string;
}


export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}