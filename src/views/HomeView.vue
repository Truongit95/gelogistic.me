<template>
  <div
    class="empty container"
    v-if="
      (!dataSearch || dataSearch.length == 0) &&
      !masterData?.packageDetail?.orderId
    "
  >
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      fill="none"
      class="empty-state-icon"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.268694 128.784C-3.19641 80.3388 27.1467 36.0407 74.2982 35.014C121.45 33.9873 125.369 89.724 162.648 91.7636C199.927 93.8033 255.61 57.7541 289.862 106.388C324.115 155.023 269.763 258 154.144 258C38.5257 258 3.73379 177.228 0.268694 128.784Z"
        fill="#F5F5F5"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M153.796 257.931C200.629 257.931 237.412 241.052 262.331 217.734C259.695 204.654 255.555 191.081 250.064 177.491C228.831 124.945 190.472 119.861 148.515 122.269C117.857 124.029 94.7436 131.944 77.8005 143.483C8.79337 182.543 5.60775 252.428 38.1399 262.446C59.4009 268.993 78.6492 256.938 89.5069 247.711C107.477 254.141 128.739 257.931 153.796 257.931Z"
        fill="#D9D9D9"
      ></path>
      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="18"
        y="121"
        width="245"
        height="144"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M153.796 257.931C200.629 257.931 237.412 241.052 262.331 217.734C259.694 204.654 255.555 191.081 250.063 177.491C228.831 124.945 190.472 119.861 148.515 122.269C117.857 124.029 94.7436 131.944 77.8005 143.483C8.79333 182.543 5.60771 252.428 38.1399 262.446C59.4009 268.993 78.6491 256.938 89.5069 247.711C107.477 254.141 128.739 257.931 153.796 257.931Z"
          fill="white"
        ></path>
      </mask>
      <g mask="url(#mask0)">
        <path
          d="M114.34 144.201C113.292 156.253 114.34 154.233 114.34 167.034C114.34 174.527 118.333 195.072 107.615 220.968C102.545 233.217 95.248 244.556 88.7878 250.835"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="bevel"
        ></path>
      </g>
      <path
        d="M84.4666 179.361C89.9617 170.958 94.8212 164.644 95.1632 160.05C95.6799 153.11 95.6811 147.933 97.0844 143.518"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      ></path>
      <path
        d="M109.008 137.067C109.008 137.067 103.526 141.413 102.893 151.334"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      ></path>
      <path
        d="M105.215 135.803C105.215 135.803 99.7331 140.149 99.0997 150.07"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      ></path>
      <path
        d="M110.698 140.63C110.698 140.63 108.472 142.727 108.472 153.578"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      ></path>
      <path
        d="M114.119 117.29L110.236 116.847C111.982 113.802 111.367 109.186 108.392 102.998"
        stroke="#D9D9D9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M94.0633 96.3809C96.1601 93.5475 99.1815 92.1952 103.127 92.3238"
        stroke="#D9D9D9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M114.771 97.3682C116.868 94.5349 119.889 93.1825 123.835 93.3111"
        stroke="#D9D9D9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M116.035 103.69C118.132 100.856 121.154 99.5038 125.099 99.6324"
        stroke="#D9D9D9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M125.411 137.194C124.432 136.053 123.251 135.077 121.87 134.265C115.864 130.734 105.744 130.792 101.348 122.211C96.9526 113.631 102.419 117.583 92.4982 97.9059C88.4116 89.8008 88.873 82.096 93.8826 74.7915V74.7915"
        stroke="#D9D9D9"
        stroke-width="1.5"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M103.851 110.545C102.887 110.954 101.552 109.983 100.87 108.377C100.188 106.77 100.417 105.135 101.381 104.726C102.345 104.317 103.679 105.288 104.361 106.895C105.043 108.501 104.815 110.136 103.851 110.545Z"
        fill="#D9D9D9"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M88.4242 85.1802C84.7174 83.6706 77.4693 73.4464 86.4745 65.7059C96.2122 57.3359 128.822 53.2719 140.524 64.4812C151.983 75.4574 146.854 103.398 140.524 110.176C138.668 112.163 138.738 110.688 140.24 107.753C143.012 102.335 143.316 96.9567 138.694 96.7637C137.214 96.7019 137.339 108.202 136.597 108.987C135.98 109.64 134.226 108.928 133.296 106.501C132.367 104.073 131.942 96.1594 131.307 93.1035C129.32 83.5291 125.483 74.0168 119.277 78.199C101.306 90.3076 92.1309 86.6897 88.4242 85.1802Z"
        fill="#D9D9D9"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M108 125C108 125 108 120.769 113.865 117.095C119.731 113.422 133 116.189 133 116.189L108 125Z"
        fill="#D9D9D9"
      ></path>
      <path
        d="M96.1984 126.993L101.306 141.026"
        stroke="#D9D9D9"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M96.1985 126.993C104.072 124.127 108.132 115.421 105.266 107.548C102.4 99.6744 93.6943 95.6148 85.8208 98.4805C77.9474 101.346 73.8878 110.052 76.7535 117.925C79.6192 125.799 88.325 129.859 96.1985 126.993Z"
        stroke="#D9D9D9"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      ></path>
    </svg>
    <div class="empty-state">Mã đơn hàng không đúng</div>
    <div class="empty-state-description">
      Chúng tôi không tìm thấy mã đơn hàng của bạn trong hệ thống.<br />Vui lòng
      kiểm tra lại mã đơn hàng.
    </div>
  </div>

  <div
    class="empty container"
    v-else-if="dataSearch && (masterData || !masterData.packageDetail?.orderId)"
  >
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      fill="none"
      class="empty-state-icon"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M118.362 261.763C79.4398 259.503 -13.5848 213.999 7.5238 136.987C28.6324 59.9759 120.59 98.6321 156.208 84.4762C183.246 73.7304 187.336 24.1194 243.484 33.693C266.549 37.6257 286.448 57.9997 293.406 92.2673C306.147 155.013 276.727 195.648 266.86 207.629C222.28 261.763 167.442 264.612 118.362 261.763Z"
        fill="#F5F5F5"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M279.239 261.763C252.44 293.998 204.697 301.978 140.943 262.507C133.322 262.494 125.776 262.193 118.362 261.763C107.141 261.111 91.4228 256.865 75.2394 249.307C61.8904 222.638 44.5069 111.18 162.998 104.377C199.908 102.257 260.561 106.731 279.239 152.967C296.553 195.829 298.591 238.485 279.239 261.763Z"
        fill="#D9D9D9"
      ></path>
      <path
        d="M119.02 241.047C119.02 241.047 143.734 217.614 170.947 217.614C198.161 217.614 228.439 241.047 228.439 241.047"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="bevel"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M26.4483 213.8C52.4394 243.586 95.0797 260.411 118.362 261.763C122.441 262 126.561 262.197 130.711 262.329L117.825 213.36H26.3325L26.4483 213.8Z"
        fill="#D9D9D9"
      ></path>
      <path
        d="M149.546 89.3099L144.467 86.5695C144.467 86.5695 150.939 81.4077 147.976 70.8561C147.634 69.6357 147.283 68.6474 146.816 67.7851"
        stroke="#D9D9D9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M164.774 57.0487C164.774 57.0487 160.692 60.9218 154.525 59.6258"
        stroke="#D9D9D9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M132.857 61.0389C132.857 61.0389 136.939 57.1658 143.106 58.4618"
        stroke="#D9D9D9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M136.19 41.0283C129.59 47.7581 127.682 55.748 130.468 64.9979C137.229 87.4546 132.23 82.3018 135.251 92.1074C138.272 101.913 148.89 103.722 154.532 108.533C160.175 113.344 159.746 121.566 159.746 121.566"
        stroke="#D9D9D9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M164.736 92.2039C164.736 92.2039 161.079 90.2262 156.34 92.9552"
        stroke="#D9D9D9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M140.298 80.2255C139.574 80.3927 138.716 79.3543 138.382 77.9062C138.047 76.4581 138.363 75.1487 139.087 74.9816C139.811 74.8144 140.669 75.8528 141.004 77.3009C141.338 78.7489 141.022 80.0584 140.298 80.2255Z"
        fill="#D9D9D9"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M161.957 76.4065C161.233 76.5736 160.375 75.5352 160.041 74.0872C159.706 72.6391 160.022 71.3297 160.746 71.1625C161.47 70.9954 162.328 72.0338 162.663 73.4818C162.997 74.9299 162.681 76.2393 161.957 76.4065Z"
        fill="#D9D9D9"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M129.928 48.1676C129.928 48.1676 149.24 41.9566 164.709 43.0819C171.507 43.5765 172.57 64.7755 171.747 76.4484C174.242 74.7839 175.337 71.3831 179.066 72.2024C183.912 73.2672 182.59 78.8916 178.652 84.0985C176.519 86.9189 176.17 88.4645 178.5 86.7111C186.45 80.7302 190.55 72.5384 190.799 62.1355C191.283 41.9566 174.711 28.0336 155.758 29.8865C136.804 31.7395 129.928 48.1676 129.928 48.1676Z"
        fill="#D9D9D9"
      ></path>
    </svg>
    <div class="empty-state">Chưa nhập mã đơn hàng</div>
    <div class="empty-state-description">
      Vui lòng nhập mã đơn hàng để kiểm tra
    </div>
  </div>
  <main class="main" v-else>
    <section class="info-order">
      <div class="container">
        <div class="row">
          <div class="pt-10 m-b-20 col-lg-6 col-md-6 col-12">
            <div class="header-order">
              <div class="title">THÔNG TIN ĐƠN HÀNG</div>
              <div v-if="masterData.packageDetail.orderId">
                <div class="table-row">
                  <div class="label">
                    <div>Mã đơn hàng:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">{{
                        masterData.packageDetail.orderId
                      }}</span></span
                    >
                  </div>
                </div>
              </div>
              <div v-if="masterData.packageDetail.estimatedPickUpDate">
                <div class="table-row">
                  <div class="label">
                    <div>Ngày lấy dự kiến:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">
                        {{ masterData.packageDetail.estimatedPickUpDate }}</span
                      ></span
                    >
                  </div>
                </div>
              </div>
              <div v-if="masterData.packageDetail.estimatedDeliveryDate">
                <div class="table-row">
                  <div class="label">
                    <div>Ngày giao dự kiến:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">
                        {{
                          masterData.packageDetail.estimatedDeliveryDate
                        }}</span
                      ></span
                    >
                  </div>
                </div>
              </div>
              <div v-if="masterData.packageDetail.expectedDeliveryDate">
                <div class="table-row">
                  <div class="label">
                    <div>Ngày giao thực tế:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">
                        {{
                          masterData.packageDetail.expectedDeliveryDate
                        }}</span
                      ></span
                    >
                  </div>
                </div>
              </div>
              <div v-if="masterData.packageDetail?.service">
                <div class="table-row">
                  <div class="label">
                    <div>Dịch vụ vận chuyển:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">{{
                        masterData.packageDetail.service
                      }}</span></span
                    >
                  </div>
                </div>
              </div>
              <div>
                <div class="table-row">
                  <div class="label">
                    <div>Địa chỉ người gửi:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">{{
                        masterData.sender?.address
                      }}</span></span
                    >
                  </div>
                </div>
              </div>
              <div>
                <div class="table-row">
                  <div class="label">
                    <div>Địa chỉ người nhận:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">{{
                        masterData.receiver?.address
                      }}</span></span
                    >
                  </div>
                </div>
              </div>
              <div v-if="masterData.packageDetail.status">
                <div class="table-row">
                  <div class="label">
                    <div>Trạng thái hiện tại:</div>
                  </div>
                  <div class="value">
                    <div class="status">
                      {{ masterData.packageDetail.status }}
                    </div>
                    <br /><span class="block-center block-left block-wrap"
                      ><span class="text-normal"></span
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-10 m-b-20 col-lg-3 col-md-3 col-12">
            <div class="header-order">
              <div class="title">THÔNG TIN GÓI HÀNG</div>
              <div v-if="masterData.package?.weight">
                <div class="table-row">
                  <div class="label">
                    <div>Trọng lượng:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">{{
                        masterData.package.weight
                      }}</span></span
                    >
                  </div>
                </div>
              </div>
              <div v-if="masterData.package?.size">
                <div class="table-row">
                  <div class="label">
                    <div>Kích thước:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">{{ masterData.package.size }}</span></span
                    >
                  </div>
                </div>
              </div>
              <div v-if="masterData.package?.packageNo">
                <div class="table-row">
                  <div class="label">
                    <div>Tổng số kiện:</div>
                  </div>
                  <div class="value">
                    <span class="block-center block-left block-wrap"
                      ><span class="">{{
                        masterData.package.packageNo
                      }}</span></span
                    >
                  </div>
                </div>
              </div>
              <div v-if="masterData.package?.image">
                <img
                  width="300"
                  height="226"
                  :src="masterData.package.image"
                  class="attachment-medium"
                  sizes="(max-width: 300px) 100vw, 300px"
                />
              </div>
            </div>
          </div>
          <div class="pt-10 m-b-20 col-lg-3 col-md-3 col-12">
            <TrackingInfo />
          </div>
        </div>
      </div>
    </section>

    <section class="info-order">
      <div class="container">
        <div class="row">
          <div class="header-order">
            <div class="title">
              HÀNH TRÌNH ĐƠN HÀNG - MÚI GIỜ: GMT+7:00 (VIỆT NAM)
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="history-section" v-if="masterData.histories?.length > 0">
      <div class="container">
        <div class="order-history">
          <div
            class="item"
            v-for="(item, index) in masterData.histories"
            :key="index"
          >
            <div class="day">{{ item.locTimeString }}</div>
            <div class="box-right" v-if="item.details?.length > 0">
              <div
                class="info"
                v-for="(detail, indexDetail) in item.details"
                :key="indexDetail"
                :class="
                  index == masterData.histories.length - 1 &&
                  indexDetail == item.details.length - 1
                    ? ' final'
                    : ''
                "
              >
                <div class="time">
                  {{ detail.time }}
                  <img
                    src="../assets/images/lasted.svg"
                    v-if="
                      index == masterData.histories.length - 1 &&
                      indexDetail == item.details.length - 1
                    "
                  />
                </div>
                <div class="status">
                  <span>{{ detail.operation }} </span>
                  <span v-if="detail.exceptionDescription" class="note"
                    ><br />{{ detail.exceptionDescription }}</span
                  >
                </div>
                <div class="local">{{ detail.address }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import TrackingInfo from "../components/TrackingInfo.vue";

export default {
  name: "MainLayout",
  components: { TrackingInfo },
  setup() {
    const value = ref("");
    const store = useStore();

    const masterData = computed(() => store.state.delivery.result);
    const dataSearch = computed(() => store.state.delivery.data.dataSearch);
    return {
      value,
      masterData,
      dataSearch
    };
  }
};
</script>
<style scoped lang="css">
.attachment-medium {
  margin-top: 20px;
}
</style>
