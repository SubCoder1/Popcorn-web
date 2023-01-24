<!-- Join Gang form component rendered through HomeView -->

<template>
  <div
    class="d-flex align-items-center justify-content-between flex-wrap mb-3 mt-3"
  >
    <label for="gangName" class="text-sm">Search for a gang:</label>
    <input
      type="text"
      class="form-control text-sm rounded-md input-md"
      placeholder="Gang Name"
      v-model.trim="gang_name"
      @keyup="searchWithDelay(false)"
      autocomplete="off"
      required
    />
  </div>
  <div
    v-if="loading"
    class="search-box d-flex flex-column justify-content-center"
  >
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
  <div v-else class="search-box d-flex flex-column justify-content-center">
    <div v-if="searchResult.length == 0" class="text-center">
      <img
        class="empty-search-img m-auto"
        src="@/assets/misc/empty-search.png"
        alt="Empty search"
      />
      <p class="text-secondary text-sm mt-4">
        Your searches will show up here.
      </p>
    </div>
    <div v-else>
      <div
        class="d-flex flex-row justify-content-between mb-3"
        v-for="gang in searchResult"
        :key="gang.gang_admin"
      >
        <div
          class="d-flex ps-3"
          v-bind:class="{
            'br-left': !gang.is_admin,
            'admin-br-left': gang.is_admin,
            'exp-br-left': gang.is_expired != null && gang.is_expired,
          }"
        >
          <div class="d-flex flex-column justify-content-center">
            <p class="text-sm mb-1">{{ gang.gang_name }}</p>
            <p class="text-sm mb-1 text-secondary">
              Admin: {{ gang.gang_admin }}
            </p>
            <p class="text-sm mb-1 text-secondary">
              {{ gang.gang_members_count }}
              / {{ gang.gang_member_limit }} members
            </p>
          </div>
        </div>
        <div class="d-flex flex-column">
          <p class="text-xsm text-secondary text-end">
            {{ gang.gang_created_timeago }}
          </p>
          <button
            v-if="gang.is_admin"
            type="button"
            class="btn btn-sm rounded-md text-sm"
            :disabled="load_btn"
            v-bind:class="{ 'admin-btn': gang.is_admin }"
          >
            <div v-if="load_btn" class="loader-2 position-absolute">
              <span />
            </div>
            Customize
          </button>
          <button
            v-else-if="
              gang.gang_members_count < gang.gang_member_limit &&
              (gang.gang.is_expired == null || !gang.is_expired)
            "
            type="button"
            class="btn d-flex align-items-center justify-content-center position-relative btn-sm rounded-md text-sm"
            :disabled="load_btn"
            @click="joinGang(false, gang.gang_admin, gang.gang_name)"
          >
            <div v-if="load_btn" class="loader-2 position-absolute">
              <span />
            </div>
            Join
          </button>
          <button
            v-else
            type="button"
            class="btn btn-secondary btn-sm rounded-md text-sm"
            disabled
          >
            Expired
          </button>
        </div>
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
      gang_name: "",
      timeout: null,
      cursor: 0,
      loading: false,
      load_btn: false,
      searchResult: [],
    };
  },
  name: "GangJoin",
  methods: {
    searchAPI: async function () {
      let res = {};
      await axios
        .get(process.env.VUE_APP_SEARCH_GANG_API, {
          params: {
            gang_name: this.gang_name,
            cursor: this.cursor,
          },
          withCredentials: true,
        })
        .then((response) => {
          res.status = response.status;
          res.searchResult = response.data.result;
          res.cursor = response.data.page;
        })
        .catch((e) => {
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
    joinGangAPI: async function (gang_admin, gang_name) {
      let res = {};
      await axios
        .post(
          process.env.VUE_APP_JOIN_GANG_API,
          {
            gang_name: gang_name,
            gang_admin: gang_admin,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          res.status = response.status;
        })
        .catch((e) => {
          if (e.response) {
            // Server sent a response
            res.status = e.response.status;
          } else {
            // Server unreachable
            res.status = 503;
          }
        });
      return res;
    },
    searchWithDelay: async function (retry) {
      this.loading = true;
      this.searchResult = [];
      clearTimeout(this.timeout);

      this.timeout = setTimeout(async () => {
        const response = await this.searchAPI();
        if (response.status == 200) {
          this.searchResult = response.searchResult;
          this.cursor = response.cursor;
        } else if (response.status == 400) {
          // Bad request - validation issue or no data found
          this.loading = false;
        } else if (response.status == 401) {
          // Unauthorized
          if (retry == false) {
            // access_token expired, use refresh_token to refresh JWT
            // Try again on success
            const authStore = useAuthStore();
            const ref_token_resp = await authStore.refreshToken();
            if (ref_token_resp.status == 200) {
              await this.searchWithDelay(true);
            }
          } else {
            // Not able to search gang even after refreshing token
            this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }

        this.loading = false;
      }, 1000);
    },
    joinGang: async function (retry, gang_admin, gang_name) {
      this.load_btn = true;
      const response = await this.joinGangAPI(gang_admin, gang_name);
      if (response.status == 200) {
        // show fresh gang_list
        await this.$parent.$parent.getUserGang(false);
        this.load_btn = false;
      } else if (response.status == 400) {
        // gang not found, maybe expired
        // Mark this gang as expired
        var gangIndex = this.searchResult.findIndex(
          (x) => x.gang.gang_admin == gang_admin
        );
        this.searchResult[gangIndex].gang.is_expired = true;
      } else if (response.status == 401) {
        // unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.joinGang(true, gang_admin, gang_name);
          } else {
            // Not able to create gang even after refreshing token
            this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
      this.load_btn = false;
    },
  },
};
</script>

<style scoped lang="css">
.search-box {
  height: 288px;
}
</style>
