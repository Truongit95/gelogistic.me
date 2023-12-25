export const API_NAME = {
  FEDEX_REGISTER_TOKEN: "FEDEX_REGISTER_TOKEN",
  FEDEX_TRACKING: "FEDEX_TRACKING",
  FEDEX_DOCUMENT: "FEDEX_DOCUMENT",
  GHN_TRACKING: "GHN_TRACKING",
  NHAT_TIN_TRACKING: "NHAT_TIN_TRACKING",
  DHL_TRACKING: "DHL_TRACKING",
  UPS_REGISTER_TOKEN: "UPS_REGISTER_TOKEN",
  UPS_TRACKING: "UPS_TRACKING"
};

const MODULE = {
  FEDEX: "fedex",
  UPS: "ups",
  NHAT_TIN: "nhattin",
  DHL: "dhl"
};

export default {
  [API_NAME.FEDEX_REGISTER_TOKEN]: {
    module: MODULE.FEDEX,
    endpoint: "",
    version: "",
    method: "POST"
  },
  [API_NAME.FEDEX_TRACKING]: {
    module: MODULE.FEDEX,
    endpoint: "",
    version: "",
    method: "POST"
  },
  [API_NAME.FEDEX_DOCUMENT]: {
    module: MODULE.FEDEX,
    endpoint: "",
    version: "",
    method: "POST"
  },
  [API_NAME.GHN_TRACKING]: {
    module: MODULE.GHN,
    endpoint: "search",
    version: "",
    method: "POST"
  },
  [API_NAME.NHAT_TIN_TRACKING]: {
    module: MODULE.NHAT_TIN,
    endpoint: "",
    version: "",
    method: "POST"
  },
  [API_NAME.DHL_TRACKING]: {
    module: MODULE.DHL,
    endpoint: "",
    version: "",
    method: "POST"
  },
  [API_NAME.UPS_REGISTER_TOKEN]: {
    module: MODULE.UPS,
    endpoint: "",
    version: "",
    method: "POST"
  },
  [API_NAME.UPS_TRACKING]: {
    module: MODULE.UPS,
    endpoint: "",
    version: "",
    method: "POST"
  }
};
