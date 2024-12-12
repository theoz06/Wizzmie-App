import apiClient from '@/dal/apiClient'

const getRoles = async () => {
  try {
    const response = await apiClient.get("/role");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default {getRoles};