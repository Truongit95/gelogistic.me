<template>
  <div class="shipment-status" v-if="masterData?.logs?.length > 0">
    <div
      class="shipment-status-step"
      v-for="(item, index) in masterData.logs"
      :key="index"
      :class="index == masterData.logs.length - 1 ? 'active' : ''"
    >
      <div class="dot"></div>
      <div v-if="!item.isActive" class="over-bar"></div>
      <div class="status">{{ index == 0 ? "Gửi từ" : item.status }}</div>
      <div class="from">{{ item.address }}</div>
      <div
        class="status-end"
        v-if="item.label && (index == 0 || index == masterData.logs.length - 1)"
      >
        {{ item.label }}
      </div>
      <div class="oval animate" v-if="isDelivered && item.isCurrent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0,0,256,256"
        >
          <g
            fill="#ffffff"
            fill-rule="nonzero"
            stroke="none"
            stroke-width="1"
            stroke-linecap="butt"
            stroke-linejoin="miter"
            stroke-miterlimit="10"
            stroke-dasharray=""
            stroke-dashoffset="0"
            font-family="none"
            font-weight="none"
            font-size="none"
            text-anchor="none"
            style="mix-blend-mode: normal"
          >
            <g transform="scale(8,8)">
              <path
                d="M16,3c-7.16797,0 -13,5.83203 -13,13c0,7.16797 5.83203,13 13,13c7.16797,0 13,-5.83203 13,-13c0,-7.16797 -5.83203,-13 -13,-13zM16,5c6.08594,0 11,4.91406 11,11c0,6.08594 -4.91406,11 -11,11c-6.08594,0 -11,-4.91406 -11,-11c0,-6.08594 4.91406,-11 11,-11zM22.28125,11.28125l-7.28125,7.28125l-4.28125,-4.28125l-1.4375,1.4375l5,5l0.71875,0.6875l0.71875,-0.6875l8,-8z"
              ></path>
            </g>
          </g>
        </svg>
      </div>
      <div class="oval animate" v-if="!isDelivered && item.isCurrent">
        <svg
          width="100px"
          height="100px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#ffffff"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></circle>
            <path
              d="M17 12H7M17 12L13 8M17 12L13 16"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </div>
      <div class="date" v-if="item.dateTimeString">
        {{ item.dateTimeString }}
      </div>
    </div>

    <div class="progress-bar"></div>
    <div class="progress-bar-overlay"></div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "TrackingInfo",
  setup() {
    const store = useStore();

    const masterData = computed(() => store.state.delivery.result);

    const isDelivered = computed(() =>
      store.state.delivery.result.logs.every((item) => item.isActive)
    );

    return {
      masterData,
      isDelivered
    };
  }
};
</script>
<style scoped lang="css">
.shipment-status {
  position: relative;
  margin-left: 10px;
}
.shipment-status .shipment-status-step {
  padding: 10px 20px 20px 50px;
  position: relative;
}
.shipment-status .shipment-status-step .dot {
  position: absolute;
  width: 6px;
  height: 6px;
  z-index: 5;
  top: 16px;
  border-radius: 50%;
  left: 4px;
  background-color: #fff;
}
.shipment-status .shipment-status-step .oval {
  position: absolute;
  width: 60px;
  height: 60px;
  z-index: 6;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  left: -24px;
  background: rgb(0, 138, 0);
}
.shipment-status .shipment-status-step .oval svg {
  width: 35px;
  height: 35px;
}
.shipment-status .shipment-status-step.active {
  border-radius: 0 30px 30px 0;
  background-color: #f5f5f5;
}
.shipment-status .shipment-status-step .from {
  font-size: 14px;
  letter-spacing: -0.1px;
  line-height: 21px;
  white-space: pre-line;
}
.shipment-status .shipment-status-step .status {
  font-size: 12px;
  line-height: 19px;
  letter-spacing: 0.86px;
  text-transform: uppercase;
  display: block;
  font-weight: 700;
}
.shipment-status .shipment-status-step .status-end {
  font-size: 12px;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: 0.86px;
  font-style: italic;
  margin-top: 12px;
}
.shipment-status .shipment-status-step .date {
  font-size: 14px;
  letter-spacing: -0.1px;
  line-height: 21px;
  white-space: pre-line;
}

.shipment-status .progress-bar {
  position: absolute;
  top: 0;
  width: 14px;
  height: 100%;
  background-color: #e3e3e3;
  border-radius: 14px;
  left: 0;
}
.shipment-status .progress-bar-overlay {
  position: absolute;
  top: 0;
  width: 14px;
  height: 0;
  transition: all 0.7s ease-out;
  background-color: rgb(0, 138, 0);
  border-radius: 14px;
  left: 0;
  transition: all 0.7s ease-out 0s;
  height: 100%;
}
.shipment-status .over-bar {
  position: absolute;
  top: 0;
  width: 14px;
  height: 0;
  transition: all 0.7s ease-out;
  background-color: #cad2da;
  border-radius: 0;
  left: 0;
  transition: all 0.7s ease-out 0s;
  height: 101%;
  z-index: 1;
  border-radius: 50% 50% 0 0;
}
.shipment-status .shipment-status-step.active .over-bar {
  border-radius: 0 0 14px 14px;
}
</style>
