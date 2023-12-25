export const CONFIG_API_DELIVERY_NAME = {
  FED: {
    baseApiToken: "/wp-json/v1/fedex/register/",
    baseApiTracking: "/wp-json/v1/fedex/tracking/",
    document: "/wp-json/v1/fedex/document/",
    granType: "client_credentials",
    clientId: "l740ef5ba756304692b7934cfdc42eec30", //"l7c0aedc4d2c0149d0912006c90d042cd6" // sanbox,
    clientSecret: "cc093578-ec55-41cf-9883-03ec43cd4df3" // '85aeb7697dc84ee38e3bf26ed7fee9ae' sanbox
  },
  NHT: {
    clientId: "gel_shop",
    clientSecret: "5db6af3ad0abe1cb932d17469f58ce1b93a1cbaf",
    baseApiTracking: "/wp-json/v1/nhattin/tracking/"
  },
  DHL: {
    clientId: "sS50KlUT0VdYyGD7Vo25gsmjzfdgJgtb",
    clientSecret: "lkb9fuxI2dop0JpE",
    baseApiTracking: "/wp-json/v1/dhl/tracking/"
  },
  UPS: {
    baseApiToken: "/wp-json/v1/ups/register/",
    baseApiTracking: "/wp-json/v1/ups/tracking/",
    granType: "client_credentials"
  }
};

export const DEFAULT_DATE_HAS_YEAR = "YYYY-MM-DD HH:mm:ss.SSS";
export const FORMAT_DATE_HAS_YEAR = "dddd, DD/MM/YYYY";
export const FORMAT_DATE_HAS_YEAR_FULL_TIME = "dddd, DD/MM/YYYY - HH:mm";
export const DATE_ISO_8601 = "yyyy-MM-ddTHH:mm:sszzz";
export const MAPPING_DELIVERY = {
  DL: "Giao hàng thành công",
  IT: "Trên đường vận chuyển",
  PU: "Đã nhận vật phẩm",
  DY: "Trì hoãn giao hàng",
  FS: "Giao hàng thành công",
  OT: "Trên đường vận chuyển",
  MP: "Tiếp nhận đơn hàng",
  OR: "Kiểm tra đơn hàng"
};
export const MAPPING_DELIVERY_NHATTIN = {
  Express: "Giao hàng nhanh"
};
export const MAPPING_DELIVERY_DHL = {
  delivered: "Giao hàng thành công",
  EXPRESS: "Giao hàng hỏa tốc",
  transit: "Đang quá cảnh",
  Delivered: "Giao hàng thành công"
};
export const MAPPING_SERVICES_DHL = {
  express: "Giao hàng hỏa tốc"
};
