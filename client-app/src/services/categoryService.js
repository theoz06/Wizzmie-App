import apiClient from "@/dal/apiClient";


const  getAllCategory= async () => {
  const response = await apiClient.get("/category/public");
  return response.data;
}

const createCategory= async () => {
    const response = await apiClient.post("/category/admin/create", data);
    return response.data;
}

const updateCategory= async (id, data ) => {
    const response = await apiClient.put(`/category/admin/update/${id}`, data);
    return response.data;
}

const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/category/admin/delete/${id}`);
  return response.data;
}



export default{
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory 
}
