const setDeliveryName = (context, data) => {
  if (data && data.length >= 2) {
    const orderId = data.substring(0, data.length - 2);
    const deliveryName = data.substring(data.length - 2);
    context.commit("setDataInput", {
      orderId: orderId,
      deliveryName: deliveryName.toUpperCase(),
    });
  } else {
    context.commit("setDataInput", {
      orderId: undefined,
      deliveryName: undefined,
    });
  }
};
export default {
  setDeliveryName,
};
