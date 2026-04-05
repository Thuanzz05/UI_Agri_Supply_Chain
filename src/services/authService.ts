import axios from 'axios';

const API_BASE_URL = 'https://localhost:7009';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginRequest {
  TenDangNhap: string;
  MatKhau: string;
}

export interface User {
  maTaiKhoan: number;
  tenDangNhap: string;
  loaiTaiKhoan: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    maTaiKhoan: number;
    tenDangNhap: string;
    loaiTaiKhoan: string;
    token: string;
  };
}

export const authService = {
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/auth/login', loginData);
      
      if (response.data.success && response.data.data) {
        // Lưu token với key đúng từ API response
        const token = response.data.data.token;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          maTaiKhoan: response.data.data.maTaiKhoan,
          tenDangNhap: response.data.data.tenDangNhap,
          loaiTaiKhoan: response.data.data.loaiTaiKhoan
        }));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Lỗi kết nối đến server');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get('/api/auth/me');
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
};