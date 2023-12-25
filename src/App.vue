<template>
  <header class="header">
    <div class="container">
      <div class="row">
        <div class="search-header col-md-10 col-sm-10 col-10">
          <div class="form-search">
            <div class="input-search">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng"
                v-model="value"
                @keypress.enter="onSearch"
              />
            </div>
          </div>
        </div>
        <div class="search-header col-md-2 col-sm-2 col-2">
          <a href="javascript:;" class="btn-search" @click="onSearch">
            <svg
              width="18"
              height="18"
              viewBox="0 0 512 512"
              enable-background="new 0 0 512 512"
              class="icon-white width-16"
            >
              <g>
                <path
                  d="M495,466.2L377.2,348.4c29.2-35.6,46.8-81.2,46.8-130.9C424,103.5,331.5,11,217.5,11C103.4,11,11,103.5,11,217.5   S103.4,424,217.5,424c49.7,0,95.2-17.5,130.8-46.7L466.1,495c8,8,20.9,8,28.9,0C503,487.1,503,474.1,495,466.2z M217.5,382.9   C126.2,382.9,52,308.7,52,217.5S126.2,52,217.5,52C308.7,52,383,126.3,383,217.5S308.7,382.9,217.5,382.9z"
                ></path>
              </g>
            </svg>
            <span>Tra cứu đơn hàng</span>
          </a>
        </div>
      </div>
    </div>
  </header>
  <div v-if="loading" class="overload">
    <span class="loader"></span>
    <span class="description">Đang tìm kiếm vận đơn</span>
  </div>
  <div class="main-body">
    <Home v-if="!loading" />
  </div>
</template>
<script>
import { useGetTracking } from "./composables/delivery";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
import { createToaster } from "@meforma/vue-toaster";
import Home from "./views/HomeView.vue";
import { useRoute } from "vue-router";

export default {
  name: "HeaderLayout",
  components: { Home },

  setup() {
    const value = ref("");
    const store = useStore();
    const route = useRoute();

    const { createDataCallApi } = useGetTracking();
    const toaster = createToaster({
      position: "top-right"
    });

    // Lấy giá trị của tham số "trackingCode" từ query string của URL
    const trackingCode = computed(() => route?.query?.order);
    watch(trackingCode, () => {
      if (trackingCode.value) {
        value.value = trackingCode.value;
        store.commit("delivery/setKeySearch", trackingCode.value);
        // Thực hiện các hành động khi có tracking code
        store.dispatch("delivery/setDeliveryName", trackingCode.value);
        createDataCallApi();
      }
    });

    const onSearch = () => {
      store.commit("delivery/setKeySearch", value.value.trim());
      if (!value.value || value.value.length <= 2) {
        toaster.warning(`Vui lòng nhập đúng mã đơn hàng!`);
      } else {
        trackingCode.value = value.value.trim();

        setUrl();
      }
    };
    const loading = computed(() => store.state.delivery.loading);
    const masterData = computed(() => store.state.delivery.result);

    watch(masterData, () => {
      if (!masterData.value.packageDetail?.orderId) {
        toaster.warning("Không tìm thấy thông tin đơn hàng");
      } else {
        toaster.success(`Tra cứu đơn hàng thành công!`);
      }
    });

    const setUrl = () => {
      const currentUrl = window.location.href;

      // Tạo một đối tượng URL từ URL hiện tại
      const url = new URL(currentUrl);

      // Đặt giá trị mới cho tham số "order" trong query string
      url.searchParams.set("order", value.value);
      // Thay đổi URL
      window.location.replace(url.href);
    };
    return {
      onSearch,
      value,
      loading
    };
  }
};
</script>
<style scoped lang="css">
.main-body {
  min-height: 300px;
}
.overload {
  box-sizing: border-box;
  position: fixed;
  z-index: 10;
  left: 50%;
  transform: translate(-50%, 30%);
  top: 20%;
  width: 200px;
  height: 100px;
}

.overload .description {
  position: absolute;
  top: 58px;
  color: #ff3d00;
  font-size: 14px;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
