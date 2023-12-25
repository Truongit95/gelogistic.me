import Fedex from "./fedex";
import UPS from "./ups";
import NHATTIN from "./nhattin";
import DHL from "./dhl";

export default (context) => {
  const repositories = {
    fedex: Fedex(context.axios),
    ups: UPS(context.axios),
    nhatTin: NHATTIN(context.axios),
    dhl: DHL(context.axios)
  };

  context.provide("api", repositories);
};
