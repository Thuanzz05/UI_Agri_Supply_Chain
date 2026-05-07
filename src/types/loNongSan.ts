// Type cho Lô Nông Sản
export interface LoNongSan {
  maLo: number;
  maTrangTrai: number;
  maSanPham: number;
  soLuongBanDau: number;
  soLuongHienTai: number;
  ngayThuHoach: string;
  hanSuDung: string;
  maQR: string;
  trangThai: string;
  ngayTao: string;
  tenTrangTrai: string;
  tenSanPham: string;
  donViTinh: string;
  // Thêm các field cho kiểm định
  maNongDan?: number;
  tenNongDan?: string;
  soLuong?: number;
  trangThaiKiemDinh?: 'cho_kiem_dinh' | 'dat' | 'khong_dat';
  ketQuaKiemDinh?: string;
}

// Type cho form data khi thêm lô nông sản
export interface DuLieuFormLoNongSan {
  maTrangTrai: number;
  maSanPham: number;
  soLuongBanDau: number;
  ngayThuHoach: string;
  hanSuDung: string;
  maQR: string;
}

// Type cho form data khi sửa lô nông sản
export interface DuLieuCapNhatLoNongSan {
  soLuongHienTai: number;
  ngayThuHoach: string;
  hanSuDung: string;
  maQR: string;
  trangThai?: string; // Optional - để backend tự động xử lý
}
