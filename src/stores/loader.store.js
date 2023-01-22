// Global store of loading indicator in Popcorn-web.
// Used during router.beforeEach and afterEach to show loading while the page component loads up.

import { defineStore } from "pinia";

export const useLoaderStore = defineStore("loader", {
  state: () => ({
    loading: false,
  }),
  getters: {
    showLoader: (state) => state.loading,
  },
});
