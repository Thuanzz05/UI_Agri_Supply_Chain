export interface ChuyenKhoCreatePayload {
  maKhoNguon: number;
  maKhoDich: number;
  maLo: number;
  soLuong: number;
  ghiChu?: string;
}

export interface PhieuChuyenKho {
  maPhieu: number;
  maKhoNguon: number;
  maKhoDich: number;
  maLo: number;
  soLuong: number;
  ngayChuyen: string;
  ghiChu?: string;
  tenKhoNguon?: string;
  tenKhoDich?: string;
  tenSanPham?: string;
  donViTinh?: string;
  maQR?: string;
}

