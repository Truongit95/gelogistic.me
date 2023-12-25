import { inject, ref } from "vue";
import { useStore } from "vuex";
import {
  CONFIG_API_DELIVERY_NAME,
  MAPPING_DELIVERY,
  MAPPING_DELIVERY_DHL,
  MAPPING_SERVICES_DHL
} from "../constants/index";
import {
  hideName,
  maskPhoneNumber,
  formatDate,
  groupHistoryNhatTin,
  groupLogsNhatTin,
  groupHistoryFD,
  groupLogsHistoryFD,
  groupLogsDHL,
  groupHistoryDHL,
  HideTextUps,
  ConvertTextToDate,
  groupHistoryUPS,
  groupLogsHistoryUPS,
  GetCountryByCode
} from "../utils";
import { ISO_8601 } from "moment/moment";

const mappingDataNhatTin = (response) => {
  if (response.data && response.data[0]) {
    const data = {
      packageDetail: {
        orderId: `${response.data[0].bill_code}NT`,
        estimatedPickUpDate: formatDate(response.data[0].date_pickup),
        estimatedDeliveryDate: formatDate(response.data[0].date_expected),
        expectedDeliveryDate: formatDate(response.data[0].date_delivery),
        status: response.data[0].bill_status_desc,
        service: response.data[0]?.service
          ? response.data[0]?.service.indexOf("Giao hàng") >= 0
            ? response.data[0]?.service
            : `Giao hàng ${response.data[0]?.service.toLowerCase()}`
          : "Giao hàng nhanh"
      },
      sender: {
        fullName: hideName(response.data[0].sender_name),
        phoneNumber: maskPhoneNumber(response.data[0].sender_phone),
        address: `${response.data[0].sender_district}, ${response.data[0].sender_province}`
      },
      receiver: {
        fullName: hideName(response.data[0].receiver_name),
        phoneNumber: maskPhoneNumber(response.data[0].receiver_phone),
        address: `${response.data[0].receiver_district}, ${response.data[0].receiver_province}`
      },
      package: {
        packageNo: response.data[0]?.package_no,
        weight: response.data[0]?.weight,
        size: `${response.data[0]?.length}x${response.data[0]?.width}x${response.data[0]?.height}`,
        image: ""
        // response.data[0]?.document_image_link?.length > 0
        //   ? response.data[0]?.document_image_link[0]
        //   : response.data[0]?.bill_image_link?.length > 0
        //   ? response.data[0]?.bill_image_link[0]
        //   : ""
      }
    };
    data.histories = groupHistoryNhatTin(response.data[0].histories);
    data.logs = groupLogsNhatTin(response.data[0]);
    return data;
  }

  return {};
};
const getImage = async (api, token, baseApi, trackingInfo) => {
  return "";
  // const header = {
  //   "Content-Type": "application/json",
  //   Authorization: token
  // };
  // const now = moment();
  // const sixMonthsAgo = now.clone().subtract(6, "months").format("YYYY-MM-DD");
  // const sixMonthsLater = now.clone().add(6, "months").format("YYYY-MM-DD");

  // const trackingData = {
  //   payload: {
  //     trackDocumentDetail: {
  //       documentType: "SIGNATURE_PROOF_OF_DELIVERY",
  //       documentFormat: "PNG"
  //     },
  //     trackDocumentSpecification: [
  //       {
  //         trackingNumberInfo: trackingInfo,
  //         shipDateBegin: sixMonthsAgo,
  //         shipDateEnd: sixMonthsLater
  //       }
  //     ]
  //   }
  // };

  // const response = await api.fedex.tracking(header, trackingData, baseApi);
  // if (response.success && response.output?.documents?.length > 0) {
  //   return await `data:image/png;base64,${response.output?.documents[0]}`;
  // }
  // return "";
};
const mappingDataFedex = async (api, token, baseApi, response) => {
  if (
    response.output?.completeTrackResults?.length > 0 &&
    response.output?.completeTrackResults[0]?.trackResults?.length > 0
  ) {
    const result = response.output.completeTrackResults[0]?.trackResults[0];

    // const image = await getImage(
    //   api,
    //   token,
    //   baseApi,
    //   result.trackingNumberInfo
    // );

    const pickUpDate = result.dateAndTimes?.find(
      (v) => v.type == "ACTUAL_PICKUP"
    );
    const deliveryTeaser = result.dateAndTimes?.find(
      (v) => v.type == "ESTIMATED_DELIVERY"
    );
    const deliveryDate = result.dateAndTimes?.find(
      (v) => v.type == "ACTUAL_DELIVERY"
    );

    const data = {
      packageDetail: {
        orderId: `${response.orderId}FD`,
        estimatedPickUpDate: pickUpDate
          ? formatDate(pickUpDate.dateTime, ISO_8601)
          : "",
        estimatedDeliveryDate: deliveryTeaser
          ? formatDate(deliveryTeaser.dateTime, ISO_8601)
          : "",
        expectedDeliveryDate: deliveryDate
          ? formatDate(deliveryDate.dateTime, ISO_8601)
          : "",
        status: result.latestStatusDetail?.derivedCode
          ? MAPPING_DELIVERY[result.latestStatusDetail.derivedCode]
          : result.latestStatusDetail?.description,
        service: "Giao hàng tận nơi"
      },
      sender: {
        fullName: "-",
        phoneNumber: "-",
        address: `${result.originLocation?.locationContactAndAddress?.address?.city}, ${result.originLocation?.locationContactAndAddress?.address?.countryName}`
      },
      receiver: {
        fullName: "-",
        phoneNumber: "-",
        address: `${result.destinationLocation?.locationContactAndAddress?.address?.city}, ${result.destinationLocation?.locationContactAndAddress?.address?.countryName}`
      },
      package: {
        packageNo: result.packageDetails?.count,
        weight: result?.packageDetails?.weightAndDimensions?.weight
          ?.map((item) => `${item.value} ${item.unit}`)
          .join(" / "),
        size:
          result?.packageDetails?.weightAndDimensions?.dimensions?.length > 0
            ? `${result?.packageDetails?.weightAndDimensions?.dimensions[0].length}x${result?.packageDetails?.weightAndDimensions?.dimensions[0].width}x${result?.packageDetails?.weightAndDimensions?.dimensions[0].height} ${result?.packageDetails?.weightAndDimensions?.dimensions[0].units}`
            : "",
        image: ""
      }
    };

    data.histories = groupHistoryFD(result.scanEvents);
    data.logs = groupLogsHistoryFD(result);
    return data;
  }

  return {};
};

const mappingDataDhl = (response) => {
  if (response?.shipments?.length > 0 && response?.shipments[0]) {
    const result = response.shipments[0];
    const data = {
      packageDetail: {
        orderId: `${result.id}DL`,
        estimatedPickUpDate: "",
        estimatedDeliveryDate: formatDate(
          result.estimatedDeliveryTimeFrame?.estimatedThrough
            ? result.estimatedDeliveryTimeFrame?.estimatedThrough
            : result.estimatedTimeOfDelivery,
          ISO_8601
        ),
        expectedDeliveryDate: formatDate(
          result.estimatedDeliveryTimeFrame?.estimatedThrough
            ? result.estimatedDeliveryTimeFrame?.estimatedThrough
            : result.estimatedTimeOfDelivery,
          ISO_8601
        ),
        status:
          result.status && MAPPING_DELIVERY_DHL[result.status?.statusCode]
            ? MAPPING_DELIVERY_DHL[result.status?.statusCode]
            : result.status?.statusCode,
        service:
          result.details?.carrier?.organizationName &&
          MAPPING_DELIVERY_DHL[result.details?.carrier?.organizationName]
            ? MAPPING_DELIVERY_DHL[result.details?.carrier?.organizationName]
            : result.service && MAPPING_SERVICES_DHL[result.service]
            ? MAPPING_SERVICES_DHL[result.service]
            : result.service
      },
      sender: {
        fullName: hideName(`${result.details?.sender?.name}`),
        phoneNumber: "",
        address: `${result.origin?.address?.addressLocality}`
      },
      receiver: {
        fullName: hideName(`${result.details?.receiver?.name}`),
        phoneNumber: "",
        address: `${result.destination?.address?.addressLocality}`
      },
      package: {
        packageNo: result.details?.totalNumberOfPieces,
        weight: result.details?.weight
          ? `${result.details.weight?.value} / ${result.details.weight?.unitText}`
          : "",
        size: result?.dimensions
          ? `${result?.dimensions?.length?.value}${result?.dimensions?.length?.unitText}x${result?.dimensions?.width?.value}${result?.dimensions?.width?.unitText}x${result.dimensions?.height?.value}${result.dimensions?.height?.unitText}`
          : "",
        image: result.proofOfDelivery?.documentUrl
          ? result.proofOfDelivery?.documentUrl
          : ""
      }
    };
    data.histories = groupHistoryDHL(result, data.packageDetail.status);
    data.logs = groupLogsDHL(result, data.packageDetail.status);
    return data;
  }

  return {};
};

const mappingDataUPS = (response) => {
  if (
    response.trackResponse?.shipment?.length > 0 &&
    response.trackResponse?.shipment[0]?.package?.length > 0
  ) {
    const result = response.trackResponse?.shipment[0]?.package[0];

    const fromLocation = result.packageAddress?.find((s) => s.type == "ORIGIN");
    const toLocation = result.packageAddress?.find(
      (s) => s.type == "DESTINATION"
    );

    const indexEstimate = result.activity?.findIndex(
      (s) => s.status?.code == "MP"
    );

    const estimatedPickUpDate =
      indexEstimate >= 0
        ? ConvertTextToDate(
            result.activity[indexEstimate].date,
            result.activity[indexEstimate].time
          )
        : "";

    const deliveryEstimate = ConvertTextToDate(
      result?.deliveryDate?.length > 0 && result?.deliveryDate[0]?.date
        ? result?.deliveryDate[0]?.date
        : "",
      result?.deliveryTime?.endTime
    );
    const deliveryDate = ConvertTextToDate(
      result?.deliveryDate?.length > 0 && result?.deliveryDate[0]?.date
        ? result?.deliveryDate[0]?.date
        : "",
      result?.deliveryTime?.endTime
    );
    let status = "Tiếp nhận đơn hàng";
    if (
      result.activity?.findIndex(
        (s) => s.status?.description.indexOf("DELIVERED") >= 0
      ) >= 0
    ) {
      status = "Giao hàng thành công";
    } else {
      status = "Đang vận chuyển";
    }
    const data = {
      packageDetail: {
        orderId: `${response.orderId}PS`,
        estimatedPickUpDate: estimatedPickUpDate
          ? formatDate(estimatedPickUpDate, ISO_8601)
          : "",
        estimatedDeliveryDate: deliveryEstimate
          ? formatDate(deliveryEstimate, ISO_8601)
          : "",
        expectedDeliveryDate: deliveryDate
          ? formatDate(deliveryDate, ISO_8601)
          : "",
        status: status,
        service:
          HideTextUps(result?.service?.description, true) ||
          "Giao hàng tiêu chuẩn"
      },
      sender: {
        fullName: "-",
        phoneNumber: "-",
        address: fromLocation?.address
          ? `${fromLocation?.address?.city}, ${GetCountryByCode(
              fromLocation?.address?.country
            )}`
          : ""
      },
      receiver: {
        fullName: "-",
        phoneNumber: "-",
        address: toLocation?.address
          ? `${toLocation?.address?.city}, ${GetCountryByCode(
              toLocation?.address?.country
            )}`
          : ""
      },
      package: {
        packageNo: result.packageCount,
        weight: result?.weight
          ? `${result?.weight?.weight} ${result?.weight?.unitOfMeasurement}`
          : "",
        size: "",
        image: ""
      }
    };

    data.histories = groupHistoryUPS(result);
    data.logs = groupLogsHistoryUPS(result);
    return data;
  }

  return {};
};

const useGetTracking = () => {
  const api = inject("api");
  const store = useStore();
  const errorMessage = ref(undefined);
  const isError = ref(false);

  const createDataCallApi = async () => {
    store.commit("delivery/setLoading", true);
    isError.value = false;
    errorMessage.value = "";
    const dataInput = store.getters["delivery/dataInput"];

    let response = {
      success: false,
      errorMessage: "Error"
    };
    switch (dataInput.deliveryName) {
      case "FD": {
        const type = CONFIG_API_DELIVERY_NAME.FED;
        const header = {
          "Content-Type": "application/json"
        };
        const payload = {
          grant_type: type.granType,
          client_id: type.clientId,
          client_secret: type.clientSecret
        };
        const data = { payload };
        const responseToken = await api.fedex.registerToken(
          header,
          data,
          type.baseApiToken
        );
        if (responseToken.success) {
          header.Authorization = `Bearer ${responseToken.access_token}`;

          const trackingData = {
            payload: {
              trackingInfo: [
                {
                  trackingNumberInfo: {
                    trackingNumber: dataInput.orderId
                  }
                }
              ],
              includeDetailedScans: true
            }
          };
          response = await api.fedex.tracking(
            header,
            trackingData,
            type.baseApiTracking
          );

          if (
            response.success &&
            response.output?.completeTrackResults?.length > 0 &&
            response.output?.completeTrackResults[0]?.trackResults?.length >
              0 &&
            !response.output?.completeTrackResults?.[0]?.trackResults[0]?.error
          ) {
            response.orderId = dataInput.orderId;
            const dataFedex = await mappingDataFedex(
              api,
              header.Authorization,
              type.document,
              response
            );

            store.commit("delivery/setResult", dataFedex);
            errorMessage.value = "";
            isError.value = false;
          } else {
            errorMessage.value = "Không tìm thấy thông tin đơn hàng";
            isError.value = true;
          }
        }
        isError.value = false;

        break;
      }
      case "NT": {
        const type = CONFIG_API_DELIVERY_NAME.NHT;
        const header = {
          username: type.clientId,
          password: type.clientSecret
        };
        const payload = {
          payload: {
            bill_code: dataInput.orderId
          }
        };
        response = await api.nhatTin.tracking(
          payload,
          header,
          type.baseApiTracking
        );
        const dataNhatTin = mappingDataNhatTin(response);
        if (!response.success || response.data?.length <= 0) {
          errorMessage.value = "Không tìm thấy thông tin đơn hàng";
          isError.value = true;
          store.commit("delivery/setResult", {
            packageDetail: null
          });
        } else {
          errorMessage.value = "";
          isError.value = false;
          store.commit("delivery/setResult", dataNhatTin);
        }

        break;
      }
      case "DL": {
        const type = CONFIG_API_DELIVERY_NAME.DHL;
        const header = {
          "DHL-API-Key": type.clientId
        };
        const payload = {
          payload: {
            trackingNumber: dataInput.orderId
          }
        };
        response = await api.dhl.tracking(
          payload,
          header,
          type.baseApiTracking
        );
        if (!response.success || response.data?.length <= 0) {
          errorMessage.value = "Không tìm thấy thông tin đơn hàng";
          isError.value = true;
          store.commit("delivery/setResult", {
            packageDetail: null
          });
        } else {
          const dataDhl = mappingDataDhl(response);
          errorMessage.value = "";
          isError.value = false;
          store.commit("delivery/setResult", dataDhl);
        }

        break;
      }
      case "PS": {
        const type = CONFIG_API_DELIVERY_NAME.UPS;
        const header = {
          "Content-Type": "application/json"
        };
        const payload = {
          grant_type: type.granType
        };
        const data = { payload };
        const responseToken = await api.ups.registerToken(
          header,
          data,
          type.baseApiToken
        );
        if (responseToken.success) {
          header.Authorization = `Bearer ${responseToken.access_token}`;

          const trackingData = {
            payload: {
              trackingNumber: dataInput.orderId
            }
          };
          response = await api.ups.tracking(
            header,
            trackingData,
            type.baseApiTracking
          );
          if (
            response.success &&
            response.trackResponse?.shipment?.length > 0 &&
            response.trackResponse?.shipment[0]
          ) {
            response.orderId = dataInput.orderId;
            const dataUps = await mappingDataUPS(response);

            store.commit("delivery/setResult", dataUps);
            errorMessage.value = "";
            isError.value = false;
          } else {
            errorMessage.value = "Không tìm thấy thông tin đơn hàng";
            isError.value = true;
          }
        }
        isError.value = false;

        break;
      }
      default:
        errorMessage.value = "Không tìm thấy thông tin đơn hàng";
        isError.value = true;
        store.commit("delivery/setResult", {
          packageDetail: null
        });
        break;
    }

    store.commit("delivery/setLoading", false);
  };
  return {
    errorMessage,
    createDataCallApi,
    isError
  };
};

export { useGetTracking };
