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
  }
};