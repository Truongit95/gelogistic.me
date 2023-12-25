import { apiGenerator } from "../helpers/api";
import { API_NAME } from "../configs/api";

export default (axios) => ({
  registerToken(header, data, baseUrl) {
    const api = apiGenerator(
      axios,
      API_NAME.FEDEX_REGISTER_TOKEN,
      baseUrl,
      data,
      header
    );
    return api.call();
  },
  tracking(header, data, baseUrl) {
    const api = apiGenerator(
      axios,
      API_NAME.FEDEX_TRACKING,
      baseUrl,
      data,
      header
    );
    return api.call();
  },
  getDocuments(header, data, baseUrl) {
    const api = apiGenerator(
      axios,
      API_NAME.FEDEX_DOCUMENT,
      baseUrl,
      data,
      header
    );
    return api.call();
  }
});
