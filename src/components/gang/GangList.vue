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
  <div v-if="!loading" class="d-flex flex-column">
    <div
      class="d-flex flex-row justify-content-between mb-3"
      v-bind:key="gang"
      v-for="gang in gangData"
    >
      <div class="d-flex border-left ps-3">
        <div class="d-flex flex-column justify-content-center">
          <p class="text-sm mb-1">{{ gang.gang.gang_name }}</p>
          <p class="text-sm mb-1 text-secondary">
            Admin: {{ gang.gang.gang_admin }}
          </p>
          <p class="text-sm mb-1 text-secondary">
            {{ gang.members }} / {{ gang.gang.gang_member_limit }} members
          </p>
        </div>
      </div>
      <div class="d-flex flex-column">
        <p class="text-xsm text-secondary text-end">
          {{ gang.gang_created_timeago }}
        </p>
        <button
          v-if="gang.isAdmin"
          type="button"
          class="btn btn-sm rounded-md text-sm"
        >
          Customize
        </button>
        <button v-else type="button" class="btn btn-sm rounded-md text-sm">
          Join
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

export default {
  data() {
    return {
      loading: true,
      gangData: [],
    };
  },
  name: "GangList",
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
      const response = await this.getUserGangAPI();
      if (response.status == 200) {
        if (response.gang.length > 0) {
          // User has created a gang or has joined one
          this.gangData = response.gang;
          this.loading = false;
        } else {
          // Redirect to gang-create component
          this.$router.push({ name: "creategang" });
        }
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
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
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
