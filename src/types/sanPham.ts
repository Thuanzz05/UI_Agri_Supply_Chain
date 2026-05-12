export interface SanPham {
  maSanPham: number;
  tenSanPham: string;
  donViTinh: string;
  moTa: string;
  hinhAnh?: string;
  maTrangTrai: number;
}

export interface DuLieuFormSanPham {
  tenSanPham: string;
  donViTinh: string;
  moTa: string;
  hinhAnh?: string;
  maTrangTrai: number;
}
