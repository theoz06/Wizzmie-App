import apiClient from "@/dal/apiClient";


const getDashboardMetrics = async () => {
    try {
        const response = await apiClient.get("/dashboard/metrics");
        console.log("res: " + response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default {getDashboardMetrics};