import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

// Response interceptor to handle 401 responses
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const requestUrl = error.config?.url || '';
        
        // Don't redirect if we're already on login page or if it's an auth check request
        const isOnLoginPage = currentPath.startsWith('/login');
        const isAuthCheck = requestUrl.includes('/auth/me');
        
        if (!isOnLoginPage && !isAuthCheck) {
          // Clear any stored authentication data
          document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          
          // Dispatch a custom event to notify components about the 401
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          
          // Redirect to login page
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

const post = async (url: string, data?: any) => {
  const config = {
    headers: data instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' }
  };
  
  const response = await instance.post(url, data, config);
  return response.data;
};

const put = async (url: string, data?: any) => {
  const response = await instance.put(url, data);
  return response.data;
};

// Login POST
const postWithCredentials = async (url: string, data: any) => {
  const response = await instance.post(url, data, { withCredentials: true });
  return response.data;
};

const get = async <T>(url: string): Promise<T> => {
  const response = await instance.get<T>(url);
  return response.data;
};

const patch = async <T>(url: string, data?: any) => {
  const response = await instance.patch<T>(url, data);
  return response.data;
};

const del = async (url: string) => {
  const response = await instance.delete(url);
  return response.data;
};

const restClient = {
  post,
  patch,
  put,
  get,
  delete: del,
  postWithCredentials,
};

export default restClient;
