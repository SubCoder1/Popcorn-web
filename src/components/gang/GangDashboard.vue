<!-- Gang Dashboard sub-view of Popcorn, rendered through HomeView. -->

<template>
  <div
    class="stream-player-loader d-flex align-items-center justify-content-center"
    v-if="gang_stream_loading"
  >
    <div class="loader"></div>
  </div>
  <div ref="remoteMediaContainer"></div>
  <div v-if="loading" class="d-flex flex-column p-4">
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
    <div class="d-flex flex-row">
      <div class="skeleton user-prof-skeleton-md rounded-circle me-3"></div>
      <div class="d-flex flex-column justify-content-center">
        <div class="skeleton skeleton-text mb-3"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  </div>
  <div v-else class="d-flex flex-column">
    <GangList v-if="showGangList" />
    <GangInteract v-else-if="showGangInteract" />
    <div class="h-auto" v-else>
      <template v-if="gangStore.canCreateGang && gangStore.canJoinGang">
        <div
          class="d-flex flex-wrap align-items-center justify-content-between p-4 pb-0"
        >
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
              class="form-errors rounded-md text-sm mb-0"
              v-bind:class="{ 'show-error': showErr, 'd-none': !showErr }"
            >
              {{ formErr }}
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="d-flex flex-wrap align-items-center justify-content-between p-4 pb-0"
        >
          <div class="dashboard-header">
            <h4 v-if="showCustomizePage">Customize Gang</h4>
            <h4 v-else-if="gangStore.canCreateGang">Create a Gang</h4>
            <h4 v-else>Join a Gang</h4>
            <router-link to="" @click="goBack()">Go back</router-link>
          </div>
          <div class="mt-1 mb-1">
            <p
              class="form-errors rounded-md text-sm"
              v-bind:class="{ 'show-error': showErr, 'd-none': !showErr }"
            >
              {{ formErr }}
            </p>
          </div>
        </div>
      </template>
      <GangCustomize v-if="showCustomizePage" />
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
import { ref } from "vue";

let sseClient;

let authStore = useAuthStore();

const remoteMediaContainer = ref(null);

export default {
  data() {
    return {
      loading: true,
      gangStore: useGangStore(),
      createOrJoin: true, // true -> join, false -> create
      showGangList: false,
      showCustomizePage: false,
      showGangInteract: false,
      showErr: false,
      formErr: "",
      gang_stream_loading: false,
      load_audio: false,
      load_video: false,
    };
  },
  name: "GangDashboard",
  methods: {
    getUserGang: async function (retry) {
      this.loading = true;
      const response = await this.gangStore.getGang();
      if (response == 200) {
        this.loading = false;
        if (Object.keys(this.gangStore.getUserGang).length > 0) {
          this.showGangList = true;
        } else {
          this.showGangList = false;
        }
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.getUserGang(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
    delUserCreatedGang: async function (retry) {
      const response = await this.gangStore.delGang();
      if (response == 200) {
        await this.getUserGang(false);
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.delUserCreatedGang(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.$parent.srvErrModal();
      }
      return response;
    },
    leaveUserJoinedGang: async function (retry) {
      const response = await this.gangStore.leaveGang();
      if (response == 200) {
        await this.getUserGang(false);
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.leaveUserJoinedGang(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.$parent.srvErrModal();
      }
      return response;
    },
    // used when user can create and join a gang
    toggleCreateOrJoinGang: function () {
      this.createOrJoin = !this.createOrJoin;
    },
    goBack: function () {
      this.showGangList = true;
      this.showCustomizePage = false;
      this.showGangInteract = false;
    },
    showCustomizeGangOnly: function (gang) {
      this.showGangList = false;
      this.showCustomizePage = true;
    },
    showGangInteractOnly: function () {
      this.showGangList = false;
      this.showGangInteract = true;
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
    showStream: function (media, type) {
      this.gang_stream_loading = false;
      if (type == "video" && !this.load_video) {
        this.load_video = true;
        this.$refs.remoteMediaContainer.appendChild(media);
      } else if (type == "audio" && !this.load_audio) {
        this.load_audio = true;
        this.$refs.remoteMediaContainer.appendChild(media);
      }
    },
    clearStream: function () {
      this.$refs.remoteMediaContainer.innerHTML = "";
      this.load_video = false;
      this.load_audio = false;
    },
  },
  components: {
    GangList: defineAsyncComponent(() => import("./GangList.vue")),
    GangCreate: defineAsyncComponent(() => import("./GangCreate.vue")),
    GangJoin: defineAsyncComponent(() => import("./GangJoin.vue")),
    GangCustomize: defineAsyncComponent(() => import("./GangCustomize.vue")),
    GangInteract: defineAsyncComponent(() => import("./GangInteract.vue")),
  },
  async mounted() {
    await this.getUserGang(false);

    sseClient = await this.$sse.create({
      url: process.env.VUE_APP_SSE_API,
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
      this.gangStore.getUserGang.gang_members_count =
        this.gangStore.getUserGang.gang_members.length;
      this.gangStore.getUserGangInteract.push({
        type: "gangJoin",
        message: msg.message,
      });
    });
    // Handle incoming gangBoot messages from server
    sseClient.on("gangBoot", async () => {
      await this.getUserGang(true);
    });
    // Handle incoming gangLeave messages from server
    sseClient.on("gangLeave", async (msg) => {
      await this.getUserGang(true);
      this.gangStore.getUserGangInteract.push({
        type: "gangLeave",
        message: msg.message,
      });
    });
    // Handle incoming gangUpdate messages from server
    sseClient.on("gangUpdate", async () => {
      this.gangStore.getUserGangInteract.push({
        type: "gangUpdate",
        message: "THE GANG HAS BEEN UPDATED",
      });
      await this.gangStore.getGang();
    });
    // Handle incoming gangDelete messages from server
    sseClient.on("gangDelete", async () => {
      await this.getUserGang(false);
    });
    // Handle incoming gangChat messages from server
    sseClient.on("gangMessage", (msg) => {
      this.gangStore.getUserGangInteract.push({
        type: "gangMessage",
        message: msg.message.text,
        user: msg.message.user,
      });
    });
    // Handle incoming gangPlayContent messages from server
    sseClient.on("gangPlayContent", () => {
      this.gangStore.getUserGang.gang_streaming = true;
      this.gang_stream_loading = true;
    });
    // Handle incoming gangEndContent messages from server
    sseClient.on("gangEndContent", async () => {
      this.gangStore.getUserGangInteract.push({
        type: "gangUpdate",
        message: "THE STREAM HAS ENDED",
      });
      await this.gangStore.getGang();
      this.clearStream();
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

.stream-player-loader {
  height: 405px;
  border-radius: 0.5rem 0.5rem 0 0;
  width: auto;
  background: rgb(43, 42, 51);
}
</style>
