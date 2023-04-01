<!-- Gang Dashboard sub-view of Popcorn, rendered through HomeView. -->

<template>
  <div v-if="loading" class="d-flex flex-column">
    <div class="d-flex flex-row mb-3">
      <div class="skeleton user-prof-skeleton-md rounded-circle me-3"></div>
      <div class="d-flex flex-column justify-content-center">
        <div class="skeleton skeleton-text mb-3"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
    <div class="d-flex flex-row mb-3">
      <div class="skeleton user-prof-skeleton-md rounded-circle me-3"></div>
      <div class="d-flex flex-column justify-content-center">
        <div class="skeleton skeleton-text mb-3"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
    <div class="d-flex flex-row mb-3">
      <div class="skeleton user-prof-skeleton-md rounded-circle me-3"></div>
      <div class="d-flex flex-column justify-content-center">
        <div class="skeleton skeleton-text mb-3"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  </div>
  <div v-else class="d-flex flex-column">
    <GangList v-if="showGangList" />
    <div class="h-auto" v-else>
      <template v-if="gangStore.canCreateGang && gangStore.canJoinGang">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h4 v-if="createOrJoin">Join a Gang</h4>
            <h4 v-else>Create a Gang</h4>
            <template v-if="createOrJoin">
              <router-link to="" @click="toggleCreateOrJoinGang()">
                or create one?
              </router-link>
            </template>
            <template v-else>
              <router-link to="" @click="toggleCreateOrJoinGang()">
                or join one?
              </router-link>
            </template>
          </div>
          <div class="mt-1 mb-1">
            <p
              class="form-errors rounded-md text-sm"
              v-bind:class="{ 'show-error': showErr }"
            >
              {{ formErr }}
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h4 v-if="showCustomizePage">Customize Gang</h4>
            <h4 v-else-if="gangStore.canCreateGang">Create a Gang</h4>
            <h4 v-else>Join a Gang</h4>
            <router-link to="" @click="showGangList = true">
              Go back
            </router-link>
          </div>
          <div class="mt-1 mb-1">
            <p
              class="form-errors rounded-md text-sm"
              v-bind:class="{ 'show-error': showErr }"
            >
              {{ formErr }}
            </p>
          </div>
        </div>
      </template>
      <GangCustomize :gang="customizeGangData" v-if="showCustomizePage" />
      <GangJoin v-else-if="gangStore.canJoinGang && createOrJoin" />
      <GangCreate v-else />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store";
import { useGangStore } from "@/stores/gang.store";
import { defineAsyncComponent } from "vue";
import time2TimeAgo from "@/utils/timeago";

let sseClient;

export default {
  data() {
    return {
      loading: true,
      gangStore: useGangStore(),
      createOrJoin: true, // true -> join, false -> create
      showGangList: false,
      showCustomizePage: false,
      customizeGangData: {},
      showErr: false,
      formErr: "",
    };
  },
  name: "GangDashboard",
  methods: {
    getUserGang: async function (retry) {
      this.loading = true;
      const gangStore = useGangStore();
      const response = await gangStore.getGang();
      if (response == 200) {
        this.loading = false;
        if (Object.keys(this.gangStore.getUserGang).length > 0) {
          this.gangStore.userGang.gang_created = time2TimeAgo(
            this.gangStore.userGang.gang_created
          );
          this.showGangList = true;
        } else {
          this.showGangList = false;
        }
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.getUserGang(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.srvErrModal();
      }
    },
    delUserCreatedGang: async function (retry) {
      const response = await this.gangStore.delGang();
      if (response == 200) {
        await this.getUserGang(true);
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.delgang(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.srvErrModal();
      }
    },
    leaveUserJoinedGang: async function (retry) {
      const response = await this.gangStore.leaveGang();
      if (response == 200) {
        await this.getUserGang(true);
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.leaveUserJoinedGang(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.srvErrModal();
      }
    },
    // used when user can create and join a gang
    toggleCreateOrJoinGang: function () {
      this.createOrJoin = !this.createOrJoin;
    },
    showCustomizeGangOnly: function (gang) {
      this.showGangList = false;
      this.customizeGangData = gang;
      this.showCustomizePage = true;
    },
    // used in GangList component to switch to create or join gang view
    toggleGangList: function () {
      this.showCustomizePage = false;
      this.showGangList = !this.showGangList;
    },
    ErrPopUp: function (errMsg) {
      this.formErr = errMsg;
      this.showErr = true;
    },
    removeErr: function () {
      this.showErr = false;
      this.formErr = "";
    },
  },
  components: {
    GangList: defineAsyncComponent(() => import("./GangList.vue")),
    GangCreate: defineAsyncComponent(() => import("./GangCreate.vue")),
    GangJoin: defineAsyncComponent(() => import("./GangJoin.vue")),
    GangCustomize: defineAsyncComponent(() => import("./GangCustomize.vue")),
  },
  async mounted() {
    await this.getUserGang(false);

    sseClient = await this.$sse.create({
      url: process.env.VUE_APP_STREAM_API,
      format: "json",
      withCredentials: true,
      polyfill: true,
    });
    sseClient.connect().catch((err) => {
      // When this error is caught, it means the initial connection to the
      // events server failed.  No automatic attempts to reconnect will be made.
      console.error("Failed to connect to server", err);
    });

    // Handle incoming gangInvite messages from server
    sseClient.on("gangInvite", (msg) => {
      // Values used in GangInvite frontend
      msg.message.load_accept_btn = false;
      msg.message.load_reject_btn = false;
      msg.message.is_expired = false;
      msg.message.invite_sent_timeago = time2TimeAgo(
        msg.message.invite_sent_timeago
      );
      // Add the new invite in the array
      let f = this.gangStore.userGangInvites.findIndex(
        (e) => e.gang_admin == msg.message.gang_admin
      );
      if (f > -1) {
        this.gangStore.userGangInvites[f] = msg.message;
      } else {
        this.gangStore.userGangInvites.unshift(msg.message);
      }
    });
    // Handle incoming gangJoin messages from server
    sseClient.on("gangJoin", (msg) => {
      msg.message.load_boot_btn = false;
      this.gangStore.getUserGang.gang_members.push(msg.message);
      this.gangStore.getUserGang.gang_members_count += 1;
    });
    // Handle incoming gangBoot messages from server
    sseClient.on("gangBoot", async () => {
      await this.getUserGang(true);
    });
    // Handle incoming gangLeave messages from server
    sseClient.on("gangLeave", (msg) => {
      console.log(msg + " left the gang.");
    });

    // Catch any errors (ie. lost connections, etc.)
    sseClient.on("error", (e) => {
      console.error("lost connection or failed to parse!", e);

      // If this error is due to an unexpected disconnection, EventSource will
      // automatically attempt to reconnect indefinitely. You will _not_ need to
      // re-add your handlers.
    });
  },
  async beforeUnmount() {
    // Make sure to close the connection with the events server
    // when the component is destroyed, or we'll have ghost connections!
    sseClient.disconnect();
  },
};
</script>

<style scoped lang="css">
.border-left {
  animation: border-entry 0.15s forwards;
  -webkit-animation: border-entry 0.15s forwards;
}

@-webkit-keyframes border-entry {
  0% {
    border-left: 0px solid salmon;
  }
  50% {
    border-left: 3px solid salmon;
  }
  100% {
    border-left: 6px solid salmon;
  }
}

@keyframes border-entry {
  0% {
    border-left: 0px solid salmon;
  }
  50% {
    border-left: 3px solid salmon;
  }
  100% {
    border-left: 6px solid salmon;
  }
}

.btn-sm {
  width: 150px;
}
</style>
