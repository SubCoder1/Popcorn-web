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
    <GangList
      :gang-data="gangData"
      :can-create="canCreateGang"
      :can-join="canJoinGang"
      v-if="gangData.length != 0"
    />
    <div class="h-auto" v-else>
      <template v-if="canCreateGang && canJoinGang">
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
      </template>
      <template v-else>
        <h4 v-if="canCreateGang">Create a Gang</h4>
        <h4 v-else>Join a Gang</h4>
        <router-link to="" @click="getUserGang(false)">Go back</router-link>
      </template>
      <GangJoin v-if="canJoinGang && createOrJoin" />
      <GangCreate v-else-if="canCreateGang" />
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
      canCreateGang: false,
      canJoinGang: false,
      createOrJoin: true, // Used for toggling
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
          res.status = 200;
          res.gang = response.data.gang;
          res.canJoinGang = response.data.canJoinGang;
          res.canCreateGang = response.data.canCreateGang;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res.status = e.response.status;
            // show the first validation issue received from server
          } else {
            // Server unreachable
            res.status = 503;
          }
        });
      return res;
    },
    getUserGang: async function (retry) {
      this.loading = true;
      const response = await this.getUserGangAPI();
      if (response.status == 200) {
        this.gangData = response.gang;
        this.canCreateGang = response.canCreateGang;
        this.canJoinGang = response.canJoinGang;
        this.createOrJoin = true;
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
    toggleCreateOrJoinGang: function () {
      this.createOrJoin = !this.createOrJoin;
    },
    showJoinGangOnly: function () {
      this.gangData = [];
      this.canCreateGang = false;
    },
    showCreateGangOnly: function () {
      this.gangData = [];
      this.canJoinGang = false;
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
