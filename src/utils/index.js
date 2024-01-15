import moment, { ISO_8601 } from "moment/moment";
import "moment/locale/vi";
import {
  DEFAULT_DATE_HAS_YEAR,
  FORMAT_DATE_HAS_YEAR_FULL_TIME,
  MAPPING_DELIVERY,
  FORMAT_DATE_HAS_YEAR,
  MAPPING_DELIVERY_DHL
} from "../constants";
import { orderBy, cloneDeep } from "lodash";

export const hideName = (input) => {
  // Tách chuỗi thành mảng các từ
  const words = input.split(" ");

  // Lấy tên cuối cùng từ mảng và chuyển thành chữ viết hoa
  const lastName = words[words.length - 1].toUpperCase();

  // Tạo chuỗi "XXX" với độ dài bằng với số từ trong tên, trừ từ cuối cùng
  const hiddenPart = "xxx".repeat(words.length - 1);

  // Kết hợp các phần để tạo ra chuỗi kết quả
  const result = `${hiddenPart} ${lastName}`;

  return result;
};

export const maskPhoneNumber = (phoneNumber) => {
  // Loại bỏ tất cả các ký tự không phải số từ số điện thoại
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  // Chỉ giữ lại 4 số cuối
  const lastFourDigits = cleanedNumber.slice(-4);

  // Tạo chuỗi "X" với độ dài bằng với số ký tự trong số điện thoại, trừ 4 số cuối
  const maskedPart = "x".repeat(cleanedNumber.length - 4);

  // Kết hợp chuỗi "X" và 4 số cuối để tạo ra số điện thoại đã được masquerade
  const maskedPhoneNumber = `${maskedPart}${lastFourDigits}`;

  return maskedPhoneNumber;
};

export const formatDate = (inputDate, format, onlyDate) => {
  if (!inputDate) return "";
  const time = format
    ? moment(inputDate, format)
    : moment(inputDate, DEFAULT_DATE_HAS_YEAR);

  const momentObjGMT7 = time.utcOffset("+07:00");

  const formattedDate = momentObjGMT7
    .locale("vi")
    .format(onlyDate ? FORMAT_DATE_HAS_YEAR : FORMAT_DATE_HAS_YEAR_FULL_TIME);

  return capitalizeFirstLetter(formattedDate);
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  // Lấy chữ cái đầu tiên và chuyển thành chữ hoa
  const firstLetter = str.charAt(0).toUpperCase();

  // Lấy phần còn lại của chuỗi và không thay đổi chữ hoa
  const restOfString = str.slice(1);

  // Kết hợp chữ hoa đầu tiên với phần còn lại của chuỗi
  const capitalizedString = firstLetter + restOfString;

  return capitalizedString;
};

export const groupHistoryNhatTin = (hisories) => {
  if (!hisories || hisories?.length <= 0) return [];
  let result = [];
  hisories.forEach((element) => {
    if (element.loc_time) {
      const valueTime = element.loc_time.split(" ");
      const date = valueTime[0];
      const data = {
        locTime: date,
        locTimeString: formatDate(element.loc_time, "DD/MM/YYYY HH:mm", true),
        details: [
          {
            locTime: element.loc_time,
            operation: element.operation,
            city: element.city,
            district: element.district,
            operationEn: element.operation_en,
            address: `${element.district}, ${element.city}`,
            time: moment(element.loc_time, DEFAULT_DATE_HAS_YEAR)
              .locale("en-us")
              .format("HH:mm A")
          }
        ]
      };

      const index = result.findIndex((s) => s.locTime == date);
      if (index < 0) {
        result.push(data);
      } else {
        result[index].details.push(data.details[0]);
      }
    }
  });

  if (result.length > 0) {
    result.forEach((element) => {
      if (element.details) {
        element.details = element.details.sort((a, b) => {
          const dateA = moment(a.loc_time, "DD/MM/YYYY HH:mm");
          const dateB = moment(b.loc_time, "DD/MM/YYYY HH:mm");
          return dateA.isAfter(dateB) ? -1 : 1;
        });
      }
    });
    result = result.sort((a, b) => {
      const dateA = moment(a.loc_time, "DD/MM/YYYY HH:mm");
      const dateB = moment(b.loc_time, "DD/MM/YYYY HH:mm");
      return dateA.isAfter(dateB) ? -1 : 1;
    });
  }
  return result;
};

export const groupLogsNhatTin = (data) => {
  let result = [];
  const histories = data.histories;
  const status = data.bill_status_desc;
  if (histories && histories?.length > 0) {
    histories.forEach((element, index) => {
      if (element.loc_time) {
        const data = {
          status: element.operation,
          address: `${element.district}, ${element.city}`,
          label: status && index == histories.length - 1 ? status : "",
          dateTime: element.loc_time,
          dateTimeString: `${moment(
            element.loc_time,
            "DD/MM/YYYY HH:mm"
          ).format("DD/MM/YYYY ")} lúc ${moment(
            element.loc_time,
            "DD/MM/YYYY HH:mm"
          ).format("HH:mm A")}`,
          sequence: element.sequence,
          isActive: false,
          isCurrent: false
        };
        result.push(data);
      }
    });
  } else {
    result.push({
      status: data.bill_status_desc,
      address: `${data.sender_district}, ${data.sender_province}`,
      label: data.bill_status_desc,
      dateTime: "",
      dateTimeString: "",
      sequence: 1,
      isActive: false,
      isCurrent: false
    });
  }
  if (result.length > 0) {
    if (result.length > 1 && data.bill_status_id != 4) {
      result.push({
        status: "Giao hàng thành công",
        address: `${data.receiver_district}, ${data.receiver_province}`,
        label: "",
        dateTime: data.date_delivery ? formatDate(data.date_delivery) : "",
        dateTimeString: data.date_delivery
          ? `${moment(data.date_delivery, DEFAULT_DATE_HAS_YEAR).format(
              "DD/MM/YYYY "
            )} lúc ${moment(data.date_delivery, DEFAULT_DATE_HAS_YEAR).format(
              "HH:mm A"
            )}`
          : "",
        sequence: result.length + 1,
        isActive: false,
        isCurrent: false
      });
    }

    result = orderBy(result, "sequence", "asc");

    if (result.length >= 4) {
      const first = result[0];
      const last = result[result.length - 1];
      const chiSo1 = layChiSoNgauNhien(1, result.length - 2, 0);
      const chiSo2 = layChiSoNgauNhien(1, result.length - 2, chiSo1);

      const doiTuong1 = cloneDeep(result[chiSo1]);
      const doiTuong2 = cloneDeep(result[chiSo2]);

      result = cloneDeep([first, doiTuong1, doiTuong2, last]);
      result = orderBy(result, "sequence", "asc");

      if (data.bill_status_id == 4) {
        result[0].isActive = true;
        result[1].isActive = true;
        result[2].isActive = true;
        result[3].isActive = true;
        result[3].isCurrent = true;
      } else {
        result[0].isActive = true;
        result[3].isActive = false;
        result[3].isCurrent = false;

        result[1].isActive = true;
        result[2].isActive = false;
        result[2].isCurrent = true;
      }
    } else if (result.length > 2) {
      result[0].isActive = true;
      result[1].isCurrent = true;
    } else {
      result[0].isCurrent = true;
    }
  }
  return result;
};

export const groupHistoryFD = (hisories) => {
  let result = [];
  if (!hisories || hisories?.length <= 0) return result;
  hisories.forEach((element) => {
    if (element.date) {
      const timeDetail = moment(element.date, ISO_8601);

      const momentObjGMT7Detail = timeDetail.utcOffset("+07:00");

      const date = momentObjGMT7Detail.format("DD/MM/YYYY");

      const data = {
        locTime: date,
        locTimeString: formatDate(element.date, ISO_8601, true),
        details: [
          {
            locTime: momentObjGMT7Detail,
            operation:
              element.derivedStatusCode &&
              MAPPING_DELIVERY[element.derivedStatusCode]
                ? MAPPING_DELIVERY[element.derivedStatusCode]
                : ReplaceName(element.eventDescription),
            city: element.scanLocation?.city,
            district: element.scanLocation?.countryName,
            operationEn: element.derivedStatus,
            address:
              element.scanLocation?.city && element.scanLocation?.countryName
                ? `${element.scanLocation?.city}, ${element.scanLocation?.countryName}`
                : "",
            time: momentObjGMT7Detail.locale("en-us").format("HH:mm A"),
            exceptionDescription: element.exceptionDescription
          }
        ]
      };

      const index = result.findIndex((s) => s.locTime == date);
      if (index < 0) {
        result.push(data);
      } else {
        result[index].details.push(data.details[0]);
      }
    }
  });

  if (result.length > 0) {
    result.forEach((element) => {
      if (element.details) {
        element.details = element.details.sort((a, b) => {
          const dateA = moment(a.locTime, "DD/MM/YYYY HH:mm");
          const dateB = moment(b.locTime, "DD/MM/YYYY HH:mm");
          return dateA.isAfter(dateB) ? 1 : -1;
        });
      }
    });
    result = result.sort((a, b) => {
      const dateA = moment(a.locTime, "DD/MM/YYYY");
      const dateB = moment(b.locTime, "DD/MM/YYYY");
      return dateA.isAfter(dateB) ? 1 : -1;
    });
  }
  return result;
};

export const groupLogsHistoryFD = (data) => {
  let result = [];
  if (!data?.scanEvents || data?.scanEvents?.length <= 0) return result;
  if (data.latestStatusDetail) {
    let addressText = `${data.shipperInformation?.address?.city}, ${data.shipperInformation?.address?.countryName}`;

    data.scanEvents.forEach((element, index) => {
      const timeDetail = moment(element.date, ISO_8601);

      const momentObjGMT7Detail = timeDetail.utcOffset("+07:00");

      const formattedDateDetail = `${momentObjGMT7Detail
        .locale("vi")
        .format("DD/MM/YYYY")} lúc ${momentObjGMT7Detail
        .locale("vi")
        .format("HH:mm A")} `;

      if (element.scanLocation?.city && element.scanLocation?.countryName) {
        addressText = `${element.scanLocation?.city}, ${element.scanLocation?.countryName}`;
      }

      const data = {
        status: element.eventDescription,
        address: addressText,
        label:
          element.derivedStatus == "Label created"
            ? "Label created"
            : element.derivedStatusCode
            ? MAPPING_DELIVERY[element.derivedStatusCode]
            : element.derivedStatus,
        dateTime: momentObjGMT7Detail,
        dateTimeString: formattedDateDetail,
        sequence: index,
        countryCode: element.scanLocation?.countryCode,
        isActive: false,
        isCurrent: false
      };
      if (!result.some((s) => s && s.dateTimeString == formattedDateDetail)) {
        result.push(data);
      }
    });
    if (result.length > 0) {
      result = orderBy(result, "dateTime", "asc");

      if (data.latestStatusDetail?.statusByLocale != "Delivered") {
        result.push({
          status: "Đến",
          address: `${data.destinationLocation?.locationContactAndAddress?.address?.city}, ${data.destinationLocation?.locationContactAndAddress?.address?.countryName}`,
          label: "Đang vận chuyển",
          dateTime: "",
          dateTimeString: "",
          sequence: result.length + 1,
          isActive: false,
          isCurrent: false
        });
      }

      if (result.length >= 4) {
        const first = result[0];
        const last = result[result.length - 1];

        const inVietNam = result.filter(function (obj) {
          return obj.countryCode && obj.countryCode == "VN";
        });

        const outVietNam = result.filter(function (obj) {
          return obj.countryCode && obj.countryCode != "VN";
        });
        let chiSo1;
        let chiSo2;
        let doiTuong1 = {};
        let doiTuong2 = {};
        if (inVietNam?.length > 0 && outVietNam?.length > 0) {
          chiSo1 = layChiSoNgauNhien(1, inVietNam?.length - 1, 0);
          chiSo2 = layChiSoNgauNhien(1, outVietNam.length - 1, 0);

          doiTuong1 = inVietNam[chiSo1];
          doiTuong2 =
            outVietNam.length > 1 ? outVietNam[chiSo2] : outVietNam[0];
          doiTuong1.status =
            doiTuong1.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
          doiTuong2.status =
            doiTuong2.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
          result = [first, doiTuong1, doiTuong2, last];
        } else if (inVietNam?.length > 0 && outVietNam?.length <= 0) {
          if (inVietNam.length > 3) {
            chiSo1 = layChiSoNgauNhien(1, inVietNam.length - 2, 0);
            chiSo2 = layChiSoNgauNhien(1, inVietNam.length - 2, chiSo1);
          } else {
            chiSo1 = 0;
            chiSo2 = inVietNam.length - 1;
          }

          doiTuong1 = inVietNam[chiSo1];
          doiTuong2 = inVietNam[chiSo2];

          doiTuong1.status =
            doiTuong1.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
          doiTuong2.status =
            doiTuong2.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";

          result = [first, doiTuong1, doiTuong2, last];
        } else if (inVietNam?.length <= 0 && outVietNam?.length > 0) {
          if (outVietNam.length > 3) {
            chiSo1 = layChiSoNgauNhien(1, outVietNam.length - 2, 0);
            chiSo2 = layChiSoNgauNhien(1, outVietNam.length - 2, chiSo1);
          } else {
            chiSo1 = 0;
            chiSo2 = outVietNam.length - 1;
          }
          doiTuong1 = outVietNam[chiSo1];
          doiTuong2 = outVietNam[chiSo2];
          doiTuong1.status =
            doiTuong1.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
          doiTuong2.status =
            doiTuong2.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";

          result = orderBy([doiTuong1, doiTuong2], "dateTime", "asc");
          result = [first, ...result, last];
        }

        if (data.latestStatusDetail?.statusByLocale == "Delivered") {
          result[0].isActive = true;
          result[1].isActive = true;
          result[2].isActive = true;
          result[2].isCurrent = false;
          result[3].isActive = true;
          result[3].isCurrent = true;
        } else {
          result[0].isActive = true;
          result[3].isActive = false;
          result[3].isCurrent = false;

          result[1].isActive = true;
          result[2].isActive = false;
          result[2].isCurrent = true;
        }
      } else if (result.length > 2) {
        result[0].isActive = true;
        result[1].isCurrent = true;
      } else {
        result[0].isCurrent = true;
      }
    }
  }
  return result;
};

function layChiSoNgauNhien(min, max, loaiTru) {
  let chiSoNgauNhien;
  do {
    chiSoNgauNhien = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (chiSoNgauNhien === loaiTru);
  return chiSoNgauNhien;
}

const ReplaceName = (input) => {
  const check = [
    "FedEx",
    "fedex",
    "fedex",
    "Fedex",
    "Nhất tín",
    "Nhất Tín",
    "NhatTin",
    "nhattin",
    "dhl",
    "DHL"
  ];
  return check.some((element) => input.includes(element))
    ? "Tiếp nhận đơn hàng"
    : input;
};
const HideText = (input) => {
  const check = [
    "FedEx",
    "fedex",
    "fedex",
    "Fedex",
    "Nhất tín",
    "Nhất Tín",
    "NhatTin",
    "nhattin",
    "dhl",
    "DHL",
    "ups",
    "Ups",
    "UPS"
  ];
  check.filter((element) => {
    if (input.includes(element)) {
      input = input.replace(element, "shipping unit");
    } else {
      // Nếu không có "", trả về chuỗi ban đầu
      return input;
    }
  });
  return input;
};

export const HideTextUps = (input, isEmpty) => {
  const check = ["ups", "Ups", "UPS"];
  check.filter((element) => {
    if (input.includes(element)) {
      input = input.replace(element, isEmpty ? "" : "system");
    } else {
      // Nếu không có "", trả về chuỗi ban đầu
      return input;
    }
  });
  return input;
};

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Đọc file như là dữ liệu base64
    reader.readAsDataURL(file);

    // Xử lý sự kiện khi đọc file hoàn tất
    reader.onload = function () {
      // Lấy dữ liệu base64 từ FileReader và resolve Promise
      const base64Data = reader.result.split(",")[1];
      resolve(base64Data);
    };

    // Xử lý sự kiện khi có lỗi đọc file
    reader.onerror = function (error) {
      reject(error);
    };
  });
}

export const convertToBase64 = async (byteData) => {
  const byteArray = new Uint8Array([byteData]);
  const file = new File([byteArray], "example.txt", {
    type: "application/octet-stream"
  });
  try {
    // Sử dụng await để đọc file và nhận dữ liệu base64
    const base64Result = await readFileAsBase64(file);
    return base64Result;
  } catch (error) {
    console.error("Error reading file:", error);
    return "";
  }
};

export const groupLogsDHL = (response, status) => {
  let result = [];
  const hisories = response.events;
  if (hisories?.length <= 0) return result;
  hisories.forEach((element, index) => {
    if (element.timestamp) {
      const data = {
        status: status && index == hisories.length - 1 ? status : "",
        address: element.location?.address
          ? `${element.location?.address?.addressLocality}`
          : "",
        label:
          element.statusCode && MAPPING_DELIVERY_DHL[element.statusCode]
            ? MAPPING_DELIVERY_DHL[element.statusCode]
            : element.description,
        dateTime: element.timestamp,
        dateTimeString: `${moment(element.timestamp, ISO_8601).format(
          "DD/MM/YYYY "
        )} lúc ${moment(element.timestamp, ISO_8601).format("HH:mm A")}`,
        sequence: index + 1,
        countryCode:
          element.location?.address?.addressLocality &&
          element.location?.address?.addressLocality?.indexOf("VIETNAM") >= 0
            ? "VN"
            : "",
        isActive: false,
        isCurrent: false
      };
      result.push(data);
    }
  });
  if (result.length > 0) {
    result = orderBy(result, "dateTime", "asc");

    if (response.status?.statusCode != "delivered") {
      result.push({
        status: "Đến",
        address: result.destination?.address?.addressLocality,
        label: "Đang vận chuyển",
        dateTime: response.timestamp
          ? formatDate(response.timestamp, ISO_8601)
          : "",
        dateTimeString: response.timestamp
          ? `${moment(response.timestamp, ISO_8601).format(
              "DD/MM/YYYY "
            )} lúc ${moment(response.timestamp, ISO_8601).format("HH:mm A")}`
          : "",
        sequence: result.length + 1,
        isActive: false,
        isCurrent: false
      });
    }

    if (result.length >= 4) {
      let first = result[0];
      if (response.origin) {
        const address = response.origin?.address?.addressLocality;
        let timestamp = "";
        if (hisories?.length > 0) {
          let locEvents = hisories.filter(
            (s) => s.location?.address?.addressLocality.indexOf(address) >= 0
          );
          locEvents = orderBy(locEvents, "timestamp", "asc");

          if (locEvents?.length > 0) {
            timestamp = locEvents[0].timestamp;
          }
        }
        first = {
          status: "Gửi từ",
          address: address,
          label: response.origin?.servicePoint?.label,
          dateTime: timestamp,
          dateTimeString: timestamp
            ? `${moment(timestamp, ISO_8601).format(
                "DD/MM/YYYY "
              )} lúc ${moment(timestamp, ISO_8601).format("HH:mm A")}`
            : "",
          sequence: 0,
          countryCode:
            response.origin?.address?.addressLocality &&
            response.origin?.address?.addressLocality?.indexOf("VIETNAM") >= 0
              ? "VN"
              : ""
        };
      }

      const last = result[result.length - 1];
      last.status = status;

      const inVietNam = result.filter(function (obj) {
        return obj.countryCode == "VN";
      });

      const outVietNam = result.filter(function (obj) {
        return obj.countryCode != "VN";
      });
      let chiSo1;
      let chiSo2;
      let doiTuong1 = {};
      let doiTuong2 = {};
      if (inVietNam?.length > 0 && outVietNam?.length > 0) {
        chiSo1 = layChiSoNgauNhien(1, inVietNam?.length - 1, 0);
        chiSo2 = layChiSoNgauNhien(1, outVietNam.length - 1, 0);

        doiTuong1 = inVietNam[chiSo1];
        doiTuong2 = outVietNam.length > 1 ? outVietNam[chiSo2] : outVietNam[0];
        doiTuong1.status =
          doiTuong1.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        doiTuong2.status =
          doiTuong2.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        result = [first, doiTuong1, doiTuong2, last];
      } else if (inVietNam?.length > 0 && outVietNam?.length <= 0) {
        if (inVietNam.length > 3) {
          chiSo1 = layChiSoNgauNhien(1, inVietNam.length - 2, 0);
          chiSo2 = layChiSoNgauNhien(1, inVietNam.length - 2, chiSo1);
        } else {
          chiSo1 = 0;
          chiSo2 = inVietNam.length - 1;
        }
        doiTuong1 = result[chiSo1];
        doiTuong2 = result[chiSo2];

        doiTuong1.status =
          doiTuong1.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        doiTuong2.status =
          doiTuong2.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";

        result = [first, doiTuong1, doiTuong2, last];
      } else if (inVietNam?.length <= 0 && outVietNam?.length > 0) {
        if (outVietNam.length > 3) {
          chiSo1 = layChiSoNgauNhien(1, outVietNam.length - 2, 0);
          chiSo2 = layChiSoNgauNhien(1, outVietNam.length - 2, chiSo1);
        } else {
          chiSo1 = 1;
          chiSo2 = 2;
        }
        doiTuong1 = result[chiSo1];
        doiTuong2 = result[chiSo2];
        doiTuong1.status =
          doiTuong1.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        doiTuong2.status =
          doiTuong2.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        result = [first, doiTuong1, doiTuong2, last];
      }

      result = orderBy(result, "dateTime", "asc");

      if (response.status?.statusCode == "delivered") {
        result[0].isActive = true;
        result[1].isActive = true;
        result[2].isActive = true;
        result[3].isActive = true;
        result[3].isCurrent = true;
      } else {
        result[0].isActive = true;
        result[3].isActive = false;
        result[3].isCurrent = false;

        result[1].isActive = true;
        result[2].isActive = false;
        result[2].isCurrent = true;
      }
    } else if (result.length > 2) {
      result[0].isActive = true;
      result[1].isCurrent = true;
    } else {
      result[0].isCurrent = true;
    }
  }
  return result;
};

export const groupHistoryDHL = (response, status) => {
  let result = [];
  const hisories = response.events;
  if (hisories?.length <= 0) return result;
  hisories.forEach((element) => {
    if (element.timestamp) {
      const timeDetail = moment(element.timestamp, ISO_8601);

      const momentObjGMT7Detail = timeDetail.utcOffset("+07:00");

      const date = momentObjGMT7Detail.format("DD/MM/YYYY");

      const data = {
        locTime: date,
        locTimeString: formatDate(element.timestamp, ISO_8601, true),
        details: [
          {
            locTime: momentObjGMT7Detail,
            operation: "Trên đường vận chuyển",
            city: element.location?.address?.addressLocality,
            district: "",
            operationEn: response.status?.statusCode,
            address: element.location?.address?.addressLocality,
            time: momentObjGMT7Detail.locale("en-us").format("HH:mm:ss A"),
            exceptionDescription: HideText(element.description)
          }
        ]
      };

      const index = result.findIndex((s) => s.locTime == date);
      if (index < 0) {
        result.push(data);
      } else {
        result[index].details.push(data.details[0]);
      }
    }
  });

  if (result.length > 0) {
    result.forEach((element) => {
      if (element.details) {
        element.details = element.details.sort((a, b) => {
          const dateA = moment(a.locTime, "DD/MM/YYYY HH:mm");
          const dateB = moment(b.locTime, "DD/MM/YYYY HH:mm");
          return dateA.isAfter(dateB) ? 1 : -1;
        });
      }
    });
    result = result.sort((a, b) => {
      const dateA = moment(a.locTime, "DD/MM/YYYY");
      const dateB = moment(b.locTime, "DD/MM/YYYY");
      return dateA.isAfter(dateB) ? 1 : -1;
    });
    result[0].details[0].operation = "Tiếp nhận đơn";
    result[result.length - 1].details[
      result[result.length - 1].details.length - 1
    ].operation = status;
  }
  return result;
};

export const ConvertTextToDate = (date, time) => {
  var dateTimeString = `${date}${time ? time : "000000"}`;
  // Chuyển đổi thành đối tượng Moment.js
  var momentObj = moment(dateTimeString, "YYYYMMDDHHmmss");

  // Chuyển đổi sang múi giờ UTC+7
  momentObj.utcOffset("+0700");
  return momentObj.toISOString();
};

export const groupHistoryUPS = (data) => {
  let result = [];
  if (!data.activity || data.activity?.length <= 0) return result;
  data.activity.forEach((element) => {
    if (element.date) {
      const dateObject = ConvertTextToDate(element.date, element.time);

      const timeDetail = moment(dateObject, ISO_8601);

      const momentObjGMT7Detail = timeDetail.utcOffset("+07:00");

      const date = momentObjGMT7Detail.format("DD/MM/YYYY");
      const status =
        element.status?.code == "MP"
          ? "Tiếp nhận đơn hàng"
          : element.status?.code == "FS"
          ? "Giao hàng thành công"
          : "Trên đường vận chuyển";

      const data = {
        locTime: date,
        locTimeString: formatDate(dateObject, ISO_8601, true),
        details: [
          {
            locTime: momentObjGMT7Detail,
            operation: status,
            city: GetCountryByCode(element.location?.address?.country),
            district: element.location?.address?.city,
            operationEn: status,
            address:
              element.location?.address?.city &&
              element.location?.address?.country
                ? `${element.location?.address?.city}, ${GetCountryByCode(
                    element.location?.address?.country
                  )}`
                : element.location?.address?.city,
            time: momentObjGMT7Detail.locale("en-us").format("HH:mm A")
          }
        ]
      };

      const index = result.findIndex((s) => s.locTime == date);
      if (index < 0) {
        result.push(data);
      } else {
        result[index].details.push(data.details[0]);
      }
    }
  });

  if (result.length > 0) {
    result.forEach((element) => {
      if (element.details) {
        element.details = element.details.sort((a, b) => {
          const dateA = moment(a.locTime, "DD/MM/YYYY HH:mm");
          const dateB = moment(b.locTime, "DD/MM/YYYY HH:mm");
          return dateA.isAfter(dateB) ? 1 : -1;
        });
      }
    });
    result = result.sort((a, b) => {
      const dateA = moment(a.locTime, "DD/MM/YYYY");
      const dateB = moment(b.locTime, "DD/MM/YYYY");
      return dateA.isAfter(dateB) ? 1 : -1;
    });
  }
  return result;
};
export const groupLogsHistoryUPS = (data) => {
  let result = [];
  if (!data?.activity || data?.activity?.length <= 0) return result;

  data.activity.forEach((element, index) => {
    const dateLocation = ConvertTextToDate(element.date, element.time);

    const timeDetail = moment(dateLocation, ISO_8601);

    const momentObjGMT7Detail = timeDetail.utcOffset("+07:00");

    const formattedDateDetail = `${momentObjGMT7Detail
      .locale("vi")
      .format("DD/MM/YYYY")} lúc ${momentObjGMT7Detail
      .locale("vi")
      .format("HH:mm A")} `;

    const address = [];
    if (element.location?.address?.city)
      address.push(element.location?.address?.city);
    if (element.location?.address?.country)
      address.push(GetCountryByCode(element.location?.address?.country));

    const data = {
      status: HideTextUps(element.status?.description),
      address: `${address?.length > 0 ? address.join(", ") : address[0]}`,
      label: GetStatusByCode(element.status?.code, element.status?.description),
      dateTime: momentObjGMT7Detail,
      dateTimeString: formattedDateDetail,
      sequence: index,
      countryCode: GetCountryByCode(element.location?.address?.countryCode),
      isActive: false,
      isCurrent: false
    };
    if (!result.some((s) => s && s.dateTimeString == formattedDateDetail)) {
      result.push(data);
    }
  });
  if (result.length > 0) {
    result = orderBy(result, "dateTime", "asc");

    if (
      data.activity?.findIndex(
        (s) => s.status?.description.indexOf("DELIVERED") >= 0
      ) < 0
    ) {
      const toLocation = data.packageAddress?.find(
        (s) => s.type == "DESTINATION"
      );
      result.push({
        status: "Đến",
        address: toLocation?.address
          ? `${toLocation?.address?.city}, ${toLocation?.address?.country}`
          : "",
        label: "Đang vận chuyển",
        dateTime: "",
        dateTimeString: "",
        sequence: result.length + 1,
        isActive: false,
        isCurrent: false
      });
    }

    if (result.length >= 4) {
      const first = result[0];
      const last = result[result.length - 1];

      const inVietNam = result.filter(function (obj) {
        return obj.countryCode && obj.countryCode == "VN";
      });

      const outVietNam = result.filter(function (obj) {
        return obj.countryCode && obj.countryCode != "VN";
      });
      let chiSo1;
      let chiSo2;
      let doiTuong1 = {};
      let doiTuong2 = {};
      if (inVietNam?.length > 0 && outVietNam?.length > 0) {
        chiSo1 = layChiSoNgauNhien(1, inVietNam?.length - 1, 0);
        chiSo2 = layChiSoNgauNhien(1, outVietNam.length - 1, 0);

        doiTuong1 = inVietNam[chiSo1];
        doiTuong2 = outVietNam.length > 1 ? outVietNam[chiSo2] : outVietNam[0];
        doiTuong1.status =
          doiTuong1.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        doiTuong2.status =
          doiTuong2.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        result = [first, doiTuong1, doiTuong2, last];
      } else if (inVietNam?.length > 0 && outVietNam?.length <= 0) {
        if (inVietNam.length > 3) {
          chiSo1 = layChiSoNgauNhien(1, inVietNam.length - 2, 0);
          chiSo2 = layChiSoNgauNhien(1, inVietNam.length - 2, chiSo1);
        } else {
          chiSo1 = 0;
          chiSo2 = inVietNam.length - 1;
        }

        doiTuong1 = inVietNam[chiSo1];
        doiTuong2 = inVietNam[chiSo2];

        doiTuong1.status =
          doiTuong1.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        doiTuong2.status =
          doiTuong2.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";

        result = [first, doiTuong1, doiTuong2, last];
      } else if (inVietNam?.length <= 0 && outVietNam?.length > 0) {
        if (outVietNam.length > 3) {
          chiSo1 = layChiSoNgauNhien(1, outVietNam.length - 2, 0);
          chiSo2 = layChiSoNgauNhien(1, outVietNam.length - 2, chiSo1);
        } else {
          chiSo1 = 1;
          chiSo2 = 2;
        }
        first.label = "Tiếp nhận đơn hàng";

        doiTuong1 = outVietNam[chiSo1];
        doiTuong2 = outVietNam[chiSo2];
        doiTuong1.status =
          doiTuong1.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        doiTuong1.label = "Trên đường vận chuyển";
        doiTuong2.status =
          doiTuong2.countryCode == "VN" ? "Tại Việt Nam" : "Quốc tế";
        doiTuong2.label = "Trên đường vận chuyển";

        result = orderBy([doiTuong1, doiTuong2], "dateTime", "asc");
        result = [first, ...result, last];
      }

      if (
        data.activity?.findIndex(
          (s) => s.status?.description.indexOf("DELIVERED") >= 0
        ) >= 0
      ) {
        result[0].isActive = true;
        result[1].isActive = true;
        result[2].isActive = true;
        result[2].isCurrent = false;
        result[3].isActive = true;
        result[3].isCurrent = true;
        result[3].label = "Giao hàng thành công";
      } else {
        result[0].isActive = true;
        result[3].isActive = false;
        result[3].isCurrent = false;

        result[1].isActive = true;
        result[2].isActive = false;
        result[2].isCurrent = true;
      }
    } else if (result.length > 2) {
      result[0].isActive = true;
      result[1].isCurrent = true;
    } else {
      result[0].isCurrent = true;
    }
  }
  return result;
};

export const GetCountryByCode = (code) => {
  const country = {
    AF: "AFGHANISTAN",
    AX: "ÅLAND ISLANDS",
    AL: "ALBANIA",
    DZ: "ALGERIA",
    AS: "AMERICAN SAMOA",
    AD: "ANDORRA",
    AO: "ANGOLA",
    AI: "ANGUILLA",
    AQ: "ANTARCTICA",
    AG: "ANTIGUA AND BARBUDA",
    AR: "ARGENTINA",
    AM: "ARMENIA",
    AW: "ARUBA",
    AU: "AUSTRALIA",
    AT: "AUSTRIA",
    AZ: "AZERBAIJAN",
    BS: "BAHAMAS",
    BH: "BAHRAIN",
    BD: "BANGLADESH",
    BB: "BARBADOS",
    BY: "BELARUS",
    BE: "BELGIUM",
    BZ: "BELIZE",
    BJ: "BENIN",
    BM: "BERMUDA",
    BT: "BHUTAN",
    BO: "BOLIVIA",
    BA: "BOSNIA AND HERZEGOVINA",
    BW: "BOTSWANA",
    BV: "BOUVET ISLAND",
    BR: "BRAZIL",
    IO: "BRITISH INDIAN OCEAN TERRITORY",
    BN: "BRUNEI DARUSSALAM",
    BG: "BULGARIA",
    BF: "BURKINA FASO",
    BI: "BURUNDI",
    KH: "CAMBODIA",
    CM: "CAMEROON",
    CA: "CANADA",
    CV: "CAPE VERDE",
    KY: "CAYMAN ISLANDS",
    CF: "CENTRAL AFRICAN REPUBLIC",
    TD: "CHAD",
    CL: "CHILE",
    CN: "CHINA",
    CX: "CHRISTMAS ISLAND",
    CC: "COCOS (KEELING) ISLANDS",
    CO: "COLOMBIA",
    KM: "COMOROS",
    CG: "CONGO",
    CD: "CONGO, THE DEMOCRATIC REPUBLIC OF THE",
    CK: "COOK ISLANDS",
    CR: "COSTA RICA",
    CI: "CÔTE D'IVOIRE",
    HR: "CROATIA",
    CU: "CUBA",
    CY: "CYPRUS",
    CZ: "CZECH REPUBLIC",
    DK: "DENMARK",
    DJ: "DJIBOUTI",
    DM: "DOMINICA",
    DO: "DOMINICAN REPUBLIC",
    EC: "ECUADOR",
    EG: "EGYPT",
    SV: "EL SALVADOR",
    GQ: "EQUATORIAL GUINEA",
    ER: "ERITREA",
    EE: "ESTONIA",
    ET: "ETHIOPIA",
    FK: "FALKLAND ISLANDS (MALVINAS)",
    FO: "FAROE ISLANDS",
    FJ: "FIJI",
    FI: "FINLAND",
    FR: "FRANCE",
    GF: "FRENCH GUIANA",
    PF: "FRENCH POLYNESIA",
    TF: "FRENCH SOUTHERN TERRITORIES",
    GA: "GABON",
    GM: "GAMBIA",
    GE: "GEORGIA",
    DE: "GERMANY",
    GH: "GHANA",
    GI: "GIBRALTAR",
    GR: "GREECE",
    GL: "GREENLAND",
    GD: "GRENADA",
    GP: "GUADELOUPE",
    GU: "GUAM",
    GT: "GUATEMALA",
    GN: "GUINEA",
    GW: "GUINEA-BISSAU",
    GY: "GUYANA",
    HT: "HAITI",
    HM: "HEARD ISLAND AND MCDONALD ISLANDS",
    VA: "HOLY SEE (VATICAN CITY STATE)",
    HN: "HONDURAS",
    HK: "HONG KONG",
    HU: "HUNGARY",
    IS: "ICELAND",
    IN: "INDIA",
    ID: "INDONESIA",
    IR: "IRAN, ISLAMIC REPUBLIC OF",
    IQ: "IRAQ",
    IE: "IRELAND",
    IL: "ISRAEL",
    IT: "ITALY",
    JM: "JAMAICA",
    JP: "JAPAN",
    JO: "JORDAN",
    KZ: "KAZAKHSTAN",
    KE: "KENYA",
    KI: "KIRIBATI",
    KP: "KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF",
    KR: "KOREA, REPUBLIC OF",
    KW: "KUWAIT",
    KG: "KYRGYZSTAN",
    LA: "LAO PEOPLE'S DEMOCRATIC REPUBLIC",
    LV: "LATVIA",
    LB: "LEBANON",
    LS: "LESOTHO",
    LR: "LIBERIA",
    LY: "LIBYAN ARAB JAMAHIRIYA",
    LI: "LIECHTENSTEIN",
    LT: "LITHUANIA",
    LU: "LUXEMBOURG",
    MO: "MACAO",
    MK: "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF",
    MG: "MADAGASCAR",
    MW: "MALAWI",
    MY: "MALAYSIA",
    MV: "MALDIVES",
    ML: "MALI",
    MT: "MALTA",
    MH: "MARSHALL ISLANDS",
    MQ: "MARTINIQUE",
    MR: "MAURITANIA",
    MU: "MAURITIUS",
    YT: "MAYOTTE",
    MX: "MEXICO",
    FM: "MICRONESIA, FEDERATED STATES OF",
    MD: "MOLDOVA, REPUBLIC OF",
    MC: "MONACO",
    MN: "MONGOLIA",
    MS: "MONTSERRAT",
    MA: "MOROCCO",
    MZ: "MOZAMBIQUE",
    MM: "MYANMAR",
    NA: "NAMIBIA",
    NR: "NAURU",
    NP: "NEPAL",
    NL: "NETHERLANDS",
    AN: "NETHERLANDS ANTILLES",
    NC: "NEW CALEDONIA",
    NZ: "NEW ZEALAND",
    NI: "NICARAGUA",
    NE: "NIGER",
    NG: "NIGERIA",
    NU: "NIUE",
    NF: "NORFOLK ISLAND",
    MP: "NORTHERN MARIANA ISLANDS",
    NO: "NORWAY",
    OM: "OMAN",
    PK: "PAKISTAN",
    PW: "PALAU",
    PS: "PALESTINIAN TERRITORY, OCCUPIED",
    PA: "PANAMA",
    PG: "PAPUA NEW GUINEA",
    PY: "PARAGUAY",
    PE: "PERU",
    PH: "PHILIPPINES",
    PN: "PITCAIRN",
    PL: "POLAND",
    PT: "PORTUGAL",
    PR: "PUERTO RICO",
    QA: "QATAR",
    RE: "RÉUNION",
    RO: "ROMANIA",
    RU: "RUSSIAN FEDERATION",
    RW: "RWANDA",
    SH: "SAINT HELENA",
    KN: "SAINT KITTS AND NEVIS",
    LC: "SAINT LUCIA",
    PM: "SAINT PIERRE AND MIQUELON",
    VC: "SAINT VINCENT AND THE GRENADINES",
    WS: "SAMOA",
    SM: "SAN MARINO",
    ST: "SAO TOME AND PRINCIPE",
    SA: "SAUDI ARABIA",
    SN: "SENEGAL",
    CS: "SERBIA AND MONTENEGRO",
    SC: "SEYCHELLES",
    SL: "SIERRA LEONE",
    SG: "SINGAPORE",
    SK: "SLOVAKIA",
    SI: "SLOVENIA",
    SB: "SOLOMON ISLANDS",
    SO: "SOMALIA",
    ZA: "SOUTH AFRICA",
    GS: "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS",
    ES: "SPAIN",
    LK: "SRI LANKA",
    SD: "SUDAN",
    SR: "SURINAME",
    SJ: "SVALBARD AND JAN MAYEN",
    SZ: "SWAZILAND",
    SE: "SWEDEN",
    CH: "SWITZERLAND",
    SY: "SYRIAN ARAB REPUBLIC",
    TW: "TAIWAN, PROVINCE OF CHINA",
    TJ: "TAJIKISTAN",
    TZ: "TANZANIA, UNITED REPUBLIC OF",
    TH: "THAILAND",
    TL: "TIMOR-LESTE",
    TG: "TOGO",
    TK: "TOKELAU",
    TO: "TONGA",
    TT: "TRINIDAD AND TOBAGO",
    TN: "TUNISIA",
    TR: "TURKEY",
    TM: "TURKMENISTAN",
    TC: "TURKS AND CAICOS ISLANDS",
    TV: "TUVALU",
    UG: "UGANDA",
    UA: "UKRAINE",
    AE: "UNITED ARAB EMIRATES",
    GB: "UNITED KINGDOM",
    US: "UNITED STATES",
    UM: "UNITED STATES MINOR OUTLYING ISLANDS",
    UY: "URUGUAY",
    UZ: "UZBEKISTAN",
    VU: "VANUATU",
    VE: "VENEZUELA",
    VN: "VIET NAM",
    VG: "VIRGIN ISLANDS, BRITISH",
    VI: "VIRGIN ISLANDS, U.S.",
    WF: "WALLIS AND FUTUNA",
    EH: "WESTERN SAHARA",
    YE: "YEMEN",
    ZM: "ZAMBIA",
    ZW: "ZIMBABWE"
  };
  if (country[code]) return country[code];
  return code;
};
export const GetStatusByCode = (code, desctiption) => {
  if (MAPPING_DELIVERY[code]) return MAPPING_DELIVERY[code];
  return desctiption;
};
