import useAuthStore from "@/store/store";
import axios from "axios";
import queryString from "query-string";


const baseURL = `http://localhost:8000/`
//const baseURL = `http://192.168.1.7:8000/`
//const baseURL = `https://servervulethien.vercel.app/`

const axiosClient = axios.create(
    {
        baseURL,
        paramsSerializer: (params) => queryString.stringify(params)
    }
)

axiosClient.interceptors.request.use(async (config: any) => {
    const token = useAuthStore.getState().token;
    config.headers = {
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/json',
      ...config.headers,
    };
    return config;
  });

axiosClient.interceptors.response.use(
    response => {
        if (response.data && response.status >= 200 && response.status < 300) {
            return response;
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        const { response } = error;
        return Promise.reject(response ? response.data : error);
    }
);


export default axiosClient