import { useState, useEffect } from "react";
import categoryService from "@/services/categoryService";

const useGetAllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllCategory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.getAllCategory();
      setCategories(response);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  console.log(categories);


  useEffect(()=> {
    getAllCategory();
  }, []);

  return {
    categories,
    loading,
    error,
    getAllCategory
  }
};

export default useGetAllCategory;

