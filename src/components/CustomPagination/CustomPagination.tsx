import React from 'react';
import { Pagination } from 'antd';
import './CustomPagination.css';

interface CustomPaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, size?: number) => void;
  showTotal?: (total: number, range: [number, number]) => string;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  showTotal
}) => {
  return (
    <div className="custom-pagination-wrapper">
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        showSizeChanger
        showQuickJumper
        showTotal={showTotal}
        onChange={onChange}
        responsive
        simple={false}
      />
    </div>
  );
};

export default CustomPagination;