import { apiGenerator } from "@/helpers/api";
import { API_NAME } from "@/configs/api";

export default (axios) => ({
  registerToken(header, data, baseUrl) {
    const api = apiGenerator(
      axios,
      API_NAME.UPS_REGISTER_TOKEN,
      baseUrl,
      data,
      header
    );
    return api.call();
  },
  tracking(header, data, baseUrl) {
    const api = apiGenerator(
      axios,
      API_NAME.UPS_TRACKING,
      baseUrl,
      data,
      header
    );
    return api.call();
  }
});
