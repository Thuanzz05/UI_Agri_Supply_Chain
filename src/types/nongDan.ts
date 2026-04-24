// Type cho Nông Dân
export interface NongDan {
  maNongDan: number;
  maTaiKhoan: number;
  hoTen?: string;
  tenNongDan?: string; // Alias cho hoTen
  soDienThoai?: string;
  diaChi?: string;
  tenDangNhap?: string;
  email?: string;
  ngayTao?: string;
}

// Type cho form data khi thêm nông dân
export interface DuLieuFormNongDan {
  maTaiKhoan: number;
  hoTen: string;
  soDienThoai?: string;
  diaChi?: string;
}

// Type cho form data khi cập nhật nông dân
export interface DuLieuCapNhatNongDan {
  hoTen?: string;
  soDienThoai?: string;
  diaChi?: string;
}
