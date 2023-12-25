import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

export default {
  namespaced: true,
  state: () => ({
    data: {
      orderId: undefined,
      deliveryName: undefined,
      dataSearch: true
    },
    result: {
      packageDetail: {
        orderId: undefined,
        estimatedPickUpDate: undefined,
        estimatedDeliveryDate: undefined,
        status: undefined,
        service: undefined
      },
      sender: {
        fullName: undefined,
        phoneNumber: undefined,
        address: undefined
      },
      receiver: {
        fullName: undefined,
        phoneNumber: undefined,
        address: undefined
      },
      package: {
        packageNo: undefined,
        weight: 0,
        size: undefined,
        image: ""
      },
      histories: [
        {
          locTime: undefined,
          details: [
            {
              locTime: undefined,
              operation: undefined,
              address: undefined
            }
          ]
        }
      ],
      logs: [
        {
          status: undefined,
          address: undefined,
          label: undefined,
          dateTime: undefined,
          dateTimeString: undefined,
          isActive:false
        }
      ]
    },
    loading: false
  }),
  getters,
  actions,
  mutations
};
