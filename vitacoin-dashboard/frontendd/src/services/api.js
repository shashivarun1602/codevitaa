const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getAuthHeaders() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User endpoints
  async getUserData(userId) {
    return this.request(`/user/${userId}`);
  }

  async claimDailyBonus(userId) {
    return this.request(`/user/${userId}/claim-bonus`, {
      method: 'POST',
    });
  }

  async getUserTransactions(userId, page = 1, limit = 20) {
    return this.request(`/user/${userId}/transactions?page=${page}&limit=${limit}`);
  }

  // Transaction endpoints
  async recordTransaction(userId, transactionData) {
    return this.request(`/user/${userId}/transaction`, {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async earnCoins(userId, amount, description, category = 'earn') {
    return this.request(`/user/${userId}/earn`, {
      method: 'POST',
      body: JSON.stringify({ amount, description, category }),
    });
  }

  async spendCoins(userId, amount, description, category = 'spend') {
    return this.request(`/user/${userId}/spend`, {
      method: 'POST',
      body: JSON.stringify({ amount, description, category }),
    });
  }

  // Leaderboard endpoint
  async getLeaderboard() {
    return this.request('/leaderboard');
  }

  async updateLeaderboard() {
    return this.request('/leaderboard/refresh', {
      method: 'POST',
    });
  }

  // Demo user creation (for testing)
  async createDemoUser() {
    return this.request('/create-demo-user', {
      method: 'POST',
    });
  }

  // Authentication endpoints
  async register(username, email, password) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  isAuthenticated() {
    return !!this.token;
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
