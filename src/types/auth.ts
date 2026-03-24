export interface LoginForm {
  tenDangNhap: string;
  matKhau: string;
  loaiTaiKhoan: 'Admin' | 'NongDan' | 'DaiLy' | 'SieuThi';
}

export interface User {
  maTaiKhoan: number;
  tenDangNhap: string;
  loaiTaiKhoan: string;
  trangThai: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}