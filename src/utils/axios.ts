import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface FetchDataResponse<T = any> {
    status: "success" | "error";
    message: string;
    data_response: T[];
}

export const fetchData = async <T = any>(
    url: string,
    method: HttpMethod = "GET",
    data?: any
): Promise<T> => {
    try {
        const config: AxiosRequestConfig = {
            url,
            method,
            ...(method !== "GET" ? { data } : {}),
        };

        const response: AxiosResponse<T> = await api.request(config);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
};
