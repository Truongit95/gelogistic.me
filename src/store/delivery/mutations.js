const setDataInput = (state, data) => {
  state.data = data;
};

const setResult = (state, data) => {
  state.result = data;
};
const setLoading = (state, data) => {
  state.loading = data;
};
const setKeySearch = (state, data) => {
  state.data.dataSearch = data;
};

export default {
  setDataInput,
  setResult,
  setLoading,
  setKeySearch
};
