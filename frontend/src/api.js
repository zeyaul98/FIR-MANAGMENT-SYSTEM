const API_URL = import.meta.env.VITE_API_URL || "https://fir-managment-system.onrender.com";

export const getApiUrl = () => API_URL;

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers = {
    "ngrok-skip-browser-warning": "true",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const text = await response.text();

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        "Backend JSON nahi bhej raha. URL/route galat hai ya ngrok warning page aa raha hai."
      );
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default API_URL;