import apiConfigs from "@/configs/api";
import { template, isEmpty } from "lodash/fp";
import urlencoded from "form-urlencoded";

const apiCaller = (
  axios,
  { url, method, payload = {}, baseURL, header = {} }
) =>
  axios.request({
    url,
    method,
    data: payload,
    baseURL: baseURL,
    headers: header
  });

const apiGenerator = (axios, apiName, baseUrl, data = {}, header = {}) => {
  const { params = {}, query = {}, payload = {} } = data;
  const { endpoint, module, version, method } = apiConfigs[apiName];
  const templateCompiler = template(endpoint);
  const urlCompiled = templateCompiler(params);
  //const pathModule = module ? `/${module}` : "";
  const pathModule = "";
  const path = `${version}${pathModule}/${urlCompiled}`;
  const queryCompiled = !isEmpty(query) ? `?${urlencoded(query)}` : "";
  const url = path + queryCompiled;
  return {
    call: () =>
      apiCaller(axios, { url, method, payload, baseURL: baseUrl, header })
  };
};

export { apiGenerator, apiCaller };
