import { apiGenerator } from "@/helpers/api";
import { API_NAME } from "@/configs/api";

export default (axios) => ({
  tracking(data, header, baseUrl) {
    const api = apiGenerator(
      axios,
      API_NAME.DHL_TRACKING,
      baseUrl,
      data,
      header
    );
    return api.call();
  },
});
