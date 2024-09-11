import axiosClient from "./axiosClient";

const handleAPI = async (url: string, data: any, method: 'post' | 'put' | 'get' | 'delete' = 'get') => {
    try {
        const response = await axiosClient({
            url,
            method,
            data: method === 'get' ? undefined : data, // Không gửi dữ liệu cho GET requests
            params: method === 'get' ? data : undefined // Đặt dữ liệu thành params cho GET requests
        });
        return response;
    } catch (error) {
        console.error('API call error:', error);
        throw error; // Đảm bảo lỗi được ném ra để catch block trong client có thể xử lý
    }
};

export default handleAPI;
