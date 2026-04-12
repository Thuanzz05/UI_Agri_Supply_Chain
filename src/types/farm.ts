// Type cho Trang Trại
export interface Farm {
  maTrangTrai: number;
  maNongDan: number;
  tenTrangTrai: string;
  diaChi: string;
  soChungNhan: string;
  tenNongDan: string;
}

// Type cho form data khi thêm/sửa trang trại
export interface FarmFormData {
  tenTrangTrai: string;
  diaChi: string;
  soChungNhan: string;
}
