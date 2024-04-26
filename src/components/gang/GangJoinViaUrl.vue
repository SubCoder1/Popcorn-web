<!-- Join Gang via invite URL form component rendered through InviteViaUrlView -->

<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center text-m"
  >
    <lottie-player
      src="https://lottie.host/adf74d0d-5d5b-4783-9087-365bb02b9cd1/Giatsf5Zrg.json"
      background="transparent"
      speed="1"
      style="width: 300px; height: 300px"
      loop
      autoplay
      v-pre
    ></lottie-player>
    <div class="text-secondary text-center" v-if="showInvalidInvitePopup">
      <span>
        Oops! The invite URL seems to be
        <span class="highlight">INVALID</span>
        or <span class="highlight">EXPIRED</span>.
      </span>
      <button
        type="button"
        class="btn btn-sm text-sm rounded-md mt-3"
        @click="backToHome()"
      >
        Go Back
      </button>
    </div>
    <span
      class="text-secondary text-justify m-3"
      v-else-if="showLeaveGangPopup == false"
    >
      HANG ON TIGHT! We're adding you to
      <span class="highlight">{{ from }}'s</span> gang.
    </span>
    <div class="text-secondary text-justify m-3" v-else>
      <span>
        Looks like you already have your own gang:
        <span class="highlight">{{ gangStore.getUserGang.gang_name }}</span>
        <br />
        This gang will be <span class="highlight">DELETED</span>
        if you proceed to accept this invite.
      </span>
      <div class="d-flex justify-content-center mt-3">
        <button
          type="button"
          class="btn btn-sm text-sm rounded-md"
          @click="backToHome()"
        >
          Go Back
        </button>
        <button
          type="button"
          class="btn btn-sm text-sm rounded-md accept-invite ms-3"
          @click="acceptInvite(false)"
        >
          Accept
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store";
import { useGangStore } from "@/stores/gang.store";
import { useUserStore } from "@/stores/user.store";

export default {
  data() {
    return {
      from: this.$route.params.from,
      hashcode: this.$route.params.hashcode,
      gangStore: useGangStore(),
      userStore: useUserStore(),
      authStore: useAuthStore(),
      showLeaveGangPopup: false,
      showInvalidInvitePopup: false,
      userAllowedToDelGang: false,
    };
  },
  name: "GangJoinViaUrl",
  methods: {
    backToHome: function () {
      this.$router.push({ name: "home" });
    },
    joinViaURL: async function (retry) {
      if (!this.showLeaveGangPopup) {
        // First check if user has his/her own created gang
        let response = await this.gangStore.getGang();
        if (response == 200) {
          if (this.gangStore.getUserGang.is_admin) {
            // Leave & clear this gang first
            this.showLeaveGangPopup = true;
          } else {
            // proceed with acceptinvite
            await this.acceptInvite(false);
          }
        } else if (response == 401) {
          // Unauthorized
          if (retry == false) {
            // access_token expired, use refresh_token to refresh JWT
            // Try again on success
            const ref_token_resp = await this.authStore.refreshToken();
            if (ref_token_resp.status == 200) {
              await this.joinViaURL(true);
            }
          } else {
            // Not able to create gang even after refreshing token
            this.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.$parent.$parent.$parent.srvErrModal();
        }
      } else if (this.userAllowedToDelGang) {
        this.showLeaveGangPopup = false;
        // proceed with delgang
        const response = await this.gangStore.delGang();
        if (response == 200 || response == 404) {
          // proceed with acceptinvite
          await this.acceptInvite(false);
        } else if (response == 401) {
          // Unauthorized
          if (retry == false) {
            // access_token expired, use refresh_token to refresh JWT
            // Try again on success
            const ref_token_resp = await this.authStore.refreshToken();
            if (ref_token_resp.status == 200) {
              await this.joinViaURL(true);
            }
          } else {
            // Not able to create gang even after refreshing token
            this.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.$parent.$parent.$parent.srvErrModal();
        }
      }
    },
    acceptInvite: async function (retry) {
      const response = await this.gangStore.acceptInvite({
        gang_invite_hashcode: this.hashcode,
      });
      if (response == 200) {
        this.$router.replace({ name: "home" });
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const ref_token_resp = await this.authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.acceptInvite(true);
          }
        } else {
          // Not able to accept gang invite even after refreshing token
          this.$parent.$parent.$parent.srvErrModal();
        }
      } else if (response == 400) {
        // Invalid invite hashcode
        this.showInvalidInvitePopup = true;
      } else {
        this.$parent.$parent.$parent.srvErrModal();
      }
    },
  },
  async mounted() {
    await this.joinViaURL(false);
  },
};
</script>

<style scoped lang="css">
.highlight {
  color: rgb(241, 133, 121);
}

.text-m {
  font-size: 14px;
}
</style>
