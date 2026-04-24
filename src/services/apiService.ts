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
};
