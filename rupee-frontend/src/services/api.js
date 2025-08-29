import axios from 'axios'
import { toast } from 'react-fox-toast'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    
    if (response) {
      // Handle specific HTTP errors
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          localStorage.removeItem('token')
          window.location.href = '/login'
          toast.error('Session expired. Please log in again.')
          break
        case 403:
          toast.error('You do not have permission to perform this action.')
          break
        case 404:
          toast.error('The requested resource was not found.')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(response.data?.message || 'An unexpected error occurred.')
      }
    } else {
      // Network error
      toast.error('Network error. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

export const login = async (credentials) => {
  const response = await api.post('/v1/login', credentials)
  return response.data
}

export const getProtectedData = async () => {
  const response = await api.get('/v1/protected')
  return response.data
}

export const createUser = async (userData) => {
  const response = await api.post('/v1/users', userData)
  return response.data
}

export const updateUser = async (id, userData) => {
  const response = await api.put(`/v1/users/${id}`, userData)
  return response.data
}

export const getUsers = async (page = 1, limit = 25, roleId = 0) => {
  const response = await api.get(`/v1/users?page=${page}&limit=${limit}&role_id=${roleId}`)
  console.log(response)
  return response.data?.data?.users
}

export const resetPassword = async (passwordData) => {
  const response = await api.post('/v1/reset-password', passwordData)
  return response.data
}

export const getRoles = async () => {
  const response = await api.get('/v1/roles')
  return response.data?.data
}

export const deleteuser=async (id)=>{
 const response=await api.delete(`v1/users/${id}`)
 return response?.data
}

export const createTicket = async (ticketData) => {
  const formData = new FormData()
  
  // Add text fields
  Object.keys(ticketData).forEach(key => {
    if (key !== 'attachments') {
      formData.append(key, ticketData[key])
    }
  })
  
  // Add attachments
  if (ticketData.attachments) {
    Array.from(ticketData.attachments).forEach(file => {
      formData.append('attachments', file)
    })
  }
  
  const response = await api.post('/v2/tickets', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const getTickets = async (startDate, endDate, page = 1, limit = 25, status, filter, userid, roleid) => {
  let url = `/v2/tickets?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;

  // Add user filter based on filter flag
  if (filter == 0 && userid && roleid !== undefined) {
    url += `&user_id=${userid}&role_id=${roleid}`;
  }

  // Add status filter if provided
  if (status) {
    url += `&status=${encodeURIComponent(status)}`;
  }

  const response = await api.get(url);
  return response.data;
};


export const getdashboarddata=async(startDate,endDate)=>{
  const response=await api.get(`/v2/tickets/status-count?startDate=${startDate}&endDate=${endDate}`)
  return response.data
}


export const getTicketReplyById = async (ticket_id) => {
  const response = await api.get(`/v2/tickets/${ticket_id}/replies`);
  return response?.data;
};

export const addTicketReply = async (ticket_id,data) => {
  const response = await api.post(`/v2/tickets/${ticket_id}/replies`,data);
  return response?.data;
};

export const changeTicketStatus=async(data)=>{
  const response = await api.post(`/v2/tickets/status`,data);
  return response?.data;}

  export const selfallocateticket=async(data)=>{
    const response = await api.post(`/v2/tickets/selfallocate`,data);
    return response?.data;}

    export const fetchnotifs=async(id)=>{
      const response=await api.get(`/v2/notifications/${id}`);
      return response?.data
    }

