import React from 'react';
import { Card, Table, message, Tag } from 'antd';
import type { TableProps } from 'antd';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';
import dayjs from 'dayjs';

// Định nghĩa kiểu dữ liệu cho bảng
interface DataType {
  key: string;
  maLo: number;
  maTrangTrai: number;
  maSanPham: number;
  soLuongBanDau: number;
  soLuongHienTai: number;
  ngayThuHoach: string;
  hanSuDung: string;
  maQR: string;
  trangThai: string;
  tenTrangTrai: string;
  tenSanPham: string;
  donViTinh: string;
}

const QuanLyLoNongSan: React.FC = () => {
  // State quản lý phân trang
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Function gọi API lấy danh sách lô nông sản
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllBatches();
      
      if (response && response.data) {
        const batches = Array.isArray(response.data) ? response.data : [];
        
        const mappedData: DataType[] = batches.map((batch: any) => ({
          key: batch.maLo?.toString(),
          maLo: batch.maLo,
          maTrangTrai: batch.maTrangTrai,
          maSanPham: batch.maSanPham,
          soLuongBanDau: batch.soLuongBanDau,
          soLuongHienTai: batch.soLuongHienTai,
          ngayThuHoach: batch.ngayThuHoach,
          hanSuDung: batch.hanSuDung,
          maQR: batch.maQR,
          trangThai: batch.trangThai,
          tenTrangTrai: batch.tenTrangTrai,
          tenSanPham: batch.tenSanPham,
          donViTinh: batch.donViTinh
        }));
        
        setData(mappedData);
      } else {
        setData([]);
      }
    } catch (error: any) {
      message.error('Không thể tải danh sách lô nông sản');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  React.useEffect(() => {
    fetchBatches();
  }, []);

  // Tính toán dữ liệu phân trang
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Hàm hiển thị trạng thái
  const renderStatus = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      'san_sang': { color: 'green', text: 'Sẵn sàng' },
      'dang_van_chuyen': { color: 'blue', text: 'Đang vận chuyển' },
      'da_ban': { color: 'default', text: 'Đã bán' },
      'het_han': { color: 'red', text: 'Hết hạn' }
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // Định nghĩa các cột của bảng
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Mã lô',
      dataIndex: 'maLo',
      key: 'maLo',
      width: 80,
    },
    {
      title: 'Mã QR',
      dataIndex: 'maQR',
      key: 'maQR',
      width: 100,
    },
    {
      title: 'Trang trại',
      dataIndex: 'tenTrangTrai',
      key: 'tenTrangTrai',
      width: 150,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
      width: 150,
    },
    {
      title: 'SL ban đầu',
      dataIndex: 'soLuongBanDau',
      key: 'soLuongBanDau',
      width: 120,
      render: (value: number, record) => `${value} ${record.donViTinh}`,
    },
    {
      title: 'SL hiện tại',
      dataIndex: 'soLuongHienTai',
      key: 'soLuongHienTai',
      width: 120,
      render: (value: number, record) => `${value} ${record.donViTinh}`,
    },
    {
      title: 'Ngày thu hoạch',
      dataIndex: 'ngayThuHoach',
      key: 'ngayThuHoach',
      width: 130,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'hanSuDung',
      key: 'hanSuDung',
      width: 130,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: renderStatus,
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý lô nông sản</h1>
        <p>Quản lý các lô nông sản từ trang trại</p>
      </div>
      
      <Card>
        <Table<DataType>
          columns={columns} 
          dataSource={paginatedData}
          pagination={false}
          scroll={{ x: 1200 }}
          loading={loading}
        />
        
        <CustomPagination
          current={currentPage}
          total={data.length}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          }}
          showTotal={(total, range) => 
            `${range[0]}-${range[1]} của ${total} lô nông sản`
          }
        />
      </Card>
    </AdminLayout>
  );
};

export default QuanLyLoNongSan;
