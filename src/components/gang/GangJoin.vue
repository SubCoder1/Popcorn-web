<!-- Join Gang form component rendered through HomeView -->

<template>
  <div
    class="modal fade"
    v-show="showPassKeyModal"
    v-bind:class="{ show: showPassKeyModal, 'd-block': showPassKeyModal }"
    refs="PassKeyModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0">
        <form @submit.prevent="joinGang(false)" class="gang-join-form">
          <div class="modal-body text-sm text-justify">
            <label for="gangPassKey" class="text-sm mb-3">
              Enter Passkey for
              <strong>{{ gang_join.gang_name }}</strong>
              :
            </label>
            <input
              type="password"
              class="form-control text-sm rounded-md mb-3"
              v-bind:class="{ 'pass-key-err': gang_join.passKeyErr }"
              @click="gang_join.passKeyErr = false"
              placeholder="Passkey"
              id="gangPassKey"
              v-model.trim="gang_join.gang_pass_key"
              minlength="5"
              autocomplete="off"
              required
            />
          </div>
          <div class="modal-footer border-0">
            <button
              type="submit"
              class="btn btn-sm d-flex align-items-center justify-content-center rounded-md text-sm"
              :disabled="load_btn"
            >
              <div class="loader" v-if="load_btn"></div>
              <span v-if="!load_btn">Submit</span>
            </button>
            <button
              type="button"
              class="btn modal-close-btn rounded-md text-sm"
              data-bs-dismiss="modal"
              @click="togglePassKeyModal('', '')"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div
    class="d-flex align-items-center justify-content-between flex-wrap pe-4 ps-4 pb-4"
  >
    <label for="gangName" class="text-sm">Search for a gang:</label>
    <input
      type="text"
      class="form-control text-sm rounded-md input-md"
      placeholder="Search by gang name"
      v-model.trim="gang_search.gang_name"
      @keyup="searchWithDelay(false)"
      autocomplete="off"
      required
    />
  </div>
  <div
    class="search-result-parent d-flex flex-column p-4"
    id="gang-search-parent"
  >
    <div v-show="load_search">
      <div class="h-auto d-flex flex-column justify-content-center">
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
        <div class="d-flex flex-row mb-2-5">
          <div class="skeleton user-prof-skeleton-md rounded-circle me-3"></div>
          <div class="d-flex flex-column justify-content-center">
            <div class="skeleton skeleton-text mb-3"></div>
            <div class="skeleton skeleton-text"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!load_search && searchResult.length == 0" class="text-center">
      <img
        class="empty-search-img m-auto"
        src="@/assets/misc/empty-search.png"
        alt="Empty search"
      />
      <p class="text-secondary text-sm mt-3">
        Your searches will show up here.
      </p>
    </div>
    <transition-group v-show="searchResult.length != 0" name="fade" tag="div">
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
          <template v-if="!gang.is_admin">
            <button
              v-if="
                gang.gang_members_count < gang.gang_member_limit &&
                (gang.is_expired == null || !gang.is_expired)
              "
              type="button"
              class="btn d-flex align-items-center justify-content-center position-relative btn-sm rounded-md text-sm join-btn"
              :disabled="load_btn"
              @click="togglePassKeyModal(gang.gang_name, gang.gang_admin)"
            >
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
          </template>
        </div>
      </div>
    </transition-group>
  </div>
  <div v-if="showPassKeyModal" class="modal-backdrop fade show"></div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { useGangStore } from "@/stores/gang.store";

export default {
  data() {
    return {
      gang_search: {
        gang_name: "",
        cursor: 0,
      },
      gang_join: {
        gang_name: "",
        gang_admin: "",
        gang_pass_key: "",
        passKeyErr: false,
      },
      timeout: null,
      load_search: false,
      load_btn: false,
      searchResult: [],
      showPassKeyModal: false,
    };
  },
  name: "GangJoin",
  methods: {
    searchAPI: async function () {
      let res = {};
      await axios
        .get(process.env.VUE_APP_SEARCH_GANG_API, {
          params: {
            gang_name: this.gang_search.gang_name,
            cursor: this.gang_search.cursor,
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
    searchWithDelay: async function (retry) {
      this.load_search = true;
      this.searchResult = [];
      clearTimeout(this.timeout);

      this.timeout = setTimeout(async () => {
        const response = await this.searchAPI();
        if (response.status == 200) {
          this.load_search = false;
          this.searchResult = response.searchResult;
          this.cursor = response.cursor;
        } else if (response.status == 400) {
          // Bad request - validation issue or no data found
          this.load_search = false;
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
            this.showPassKeyModal = false;
            this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.showPassKeyModal = false;
          this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      }, 1000);
    },
    joinGang: async function (retry) {
      if (this.validatePassKey()) {
        this.load_btn = true;
        const gangStore = useGangStore();
        const response = await gangStore.joinGang(this.gang_join);
        if (response.status == 200) {
          // show fresh gang_list
          this.load_btn = false;
          await this.$parent.$parent.getUserGang(false);
        } else if (response.status == 400) {
          // gang not found, maybe expired
          // Mark this gang as expired
          var gangIndex = this.searchResult.findIndex(
            (x) => x.gang_admin == this.gang_join.gang_admin
          );
          this.searchResult[gangIndex].is_expired = true;
          this.showPassKeyModal = false;
        } else if (response.status == 401) {
          if (response.error == "PassKey didn't match") {
            // passkey didn't match
            this.gang_join.passKeyErr = true;
          } else if (retry == false) {
            // unauthorized
            // access_token expired, use refresh_token to refresh JWT
            // Try again on success
            const authStore = useAuthStore();
            const ref_token_resp = await authStore.refreshToken();
            if (ref_token_resp.status == 200) {
              await this.joinGang(true);
            } else {
              // Not able to create gang even after refreshing token
              this.showPassKeyModal = false;
              this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
            }
          }
        } else {
          // Server error
          this.showPassKeyModal = false;
          this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
        this.load_btn = false;
      }
    },
    validatePassKey: function () {
      if (this.gang_join.gang_pass_key.length < 5) {
        this.gang_join.passKeyErr = true;
        return false;
      }
      return true;
    },
    togglePassKeyModal: function (gang_join_name, gang_join_admin) {
      this.showPassKeyModal = !this.showPassKeyModal;
      this.gang_join.gang_admin = gang_join_admin;
      this.gang_join.gang_name = gang_join_name;
      this.gang_join.gang_passkey = "";
      if (!this.showPassKeyModal) {
        this.load_btn = false;
      }
    },
  },
  async mounted() {
    // Detect when scrolled to bottom.
    const listElm = document.querySelector("#gang-search-parent");
    listElm.addEventListener("scroll", async () => {
      if (
        listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight &&
        this.gang_search.cursor != 0
      ) {
        await this.searchWithDelay(false);
      }
    });
  },
};
</script>

<style scoped lang="css">
.search-result-parent {
  height: 228px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.search-result-parent::-webkit-scrollbar {
  display: none;
}

.pass-key-err {
  background-color: rgb(243 180 180);
  border: 2px solid #f35050;
}

.mb-2-5 {
  margin-bottom: 0.875rem;
}

@media only screen and (max-width: 497px) {
  .join-btn {
    width: 90px;
  }
}
</style>
