import axios from "axios";
import exceptionHandler from "@/helpers/exceptions";
const axiosInstance = axios.create({
  crossorigin: true,
});

axiosInstance.interceptors.request.use((request) => {
  //request.headers.Authorization = `Bearer ${accessToken.value}`;

  // if (['put', 'post'].includes(request.method)) {
  //     request.data = snakecaseKeys(request.data, { deep: true });
  // }

  return request;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return { ...response.data, success: true };
    // return camelcaseKeys(response.data, { deep: true });
  },
  (error) => {
    let errorInfo = {
      code: "Undefined",
      message: "Lỗi không xác định",
    };

    if (error.response) {
      const { status, data } = error.response;
      errorInfo = exceptionHandler(status, data);
    }

    return { error: errorInfo };
  }
);

export default axiosInstance;
