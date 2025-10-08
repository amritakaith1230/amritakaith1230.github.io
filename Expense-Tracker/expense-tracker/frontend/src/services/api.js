import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data)
    return Promise.reject(error)
  },
)

export const transactionAPI = {
  // Get all transactions
  getAll: (params = {}) => api.get("/transactions", { params }),

  // Create new transaction
  create: (data) => api.post("/transactions", data),

  // Update transaction
  update: (id, data) => api.put(`/transactions/${id}`, data),

  // Delete transaction
  delete: (id) => api.delete(`/transactions/${id}`),

  // Get summary
  getSummary: (params = {}) => api.get("/transactions/summary", { params }),
}

export default api
