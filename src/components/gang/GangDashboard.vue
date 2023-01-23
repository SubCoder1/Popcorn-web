<!-- Gang Dashboard sub-view of Popcorn HomeView. -->

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
    <GangList :gang-data="this.gangData" v-if="gangData.length != 0" />
    <div class="h-auto" v-else>
      <h4 v-if="createGang">Create a Gang</h4>
      <h4 v-else>Join a Gang</h4>
      <template v-if="createGang">
        <router-link to="" v-on:click="showCreateOrJoinGang()">
          or join one?
        </router-link>
      </template>
      <template v-else>
        <router-link to="" v-on:click="showCreateOrJoinGang()">
          or create one?
        </router-link>
      </template>
      <GangCreate v-if="createGang" />
      <GangJoin v-else />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      loading: true,
      gangData: [],
      createGang: true,
    };
  },
  name: "GangDashboard",
  methods: {
    getUserGangAPI: async function () {
      let res = {};
      await axios
        .get(process.env.VUE_APP_GET_GANG_API, {
          withCredentials: true,
        })
        .then((response) => {
          // successfully created gang
          res["status"] = 200;
          res["gang"] = response.data;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.status;
            // show the first validation issue received from server
          } else {
            // Server unreachable
            res["status"] = 503;
          }
        });
      return res;
    },
    getUserGang: async function (retry) {
      this.loading = true;
      const response = await this.getUserGangAPI();
      if (response.status == 200) {
        this.gangData = response.gang;
        this.loading = false;
      } else if (response.status == 401) {
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
    showCreateOrJoinGang: function () {
      this.createGang = !this.createGang;
    },
  },
  components: {
    GangList: defineAsyncComponent(() => import("./GangList.vue")),
    GangCreate: defineAsyncComponent(() => import("./GangCreate.vue")),
    GangJoin: defineAsyncComponent(() => import("./GangJoin.vue")),
  },
  async mounted() {
    await this.getUserGang(false);
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
