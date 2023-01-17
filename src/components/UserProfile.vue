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
      <div v-if="!loading" class="d-flex flex-row">
        <img
          v-bind:src="require(`@/assets/profile/${user.profile_pic}`)"
          class="me-3"
          alt="User profile picture"
        />
        <div class="d-flex flex-column justify-content-center">
          <p class="mb-1 text-sm">{{ user.full_name }}</p>
          <p class="m-0 text-sm">@{{ user.username }}</p>
          <router-link
            to="{ name: 'auth' }"
            custom
            v-slot="{ href, navigate }"
            replace
          >
            <a
              :href="href"
              class="h-fit-content d-flex w-100px"
              ref="logout"
              @click.prevent="logout(navigate, $event)"
            >
              Log out
              <div v-if="loggingOut" class="loader-1 ms-3">
                <span />
              </div>
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
    getUserData: async function () {
      const userStore = useUserStore();
      const get_user_resp = await userStore.getUser();
      if (get_user_resp.status == 200) {
        // Successfully fetched and stored user data
        this.fillUserData();
      } else if (get_user_resp.status >= 500) {
        // Server error
        this.$parent.$parent.$parent.srvErrModal();
      } else if (get_user_resp.status == 401) {
        // access_token expired, use refresh_token to refresh JWT
        const authStore = useAuthStore();
        const ref_token_resp = await authStore.refreshToken();
        if (ref_token_resp.status == 200) {
          // Successfully refreshed JWT auth token for user
          // Try to fetch user data again
          const get_user_resp_2 = await userStore.getUser();
          if (get_user_resp_2.status == 200) {
            // Successfully fetched and stored user data
            this.fillUserData();
          } else if (get_user_resp.status >= 500) {
            // Server error
            this.$parent.$parent.$parent.srvErrModal();
          } else {
            // logout as only possible outcome is 404 (User not found) or 401 again
            this.$refs.logout.click();
          }
        } else if (ref_token_resp.status >= 500) {
          // Server error
          this.$parent.$parent.$parent.srvErrModal();
        } else {
          // logout as only possible outcome is 401 (access_token invalid or expired)
          this.$refs.logout.click();
        }
      } else {
        // Unknown error
        // Better to logout
        this.$refs.logout.click();
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
        this.$parent.$parent.$parent.srvErrModal();
      }
    },
  },
  async mounted() {
    await this.getUserData();
  },
};
</script>

<style scoped lang="css">
.user-prof-skeleton-lg {
  height: 64px;
  width: 64px;
}

.start-logout-loader {
  left: 20px;
}

.w-100px {
  width: 95px;
}
</style>
