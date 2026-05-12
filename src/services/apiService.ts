import { apiClient } from './authService';

export const apiService = {
  // Gọi API có token để lấy dữ liệu dashboard
  async getDashboardData() {
    try {
      const response = await apiClient.get('/api/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Gọi API có token để lấy danh sách user
  async getUsers() {
    try {
      const response = await apiClient.get('/api/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Gọi API có token để lấy thông tin profile
  async getProfile() {
    try {
      const response = await apiClient.get('/api/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BƯỚC 1: Tạo function gọi API lấy danh sách sản phẩm qua gateway
  async getFarmerProducts() {
    try {
      // Gọi qua gateway với route đúng: /api-nongdan/san-pham/get-all
      // Gateway sẽ forward đến: https://localhost:44373/api/san-pham/get-all
      const response = await apiClient.get('/api-nongdan/san-pham/get-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // API lấy sản phẩm theo nông dân
  async getProductsByFarmer(maNongDan: number) {
    try {
      const response = await apiClient.get(`/api-nongdan/san-pham/get-by-nong-dan/${maNongDan}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // API lấy sản phẩm theo trang trại
  async getProductsByFarm(maTrangTrai: number) {
    try {
      const response = await apiClient.get(`/api-nongdan/san-pham/get-by-trang-trai/${maTrangTrai}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // API thêm sản phẩm mới
  async addFarmerProduct(productData: any) {
    try {
      const response = await apiClient.post('/api-nongdan/san-pham/create', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // API cập nhật sản phẩm
  async updateFarmerProduct(maSanPham: number, productData: any) {
    try {
      const response = await apiClient.put(`/api-nongdan/san-pham/update/${maSanPham}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // API xóa sản phẩm
  async deleteFarmerProduct(maSanPham: number) {
    try {
      const response = await apiClient.delete(`/api-nongdan/san-pham/delete/${maSanPham}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ API TRANG TRẠI ============
  
  // Lấy tất cả trang trại
  async getAllFarms() {
    try {
      const response = await apiClient.get('/api-nongdan/trang-trai/get-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy trang trại theo nông dân
  async getFarmsByFarmer(maNongDan: string) {
    try {
      const response = await apiClient.get(`/api-nongdan/trang-trai/get-by-nong-dan/${maNongDan}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy trang trại theo ID
  async getFarmById(id: number) {
    try {
      const response = await apiClient.get(`/api-nongdan/trang-trai/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Thêm trang trại mới
  async addFarm(farmData: any) {
    try {
      const response = await apiClient.post('/api-nongdan/trang-trai/create', farmData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật trang trại
  async updateFarm(id: number, farmData: any) {
    try {
      const response = await apiClient.put(`/api-nongdan/trang-trai/update/${id}`, farmData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa trang trại
  async deleteFarm(id: number) {
    try {
      const response = await apiClient.delete(`/api-nongdan/trang-trai/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ API LÔ NÔNG SẢN ============
  
  // Lấy tất cả lô nông sản
  async getAllBatches() {
    try {
      const response = await apiClient.get('/api-nongdan/lo-nong-san/get-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lô nông sản theo nông dân
  async getBatchesByFarmer(maNongDan: string) {
    try {
      const response = await apiClient.get(`/api-nongdan/lo-nong-san/get-by-nong-dan/${maNongDan}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lô nông sản theo trang trại
  async getBatchesByFarm(maTrangTrai: number) {
    try {
      const response = await apiClient.get(`/api-nongdan/lo-nong-san/get-by-trang-trai/${maTrangTrai}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lô nông sản theo ID
  async getBatchById(id: number) {
    try {
      const response = await apiClient.get(`/api-nongdan/lo-nong-san/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Thêm lô nông sản mới
  async addBatch(batchData: any) {
    try {
      const response = await apiClient.post('/api-nongdan/lo-nong-san/create', batchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật lô nông sản
  async updateBatch(id: number, batchData: any) {
    try {
      const response = await apiClient.put(`/api-nongdan/lo-nong-san/update/${id}`, batchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa lô nông sản
  async deleteBatch(id: number) {
    try {
      const response = await apiClient.delete(`/api-nongdan/lo-nong-san/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ API KHO HÀNG ĐẠI LÝ ============
  
  // Lấy tất cả kho hàng
  async getAllWarehouses() {
    try {
      const response = await apiClient.get('/api-daily/kho/get-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy kho hàng theo đại lý
  async getWarehousesByAgent(maDaiLy: string) {
    try {
      const response = await apiClient.get(`/api-daily/kho/get-by-dai-ly/${maDaiLy}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy kho hàng theo ID
  async getWarehouseById(id: number) {
    try {
      const response = await apiClient.get(`/api-daily/kho/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Thêm kho hàng mới
  async addWarehouse(warehouseData: any) {
    try {
      const response = await apiClient.post('/api-daily/kho/create', warehouseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật kho hàng
  async updateWarehouse(id: number, warehouseData: any) {
    try {
      const response = await apiClient.put(`/api-daily/kho/update/${id}`, warehouseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa kho hàng
  async deleteWarehouse(id: number) {
    try {
      const response = await apiClient.delete(`/api-daily/kho/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ API TỒN KHO ĐẠI LÝ ============
  
  // Lấy tất cả tồn kho
  async getAllInventory() {
    try {
      const response = await apiClient.get('/api-daily/ton-kho/get-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tồn kho theo đại lý
  async getInventoryByDaiLy(maDaiLy: number) {
    try {
      const response = await apiClient.get(`/api-daily/ton-kho/get-by-dai-ly/${maDaiLy}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Điều chỉnh số lượng tồn kho
  async adjustInventory(maKho: number, maLo: number, soLuongMoi: number) {
    const routes = Array.from(new Set([
      '/api-daily/ton-kho/update-so-luong',
      '/api/ton-kho/update-so-luong',
      '/ton-kho/update-so-luong',
    ]));

    let lastError: any = null;

    for (const route of routes) {
      try {
        const response = await apiClient.put(route, null, {
          params: {
            maKho,
            maLo,
            soLuongMoi,
          },
        });
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  },

  // Chuyển kho nội bộ (đại lý)
  async transferInventory(payload: {
    maKhoNguon: number;
    maKhoDich: number;
    maLo: number;
    soLuong: number;
    ghiChu?: string;
  }) {
    try {
      const response = await apiClient.post('/api-daily/chuyen-kho/create', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lịch sử chuyển kho theo đại lý
  async getTransferHistoryByAgent(maDaiLy: number) {
    try {
      const response = await apiClient.get(`/api-daily/chuyen-kho/get-by-dai-ly/${maDaiLy}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ API NÔNG DÂN ============
  
  // Lấy tất cả nông dân
  async getAllFarmers() {
    try {
      const response = await apiClient.get('/api-nongdan/nong-dan/get-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy nông dân theo ID
  async getFarmerById(id: number) {
    try {
      const response = await apiClient.get(`/api-nongdan/nong-dan/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin nông dân
  async updateFarmerInfo(id: number, farmerData: any) {
    try {
      const response = await apiClient.put(`/api-nongdan/nong-dan/update/${id}`, farmerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ API ĐẠI LÝ ============
  
  // Lấy đại lý theo ID
  async getAgentById(id: number) {
    try {
      const response = await apiClient.get(`/api-daily/dai-ly/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin đại lý
  async updateAgentInfo(id: number, agentData: any) {
    try {
      const response = await apiClient.put(`/api-daily/dai-ly/update/${id}`, agentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ API SIÊU THỊ ============
  
  // Lấy siêu thị theo ID
  async getSupermarketById(id: number) {
    try {
      const response = await apiClient.get(`/api-sieuthi/sieu-thi/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy hồ sơ đối tác theo loại người dùng để hiển thị thông tin liên hệ công khai
  async getPublicProfile(loaiNguoi: string, id: number) {
    const normalizedType = (loaiNguoi || '').toLowerCase();

    if (['nongdan', 'nong_dan', 'farmer'].includes(normalizedType)) {
      return apiService.getFarmerById(id);
    }

    if (['daily', 'dai_ly', 'agent'].includes(normalizedType)) {
      return apiService.getAgentById(id);
    }

    if (['sieuthi', 'sieu_thi', 'supermarket'].includes(normalizedType)) {
      return apiService.getSupermarketById(id);
    }

    return null;
  },

  // Cập nhật thông tin siêu thị
  async updateSupermarketInfo(id: number, supermarketData: any) {
    try {
      const response = await apiClient.put(`/api-sieuthi/sieu-thi/update/${id}`, supermarketData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê dashboard siêu thị
  async getSupermarketDashboardStats(maSieuThi: number) {
    try {
      const response = await apiClient.get(`/api-sieuthi/dashboard/${maSieuThi}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy đơn hàng của siêu thị (mua từ đại lý)
  async getSupermarketOrders(maSieuThi: number) {
    const routes = [
      `/api-daily/don-hang-sieu-thi/get-by-sieu-thi/${maSieuThi}`,
      `/api/don-hang-sieu-thi/get-by-sieu-thi/${maSieuThi}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Lấy chi tiết đơn hàng siêu thị theo ID
  async getSupermarketOrderById(id: number) {
    const routes = [
      `/api-daily/don-hang-sieu-thi/get-by-id/${id}`,
      `/api/don-hang-sieu-thi/get-by-id/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Xác nhận đơn hàng từ siêu thị (chuyển từ cho_xac_nhan sang dang_van_chuyen)
  async confirmSupermarketOrder(id: number) {
    const routes = [
      `/api-sieuthi/don-hang/xac-nhan/${id}`,
      `/api/don-hang/xac-nhan/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.put(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Hủy đơn hàng từ siêu thị
  async cancelSupermarketOrder(id: number) {
    const routes = [
      `/api-sieuthi/don-hang/huy/${id}`,
      `/api/don-hang/huy/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.put(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Lấy kho hàng của siêu thị
  async getSupermarketWarehouses(maSieuThi: number) {
    const routes = [
      `/api-sieuthi/kho/get-by-sieu-thi/${maSieuThi}`,
      `/api/kho/get-by-sieu-thi/${maSieuThi}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Lấy tồn kho của siêu thị
  async getSupermarketInventory(maSieuThi: number) {
    const routes = [
      `/api-sieuthi/ton-kho/get-by-sieu-thi/${maSieuThi}`,
      `/api/ton-kho/get-by-sieu-thi/${maSieuThi}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // ==================== API Đơn hàng Nông dân ====================
  
  // Lấy đơn hàng theo nông dân
  async getFarmerOrdersByFarmer(maNongDan: number) {
    const routes = [
      `/api-nongdan/don-hang/get-by-nong-dan/${maNongDan}`,
      `/api/don-hang/get-by-nong-dan/${maNongDan}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Lấy chi tiết đơn hàng
  async getFarmerOrderById(id: number) {
    const routes = [
      `/api-nongdan/don-hang/get-by-id/${id}`,
      `/api/don-hang/get-by-id/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Xác nhận/từ chối đơn hàng (nông dân)
  async updateFarmerOrderStatus(id: number, trangThai: string) {
    const routes = [
      `/api-nongdan/don-hang/xac-nhan/${id}`,
      `/api/don-hang/xac-nhan/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.put(route, { trangThai });
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // ==================== API Đơn hàng Đại lý ====================
  
  // Lấy đơn hàng mua từ nông dân (đại lý là người mua)
  async getAgentOrdersFromFarmer(maDaiLy: number) {
    const routes = [
      `/api-daily/don-hang-nong-dan/get-by-dai-ly/${maDaiLy}`,
      `/api/don-hang-nong-dan/get-by-dai-ly/${maDaiLy}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Lấy chi tiết đơn hàng mua từ nông dân
  async getAgentOrderFromFarmerById(id: number) {
    const routes = [
      `/api-daily/don-hang-nong-dan/get-by-id/${id}`,
      `/api/don-hang-nong-dan/get-by-id/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Xác nhận/từ chối đơn hàng mua từ nông dân
  async updateAgentOrderFromFarmerStatus(id: number, trangThai: string) {
    const routes = [
      `/api-daily/don-hang-nong-dan/xac-nhan/${id}`,
      `/api/don-hang-nong-dan/xac-nhan/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.put(route, { trangThai });
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Tạo đơn hàng mua từ nông dân (đại lý tạo)
  async createAgentOrderFromFarmer(orderData: any) {
    const routes = [
      `/api-daily/don-hang-nong-dan/create`,
      `/api/don-hang-nong-dan/create`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.post(route, orderData);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Lấy đơn hàng bán cho siêu thị (đại lý là người bán)
  async getAgentOrdersToSupermarket(maDaiLy: number) {
    const routes = [
      `/api-daily/don-hang-sieu-thi/get-by-dai-ly/${maDaiLy}`,
      `/api/don-hang-sieu-thi/get-by-dai-ly/${maDaiLy}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Lấy chi tiết đơn hàng bán cho siêu thị
  async getAgentOrderToSupermarketById(id: number) {
    const routes = [
      `/api-daily/don-hang-sieu-thi/get-by-id/${id}`,
      `/api/don-hang-sieu-thi/get-by-id/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Tạo đơn hàng bán cho siêu thị
  async createAgentOrderToSupermarket(orderData: any) {
    const routes = [
      `/api-daily/don-hang-sieu-thi/create`,
      `/api/don-hang-sieu-thi/create`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.post(route, orderData);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // ==================== API Kiểm định chất lượng ====================
  
  // Lấy danh sách lô hàng cần kiểm định theo đại lý (chỉ lô trong đơn hàng)
  async getLoHangKiemDinhByDaiLy(maDaiLy: number) {
    const routes = [
      `/api-daily/kiem-dinh/get-lo-hang-by-dai-ly/${maDaiLy}`,
      `/api/kiem-dinh/get-lo-hang-by-dai-ly/${maDaiLy}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Lấy tất cả lô hàng available (để tạo đơn hàng)
  async getAllLoHangAvailable() {
    const routes = [
      `/api-daily/kiem-dinh/get-all-lo-hang-available`,
      `/api/kiem-dinh/get-all-lo-hang-available`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Kiểm định lô hàng
  async kiemDinhLoHang(kiemDinhData: any) {
    const routes = [
      `/api-daily/kiem-dinh/create`,
      `/api/kiem-dinh/create`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.post(route, kiemDinhData);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // ==================== API Vận chuyển ====================
  
  // Lấy tất cả vận chuyển
  async getTransports() {
    const routes = [
      `/api-daily/van-chuyen/get-all`,
      `/api/van-chuyen/get-all`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Lấy vận chuyển theo đại lý
  async getTransportsByAgent(maDaiLy: number) {
    const routes = [
      `/api-daily/van-chuyen/get-by-daily/${maDaiLy}`,
      `/api/van-chuyen/get-by-daily/${maDaiLy}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Tạo vận chuyển mới
  async createTransport(transportData: any) {
    const routes = [
      `/api-daily/van-chuyen/create`,
      `/api/van-chuyen/create`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.post(route, transportData);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Cập nhật trạng thái vận chuyển
  async updateTransportStatus(id: number, updateData: any) {
    const routes = [
      `/api-daily/van-chuyen/update-trang-thai/${id}`,
      `/api/van-chuyen/update-trang-thai/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.put(route, updateData);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // Hoàn thành vận chuyển
  async completeTransport(id: number, maKhoDich: number) {
    const routes = [
      `/api-daily/van-chuyen/hoan-thanh/${id}`,
      `/api/van-chuyen/hoan-thanh/${id}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.put(route, null, {
          params: { maKhoDich },
        });
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // ==================== API Siêu thị ====================

  // Lấy tất cả siêu thị
  async getAllSupermarkets() {
    const routes = [
      `/api-sieuthi/sieu-thi/get-all`,
      `/api/sieu-thi/get-all`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // ==================== API Truy xuất nguồn gốc ====================

  // Truy xuất nguồn gốc sản phẩm (theo mã QR hoặc mã lô)
  async traceProduct(keyword: string) {
    const routes = [
      `/api-sieuthi/truy-xuat/trace/${keyword}`,
      `/api-daily/truy-xuat/trace/${keyword}`,
      `/api/truy-xuat/trace/${keyword}`
    ];
    
    let lastError: any = null;
    for (const route of routes) {
      try {
        const response = await apiClient.get(route);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status !== 404) {
          throw error;
        }
      }
    }
    throw lastError;
  },

  // ==================== API Admin - Quản lý người dùng ====================

  // Lấy tất cả người dùng
  async getAllUsers(params?: { page?: number; limit?: number; loaiNguoiDung?: string }) {
    try {
      const response = await apiClient.get('/api-admin/user', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết nông dân
  async getNongDanDetail(id: number) {
    try {
      const response = await apiClient.get(`/api-admin/user/nongdan/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết đại lý
  async getDaiLyDetail(id: number) {
    try {
      const response = await apiClient.get(`/api-admin/user/daily/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết siêu thị
  async getSieuThiDetail(id: number) {
    try {
      const response = await apiClient.get(`/api-admin/user/sieuthi/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm người dùng
  async searchUsers(keyword: string, loaiNguoiDung?: string) {
    try {
      const params: any = { keyword };
      if (loaiNguoiDung) {
        params.loaiNguoiDung = loaiNguoiDung;
      }
      const response = await apiClient.get('/api-admin/user/search', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== API Quản lý tài khoản ====================

  // Lấy danh sách tài khoản
  async getAllAccounts(params?: { page?: number; limit?: number; loaiTaiKhoan?: string }) {
    try {
      const response = await apiClient.get('/api-admin/TaiKhoan', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Khóa/Mở khóa tài khoản
  async toggleAccountStatus(id: number) {
    try {
      const response = await apiClient.put(`/api-admin/TaiKhoan/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đổi mật khẩu tài khoản
  async changeAccountPassword(id: number, matKhauMoi: string) {
    try {
      const response = await apiClient.put(`/api-admin/TaiKhoan/${id}/change-password`, {
        matKhauMoi
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa tài khoản
  async deleteAccount(id: number) {
    try {
      const response = await apiClient.delete(`/api-admin/TaiKhoan/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== API Dashboard Admin ====================
  
  // Lấy thống kê tổng quan
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/api-admin/Dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== API Dashboard Nông Dân ====================
  
  // Lấy thống kê dashboard nông dân
  async getFarmerDashboardStats(maNongDan: number) {
    try {
      const response = await apiClient.get(`/api-nongdan/Dashboard/stats/${maNongDan}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy đơn hàng gần đây của nông dân
  async getFarmerRecentOrders(maNongDan: number, limit: number = 5) {
    try {
      const response = await apiClient.get(`/api-nongdan/Dashboard/recent-orders/${maNongDan}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê đơn hàng của nông dân
  async getFarmerOrderStats(maNongDan: number) {
    try {
      const response = await apiClient.get(`/api-nongdan/Dashboard/order-stats/${maNongDan}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tồn kho theo kho
  async getTonKhoByKho(maKho: number) {
    try {
      const response = await apiClient.get(`/api-daily/ton-kho/get-by-kho/${maKho}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê kiểm định theo đại lý
  async getKiemDinhStats(maDaiLy: number) {
    try {
      const response = await apiClient.get(`/api-daily/kiem-dinh/stats/${maDaiLy}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê vận chuyển theo đại lý
  async getTransportStats(maDaiLy: number) {
    try {
      const response = await apiClient.get(`/api-daily/van-chuyen/stats/${maDaiLy}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== API Dashboard Đại Lý ====================
  
  // Lấy thống kê dashboard đại lý
  async getAgentDashboardStats(maDaiLy: number) {
    try {
      const response = await apiClient.get(`/api-daily/Dashboard/stats/${maDaiLy}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy đơn hàng gần đây của đại lý
  async getAgentRecentOrders(maDaiLy: number, limit: number = 5) {
    try {
      const response = await apiClient.get(`/api-daily/Dashboard/recent-orders/${maDaiLy}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê đơn hàng của đại lý
  async getAgentOrderStats(maDaiLy: number) {
    try {
      const response = await apiClient.get(`/api-daily/Dashboard/order-stats/${maDaiLy}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============ API CHAT/TIN NHẮN ============
  
  // Lấy danh sách cuộc trò chuyện
  async getConversations(maNguoi: number, loaiNguoi: string) {
    try {
      const response = await apiClient.get('/api-admin/chat/conversations', {
        params: { maNguoi, loaiNguoi }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tin nhắn trong cuộc trò chuyện
  async getMessages(maCuocTroChuyen: number) {
    try {
      const response = await apiClient.get(`/api-admin/chat/conversations/${maCuocTroChuyen}/messages`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Gửi tin nhắn
  async sendMessage(maNguoiGui: number, loaiNguoiGui: string, data: {
    maCuocTroChuyen?: number;
    maNguoiNhan: number;
    loaiNguoiNhan: string;
    noiDung: string;
  }) {
    try {
      const response = await apiClient.post('/api-admin/chat/messages', data, {
        params: { maNguoiGui, loaiNguoiGui }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu đã đọc
  async markMessagesAsRead(maNguoi: number, loaiNguoi: string, maCuocTroChuyen: number) {
    try {
      const response = await apiClient.put('/api-admin/chat/messages/read', 
        { maCuocTroChuyen },
        { params: { maNguoi, loaiNguoi } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đếm tin nhắn chưa đọc
  async getUnreadCount(maNguoi: number, loaiNguoi: string) {
    try {
      const response = await apiClient.get('/api-admin/chat/unread-count', {
        params: { maNguoi, loaiNguoi }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách người dùng có thể nhắn tin
  async getAvailableUsers(loaiNguoi: string) {
    try {
      const response = await apiClient.get('/api-admin/chat/users', {
        params: { loaiNguoi }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa cuộc trò chuyện
  async deleteConversation(maCuocTroChuyen: number) {
    try {
      const response = await apiClient.delete(`/api-admin/chat/conversations/${maCuocTroChuyen}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

