// Type cho Trang Trại
export interface TrangTrai {
  maTrangTrai: number;
  maNongDan: number;
  tenTrangTrai: string;
  diaChi: string;
  soChungNhan: string;
  tenNongDan: string;
  hinhAnh?: string;
}

// Type cho form data khi thêm/sửa trang trại
export interface DuLieuFormTrangTrai {
  tenTrangTrai: string;
  diaChi: string;
  soChungNhan: string;
  hinhAnh?: string;
}
