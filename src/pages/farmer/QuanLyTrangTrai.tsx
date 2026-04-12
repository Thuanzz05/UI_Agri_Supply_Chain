import React from 'react';
import { Card, Table, message } from 'antd';
import type { TableProps } from 'antd';
import { AdminLayout } from '../../components/Layout';
import { CustomPagination } from '../../components/CustomPagination';
import { apiService } from '../../services/apiService';

// BƯỚC 1: Định nghĩa kiểu dữ liệu cho bảng
interface DataType {
  key: string;
  maTrangTrai: number;
  maNongDan: number;
  tenTrangTrai: string;
  diaChi: string;
  soChungNhan: string;
  tenNongDan: string;
}

const QuanLyTrangTrai: React.FC = () => {
  // BƯỚC 2: Tạo các state cần thiết
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState(false);

  // BƯỚC 3: Tạo function gọi API lấy danh sách trang trại
  const fetchFarms = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllFarms();
      
      if (response && response.data) {
        const farms = Array.isArray(response.data) ? response.data : [];
        
        // Map dữ liệu từ API sang format của bảng
        const mappedData: DataType[] = farms.map((farm: any) => ({
          key: farm.maTrangTrai?.toString(),
          maTrangTrai: farm.maTrangTrai,
          maNongDan: farm.maNongDan,
          tenTrangTrai: farm.tenTrangTrai,
          diaChi: farm.diaChi,
          soChungNhan: farm.soChungNhan,
          tenNongDan: farm.tenNongDan
        }));
        
        setData(mappedData);
      } else {
        setData([]);
      }
    } catch (error: any) {
      message.error('Không thể tải danh sách trang trại');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 4: Gọi API khi component được mount
  React.useEffect(() => {
    fetchFarms();
  }, []);

  // BƯỚC 5: Xử lý phân trang
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // BƯỚC 6: Định nghĩa các cột của bảng
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Mã TT',
      dataIndex: 'maTrangTrai',
      key: 'maTrangTrai',
      width: 80,
    },
    {
      title: 'Tên trang trại',
      dataIndex: 'tenTrangTrai',
      key: 'tenTrangTrai',
      width: 200,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      width: 250,
    },
    {
      title: 'Số chứng nhận',
      dataIndex: 'soChungNhan',
      key: 'soChungNhan',
      width: 150,
    },
    {
      title: 'Nông dân',
      dataIndex: 'tenNongDan',
      key: 'tenNongDan',
      width: 150,
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Quản lý trang trại</h1>
        <p>Quản lý thông tin các trang trại</p>
      </div>
      
      <Card>
        <Table<DataType>
          columns={columns} 
          dataSource={paginatedData}
          pagination={false}
          scroll={{ x: 800 }}
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
            `${range[0]}-${range[1]} của ${total} trang trại`
          }
        />
      </Card>
    </AdminLayout>
  );
};

export default QuanLyTrangTrai;
