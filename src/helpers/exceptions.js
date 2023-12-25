import { getOr } from "lodash/fp";

const exceptionHandler = (errorCode, errorInfo) => {
  console.log(errorCode, errorInfo);
  let message = "Có lỗi xảy ra";

  switch (errorCode) {
    case 400:
      message = getOr(errorInfo, "message")(errorInfo);

      break;

    case 404:
      message = "Không tìm thấy endpoint";
      break;

    case 500:
      message = getOr(message, "message")(errorInfo);

      break;
  }

  return {
    code: errorCode,
    message,
  };
};

export default exceptionHandler;
