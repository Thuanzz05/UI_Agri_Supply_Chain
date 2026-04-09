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
  }
};