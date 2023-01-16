<!-- User profile component rendered through HomeView -->

<template>
  <div v-if="loading" class="user-profile-loader mb-3">
    <div class="d-flex flex-row">
      <div class="skeleton user-prof-skeleton-lg"></div>
      <div class="d-flex flex-column justify-content-center">
        <div class="skeleton skeleton-text mb-3"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  </div>
  <div v-if="!loading" class="user-profile"></div>
  <router-link to="{ name: 'auth' }" custom v-slot="{ href, navigate }" replace>
    <a
      :href="href"
      class="position-relative d-flex"
      @click="logout(navigate, $event)"
    >
      <div v-if="loggingOut" class="loader-1 position-absolute">
        <span />
      </div>
      Log out
    </a>
  </router-link>
</template>

<script>
import { useUserStore } from "@/stores/auth.store";

export default {
  name: "UserProfile",
  data() {
    return {
      loading: true,
      loggingOut: false,
    };
  },
  methods: {
    getUser: async function () {},
    logout: async function (navigate, event) {
      this.loggingOut = true;
      const authStore = useUserStore();
      const resp = await authStore.logout();
      if (resp.status <= 500) {
        // logout successful or access_token already expired
        // Proceed with router
        navigate(event);
      } else {
        // Server error
        // Stop router navigation and show Server error modal
        this.loggingOut = false;
        this.$parent.$parent.$parent.srvErrModal();
      }
    },
  },
};
</script>

<style scoped lang="css">
.user-prof-skeleton-lg {
  height: 64px;
  width: 64px;
  border-radius: 50%;
  margin-right: 1rem;
}

.start-logout-loader {
  left: 20px;
}
</style>
