import React, { useState } from 'react';
import {
  Card,
  Col,
  Descriptions,
  Input,
  Row,
  Tag,
  Timeline,
  Typography,
  message,
  Spin,
  Empty,
  Divider,
  Badge,
} from 'antd';
import {
  SearchOutlined,
  QrcodeOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  SafetyOutlined,
  ShopOutlined,
  TruckOutlined,
  UserOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '../../components/Layout';
import { apiService } from '../../services/apiService';
import SocialLinks from '../../components/SocialLinks';
import dayjs from 'dayjs';
import './TruyXuatNguonGoc.css';

const { Title, Text, Paragraph } = Typography;

interface TraceabilityData {
  // Thông tin lô hàng
  maLo: number;
  maQR: string;
  tenSanPham: string;
  donViTinh: string;
  soLuongBanDau: number;
  soLuongHienTai: number;
  ngayThuHoach: string;
  hanSuDung: string;
  trangThai: string;
  ngayTao: string;
  // Thông tin trang trại
  tenTrangTrai: string;
  diaChiTrangTrai: string;
  soChungNhan: string;
  // Thông tin nông dân
  tenNongDan: string;
  soDienThoaiNongDan: string;
  diaChiNongDan: string;
  facebookNongDan?: string;
  tiktokNongDan?: string;
  // Kiểm định
  kiemDinh?: {
    maKiemDinh: number;
    nguoiKiemDinh: string;
    ngayKiemDinh: string;
    ketQua: string;
    bienBanKiemTra: string;
    chuKySo: string;
  };
  // Vận chuyển
  vanChuyen?: {
    maVanChuyen: number;
    diemDi: string;
    diemDen: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    trangThai: string;
  }[];
}

const getApiErrorMessage = (error: any, fallbackMessage: string) => {
  const responseData = error?.response?.data;
  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }
  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message;
  }
  if (typeof responseData?.title === 'string' && responseData.title.trim()) {
    return responseData.title;
  }
  return fallbackMessage;
};

const formatDate = (value: string) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return dayjs(value).format('DD/MM/YYYY');
};

const TruyXuatNguonGoc: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [traceData, setTraceData] = useState<TraceabilityData | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const keyword = searchValue.trim();
    if (!keyword) {
      message.warning('Vui lòng nhập mã QR sản phẩm');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await apiService.traceProduct(keyword);
      const data = response?.data || response;
      if (data) {
        setTraceData(data);
      } else {
        setTraceData(null);
        message.info('Không tìm thấy thông tin sản phẩm');
      }
    } catch (error: any) {
      setTraceData(null);
      const msg = getApiErrorMessage(error, 'Không tìm thấy sản phẩm với mã đã nhập');
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getKiemDinhStatus = (ketQua?: string) => {
    if (!ketQua) return { color: 'default' as const, text: 'Chưa kiểm định' };
    if (ketQua === 'dat') return { color: 'success' as const, text: 'Đạt chuẩn' };
    return { color: 'error' as const, text: 'Không đạt' };
  };

  const getTrangThaiText = (trangThai: string) => {
    const map: Record<string, string> = {
      'san_sang': 'Sẵn sàng',
      'da_ban': 'Đã bán',
      'het_han': 'Hết hạn',
      'dang_van_chuyen': 'Đang vận chuyển',
    };
    return map[trangThai] || trangThai;
  };

  const getTrangThaiColor = (trangThai: string) => {
    const map: Record<string, string> = {
      'san_sang': 'green',
      'da_ban': 'blue',
      'het_han': 'red',
      'dang_van_chuyen': 'cyan',
    };
    return map[trangThai] || 'default';
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Truy xuất nguồn gốc</h1>
        <p>Tra cứu thông tin chi tiết sản phẩm/lô nông sản bằng mã QR</p>
      </div>

      {/* Ô tìm kiếm */}
      <Card className="truy-xuat-search-card">
        <div className="truy-xuat-search-container">
          <QrcodeOutlined className="truy-xuat-qr-icon" />
          <Title level={3} className="truy-xuat-title">
            Nhập mã QR sản phẩm
          </Title>
          <div className="truy-xuat-search-wrapper">
            <Input.Search
              placeholder="Ví dụ: QR001"
              size="large"
              enterButton={
                <span>
                  <SearchOutlined /> Tra cứu
                </span>
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              loading={loading}
              style={{ width: '100%' }}
            />
          </div>
          <Text className="truy-xuat-hint-text">
            Nhập mã QR trên sản phẩm để tra cứu thông tin nguồn gốc, kiểm định và vận chuyển
          </Text>
        </div>
      </Card>

      {/* Kết quả */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="Đang tra cứu..." />
        </div>
      )}

      {!loading && searched && !traceData && (
        <Card>
          <Empty
            description="Không tìm thấy thông tin sản phẩm với mã đã nhập"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}

      {!loading && traceData && (
        <>
          {/* Thông tin lô nông sản - full width */}
          <Card
            title={
              <span>
                <ShopOutlined style={{ marginRight: 8 }} />
                Thông tin lô nông sản
              </span>
            }
            style={{ marginBottom: 16 }}
          >
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label="Mã lô">
                <Tag color="blue">#{traceData.maLo}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mã QR">
                <Tag color="green">{traceData.maQR}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Sản phẩm" span={2}>
                <strong style={{ fontSize: 16 }}>{traceData.tenSanPham}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng ban đầu">
                {traceData.soLuongBanDau} {traceData.donViTinh}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng hiện tại">
                <strong>{traceData.soLuongHienTai} {traceData.donViTinh}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày thu hoạch">
                <CalendarOutlined style={{ marginRight: 4 }} />
                {formatDate(traceData.ngayThuHoach)}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn sử dụng">
                <CalendarOutlined style={{ marginRight: 4 }} />
                {(() => {
                  const hsd = dayjs(traceData.hanSuDung);
                  const today = dayjs();
                  const daysLeft = hsd.diff(today, 'day');
                  
                  // Nếu đã bán HẾT (số lượng = 0), hiển thị bình thường
                  if (traceData.trangThai === 'da_ban' && traceData.soLuongHienTai === 0) {
                    return <span style={{ color: '#8c8c8c' }}>{formatDate(traceData.hanSuDung)}</span>;
                  }
                  
                  // Nếu hết hạn
                  if (daysLeft < 0) {
                    return (
                      <span style={{ color: '#ff4d4f', fontWeight: 500 }}>
                        {formatDate(traceData.hanSuDung)} 
                        <Tag color="red" style={{ marginLeft: 8 }}>
                          Quá hạn {Math.abs(daysLeft)} ngày
                        </Tag>
                      </span>
                    );
                  }
                  
                  // Nếu sắp hết hạn (≤ 7 ngày)
                  if (daysLeft <= 7) {
                    return (
                      <span style={{ color: '#faad14', fontWeight: 500 }}>
                        {formatDate(traceData.hanSuDung)}
                        <Tag color="orange" style={{ marginLeft: 8 }}>
                          Còn {daysLeft} ngày
                        </Tag>
                      </span>
                    );
                  }
                  
                  // Còn hạn bình thường
                  return formatDate(traceData.hanSuDung);
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={getTrangThaiColor(traceData.trangThai)}>
                  {getTrangThaiText(traceData.trangThai)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Nguồn gốc sản xuất & Kiểm định - cùng hàng */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Nguồn gốc sản xuất
                  </span>
                }
                style={{ height: '100%' }}
              >
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">Nông dân</Text>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{traceData.tenNongDan || '--'}</div>
                  {traceData.soDienThoaiNongDan && (
                    <Text type="secondary">SĐT: {traceData.soDienThoaiNongDan}</Text>
                  )}
                  {traceData.diaChiNongDan && (
                    <div>
                      <EnvironmentOutlined style={{ marginRight: 4 }} />
                      <Text type="secondary">{traceData.diaChiNongDan}</Text>
                    </div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <SocialLinks data={traceData} showEmpty />
                  </div>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                  <Text type="secondary">Trang trại</Text>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    <HomeOutlined style={{ marginRight: 4 }} />
                    {traceData.tenTrangTrai || '--'}
                  </div>
                  {traceData.diaChiTrangTrai && (
                    <div>
                      <EnvironmentOutlined style={{ marginRight: 4 }} />
                      <Text type="secondary">{traceData.diaChiTrangTrai}</Text>
                    </div>
                  )}
                  {traceData.soChungNhan && (
                    <div style={{ marginTop: 4 }}>
                      <Badge status="success" />
                      <Text type="secondary"> Chứng nhận: {traceData.soChungNhan}</Text>
                    </div>
                  )}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <SafetyOutlined style={{ marginRight: 8 }} />
                    Kiểm định chất lượng
                  </span>
                }
                style={{ height: '100%' }}
              >
                {traceData.kiemDinh ? (
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <Tag
                        color={getKiemDinhStatus(traceData.kiemDinh.ketQua).color}
                        style={{ fontSize: 14, padding: '4px 12px' }}
                      >
                        {traceData.kiemDinh.ketQua === 'dat' && <CheckCircleOutlined style={{ marginRight: 4 }} />}
                        {getKiemDinhStatus(traceData.kiemDinh.ketQua).text}
                      </Tag>
                    </div>
                    <Paragraph>
                      <Text strong>Người kiểm định: </Text>
                      {traceData.kiemDinh.nguoiKiemDinh}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Ngày kiểm định: </Text>
                      {formatDate(traceData.kiemDinh.ngayKiemDinh)}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Biên bản: </Text>
                      {traceData.kiemDinh.bienBanKiemTra}
                    </Paragraph>
                    {traceData.kiemDinh.chuKySo && (
                      <Paragraph>
                        <Text strong>Chữ ký số: </Text>
                        <Tag>{traceData.kiemDinh.chuKySo}</Tag>
                      </Paragraph>
                    )}
                  </div>
                ) : (
                  <Empty
                    description="Chưa có thông tin kiểm định"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* Lịch sử vận chuyển - full width */}
          <Card
            title={
              <span>
                <TruckOutlined style={{ marginRight: 8 }} />
                Lịch sử vận chuyển
              </span>
            }
          >
            {traceData.vanChuyen && traceData.vanChuyen.length > 0 ? (
              <Timeline
                mode="left"
                items={traceData.vanChuyen.map((vc) => ({
                  color: vc.trangThai === 'hoan_thanh' ? 'green' : 'blue',
                  label: formatDate(vc.ngayBatDau),
                  children: (
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        Mã VC: #{vc.maVanChuyen}
                      </div>
                      <div>
                        <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                        {vc.diemDi}
                        <span style={{ margin: '0 8px', color: '#999' }}>→</span>
                        <EnvironmentOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                        {vc.diemDen}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <Tag color={vc.trangThai === 'hoan_thanh' ? 'green' : 'blue'}>
                          {vc.trangThai === 'hoan_thanh' ? 'Hoàn thành' : 'Đang vận chuyển'}
                        </Tag>
                        {vc.ngayKetThuc && (
                          <Text type="secondary" style={{ marginLeft: 8 }}>
                            Hoàn thành: {formatDate(vc.ngayKetThuc)}
                          </Text>
                        )}
                      </div>
                    </div>
                  ),
                }))}
              />
            ) : (
              <Empty
                description="Chưa có thông tin vận chuyển"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </>
      )}
    </AdminLayout>
  );
};

export default TruyXuatNguonGoc;
