import useSWR, { mutate } from 'swr';
import axiosClient from "./axiosClient";

// Hàm fetcher xử lý tất cả các yêu cầu HTTP
const fetcher = async (url: string, method: 'get' | 'post' | 'put' | 'delete', data?: any) => {
  try {
    const config = {
      url,
      method,
      ...(method === 'get' ? { params: data } : { data }), // Xử lý params cho GET và data cho các phương thức khác
    };
    const response = await axiosClient(config); // Gọi axiosClient
    return response.data; // Trả về dữ liệu phản hồi
  } catch (error: any) {
    // Bắt và xử lý lỗi, trả về thông báo lỗi rõ ràng hơn
    throw new Error(error.response?.data?.message || 'API Error');
  }
};

// Custom hook để sử dụng API
export const useAPI = (url: string, method: 'get' | 'post' | 'put' | 'delete' = 'get', data?: any) => {
  const { data: response, error, mutate } = useSWR(
    [url, method, JSON.stringify(data)], // Serialize data để đảm bảo caching đúng
    () => fetcher(url, method, data), // Gọi fetcher để lấy dữ liệu từ API
    {
      revalidateOnFocus: false, // Không tự động gọi lại API khi focus lại ứng dụng
      shouldRetryOnError: true,  // Tự động retry khi có lỗi
      errorRetryCount: 3,        // Retry tối đa 3 lần
      errorRetryInterval: 5000,  // Thời gian giữa các lần retry là 5 giây
    }
  );

  return {
    data: response, // Dữ liệu phản hồi từ API
    isLoading: !error && !response, // Trạng thái loading khi chưa có phản hồi
    isError: error, // Trạng thái lỗi
    mutate, // Hàm mutate để cập nhật dữ liệu mà không cần gọi lại API
  };
};

// Hàm mutateAPI để thao tác với API mà không cần dùng SWR (cho các hành động như POST, PUT, DELETE)
export const mutateAPI = async (url: string, data: any, method: 'get' | 'post' | 'put' | 'delete') => {
  try {
    const response = await fetcher(url, method, data);
    
    // Tự động cập nhật lại cache sau khi thay đổi dữ liệu
    mutate(url); 

    return response;
  } catch (error: any) {
    // Ném lỗi ra ngoài nếu có
    throw error;
  }
};

// Xuất mặc định hook useAPI để sử dụng ở các nơi khác
export default useAPI;
