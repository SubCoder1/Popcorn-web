<!-- User profile component rendered through HomeView -->

<template>
  <div class="user-profile">
    <div class="d-flex flex-row align-items-center justify-content-between">
      <div v-if="loading" class="d-flex flex-row">
        <div class="skeleton user-prof-skeleton-lg rounded-circle me-3"></div>
        <div class="d-flex flex-column justify-content-center">
          <div class="skeleton skeleton-text mb-3"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
      <div v-if="!loading" class="d-flex flex-row align-items-center">
        <img
          v-bind:src="require(`@/assets/profile/${user.profile_pic}`)"
          class="me-3 profile-pic-lg"
          alt="User profile picture"
        />
        <div class="d-flex flex-column justify-content-center">
          <p class="mb-1 text-sm">{{ user.full_name }}</p>
          <p class="mb-1 text-sm text-secondary">@{{ user.username }}</p>
          <router-link
            to="{ name: 'auth' }"
            custom
            v-slot="{ href, navigate }"
            replace
          >
            <a
              :href="href"
              class="h-20px"
              ref="logout"
              @click.prevent="logout(navigate, $event)"
            >
              <div class="loader" v-if="loggingOut"></div>
              <span v-if="!loggingOut">Log out</span>
            </a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

export default {
  name: "UserProfile",
  data() {
    return {
      loading: true,
      loggingOut: false,
      user: {
        full_name: "",
        username: "",
        profile_pic: "",
      },
    };
  },
  methods: {
    fillUserData: function () {
      const userStore = useUserStore();
      this.user.full_name = userStore.getUserFullName;
      this.user.username = userStore.getUserName;
      this.user.profile_pic = userStore.getUserProfPic;
      this.loading = false;
    },
    getUserData: async function (retry) {
      const userStore = useUserStore();
      const get_user_resp = await userStore.getUser();
      if (get_user_resp.status == 200) {
        // Successfully fetched and stored user data
        this.fillUserData();
      } else if (get_user_resp.status >= 500) {
        // Server error
        this.$parent.$parent.$parent.$parent.srvErrModal();
      } else if (get_user_resp.status == 401) {
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.getUserData(true);
          }
        } else {
          // Even after refreshing, can't fetch user data from server
          this.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Unknown error
        // Better to logout
        this.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
    logout: async function () {
      this.loggingOut = true;
      const authStore = useAuthStore();
      const resp = await authStore.logout();
      if (resp.status <= 500) {
        // logout successful or access_token already expired
        // Proceed with router
        this.$router.replace({ name: "auth" });
      } else {
        // Server error
        // Stop router navigation and show Server error modal
        this.loggingOut = false;
        this.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
  },
  async mounted() {
    await this.getUserData(false);
  },
};
</script>

<style scoped lang="css">
.user-prof-skeleton-lg {
  height: 64px;
  width: 64px;
}

.h-20px {
  height: 20px;
}
</style>
