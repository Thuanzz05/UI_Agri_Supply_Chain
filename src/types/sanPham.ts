export interface SanPham {
  maSanPham: number;
  tenSanPham: string;
  donViTinh: string;
  moTa: string;
  hinhAnh?: string;
}

export interface DuLieuFormSanPham {
  tenSanPham: string;
  donViTinh: string;
  moTa: string;
  hinhAnh?: string;
}
