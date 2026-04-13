// Type cho Lô Nông Sản
export interface Batch {
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
}

// Type cho form data khi thêm/sửa lô nông sản
export interface BatchFormData {
  maTrangTrai: number;
  maSanPham: number;
  soLuongBanDau: number;
  ngayThuHoach: string;
  hanSuDung: string;
}
