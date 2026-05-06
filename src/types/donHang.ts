// Types cho đơn hàng
export interface ChiTietDonHang {
  maDonHang: number;
  maLo: number;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  tenSanPham?: string;
  donViTinh?: string;
  maQR?: string;
  ngayThuHoach?: string;
  hanSuDung?: string;
}

export interface DonHang {
  maDonHang: number;
  loaiDon: string; // 'nongdan_to_daily', 'daily_to_sieuthi'
  maNguoiBan: number;
  loaiNguoiBan: string; // 'nongdan', 'daily'
  maNguoiMua: number;
  loaiNguoiMua: string; // 'daily', 'sieuthi'
  ngayDat: string;
  trangThai: string; // 'cho_xac_nhan', 'cho_kiem_dinh', 'dang_van_chuyen', 'hoan_thanh', 'tra_hang', 'da_huy'
  tongGiaTri: number;
  tenNguoiBan?: string;
  tenNguoiMua?: string;
  chiTietDonHang?: ChiTietDonHang[];
}

export interface DuLieuCapNhatTrangThaiDonHang {
  trangThai: string;
}
