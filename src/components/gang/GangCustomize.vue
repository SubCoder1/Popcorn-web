<!-- Customize Gang Component -->

<template>
  <div
    class="modal fade"
    v-show="search.showAddMemberModal"
    v-bind:class="{
      show: search.showAddMemberModal,
      'd-block': search.showAddMemberModal,
    }"
    id="AddMemberModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="AddMemberModal"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
      <div class="modal-content border-0">
        <div class="modal-header">
          <label for="gangMembers" class="text-sm">Add Members:</label>
          <input
            type="text"
            class="form-control text-sm rounded-md input-md"
            placeholder="Type username to add"
            v-model.trim="search.search_user"
            id="gangMembers"
            @keyup="searchWithDelay(false)"
            autocomplete="off"
          />
        </div>
        <div class="modal-body">
          <div v-show="search.loading_members_search">
            <div class="d-flex flex-column justify-content-center">
              <div class="d-flex flex-row mb-3">
                <div
                  class="skeleton user-prof-skeleton-md rounded-circle me-3"
                ></div>
                <div class="d-flex flex-column justify-content-center">
                  <div class="skeleton skeleton-text mb-3"></div>
                  <div class="skeleton skeleton-text"></div>
                </div>
              </div>
              <div class="d-flex flex-row mb-3">
                <div
                  class="skeleton user-prof-skeleton-md rounded-circle me-3"
                ></div>
                <div class="d-flex flex-column justify-content-center">
                  <div class="skeleton skeleton-text mb-3"></div>
                  <div class="skeleton skeleton-text"></div>
                </div>
              </div>
              <div class="d-flex flex-row mb-1-5">
                <div
                  class="skeleton user-prof-skeleton-md rounded-circle me-3"
                ></div>
                <div class="d-flex flex-column justify-content-center">
                  <div class="skeleton skeleton-text mb-3"></div>
                  <div class="skeleton skeleton-text"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column justify-content-center mt-3">
            <div
              v-show="
                !search.loading_members_search &&
                search.searchResult.length == 0
              "
              class="text-center"
            >
              <img
                class="empty-search-img m-auto"
                src="@/assets/misc/empty-search.png"
                alt="Empty search"
              />
              <p class="text-secondary text-sm mt-4">
                Your searches will show up here.
              </p>
            </div>
            <transition-group
              v-if="search.searchResult.length != 0"
              name="fade"
              tag="div"
            >
              <div
                class="d-flex flex-row justify-content-between mb-3"
                v-for="member in search.searchResult"
                :key="member"
              >
                <div class="d-flex flex-row align-items-center">
                  <img
                    v-bind:src="
                      require(`@/assets/profile/${member.user_profile_pic}`)
                    "
                    class="me-3 profile-pic-sm"
                    alt="User profile picture"
                  />
                  <div class="d-flex flex-column justify-content-center">
                    <p class="mb-1 text-sm">{{ member.full_name }}</p>
                    <p class="mb-0 text-sm text-secondary">
                      @{{ member.username }}
                    </p>
                  </div>
                </div>
                <button
                  v-if="gang.gang_admin != member.username"
                  type="button"
                  class="btn btn-circle d-flex align-items-center justify-content-center rounded-circle p-0"
                  v-bind:class="{ success: member.load_invite_btn == 2 }"
                  @click="sendInvite(false, member)"
                  :disabled="
                    member.load_invite_btn == 1 || member.load_invite_btn == 2
                  "
                >
                  <svg
                    v-if="member.load_invite_btn == 0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    fill="currentColor"
                    class="bi bi-person-plus"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                    ></path>
                  </svg>
                  <div
                    class="loader"
                    v-else-if="member.load_invite_btn == 1"
                  ></div>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    class="bi bi-send-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"
                    />
                    <path
                      d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"
                    />
                  </svg>
                </button>
                <p
                  v-else
                  class="d-flex align-items-center text-sm text-secondary mb-0 me-1"
                >
                  Admin
                </p>
              </div>
            </transition-group>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button
            type="button"
            class="btn modal-close-btn rounded-md text-sm mt-2 mb-2"
            data-bs-dismiss="modal"
            @click="toggleAddGangMemberModal()"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <form class="gang-update-form mt-4">
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangName" class="text-sm">Name of the Gang:</label>
      <input
        type="text"
        class="form-control text-sm rounded-md input-md"
        placeholder="Name"
        v-model.trim="update.gang_name"
        id="gangName"
        @click="removeErr()"
        autocomplete="off"
        required
      />
    </div>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangPassKey" class="text-sm">Gang Passkey:</label>
      <input
        type="password"
        class="form-control text-sm rounded-md input-md"
        placeholder="Passkey"
        v-model="update.gang_pass_key"
        id="gangPassKey"
        @click="removeErr()"
        required
      />
    </div>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangLimit" class="text-sm">Gang Members limit:</label>
      <div class="input-md d-flex align-items-center text-secondary text-sm">
        <input
          type="number"
          class="form-control text-sm rounded-md input-xsm me-3"
          placeholder="Limit"
          v-model.number="update.gang_member_limit"
          id="gangLimit"
          @click="removeErr()"
          min="2"
          max="10"
          required
        />
        / 10 (Max Gang Members)
      </div>
    </div>
    <div class="d-flex justify-content-between flex-wrap mb-3">
      <div class="d-flex flex-column">
        <label for="gangMembers" class="text-sm">Gang Members:</label>
        <router-link
          to=""
          class="mt-2"
          @click="toggleAddGangMemberModal()"
          v-if="gang.gang_members_count < update.gang_member_limit"
        >
          Add members
        </router-link>
      </div>
      <div class="gang-members-box-md">
        <div v-show="loading_members_list">
          <div class="d-flex flex-row mb-3">
            <div
              class="skeleton user-prof-skeleton-md rounded-circle me-3"
            ></div>
            <div class="d-flex flex-column justify-content-center">
              <div class="skeleton skeleton-text mb-3"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </div>
          <div class="d-flex flex-row mb-3">
            <div
              class="skeleton user-prof-skeleton-md rounded-circle me-3"
            ></div>
            <div class="d-flex flex-column justify-content-center">
              <div class="skeleton skeleton-text mb-3"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </div>
        </div>
        <transition-group v-show="!loading_members_list" name="fade" tag="div">
          <div
            class="d-flex flex-row justify-content-between mb-3"
            v-for="(member, index) in membersList"
            :key="member"
          >
            <div class="d-flex flex-row align-items-center">
              <img
                v-bind:src="
                  require(`@/assets/profile/${member.user_profile_pic}`)
                "
                class="me-3 profile-pic-sm"
                alt="User profile picture"
              />
              <div class="d-flex flex-column justify-content-center">
                <p class="mb-1 text-sm">{{ member.full_name }}</p>
                <p class="mb-0 text-sm text-secondary">
                  @{{ member.username }}
                </p>
              </div>
            </div>
            <button
              v-if="gang.gang_admin != member.username"
              type="button"
              class="btn btn-circle d-flex align-items-center justify-content-center kick-member-btn rounded-circle p-0"
              @click="bootMember(false, member, index)"
            >
              <svg
                v-if="!member.load_boot_btn"
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="currentColor"
                class="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                />
              </svg>
              <div v-else class="loader"></div>
            </button>
            <p
              v-else
              class="d-flex align-items-center text-sm text-secondary mb-0 me-1"
            >
              Admin
            </p>
          </div>
        </transition-group>
      </div>
    </div>
  </form>
  <div v-if="search.showAddMemberModal" class="modal-backdrop fade show"></div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

export default {
  name: "GangCustomize",
  props: {
    gang: Object,
  },
  data() {
    return {
      update: {
        gang_name: this.gang.gang_name,
        gang_pass_key: "",
        gang_member_limit: this.gang.gang_member_limit,
      },
      invite: {
        gang_name: this.gang.gang_name,
        invite_to: "",
      },
      search: {
        search_user: "",
        cursor: 0,
        searchResult: [],
        loading_members_search: false,
        showAddMemberModal: false,
      },
      membersList: [],
      loading_members_list: false,
      timeout: null,
    };
  },
  methods: {
    searchUsersAPI: async function () {
      let res = {};
      await axios
        .get(process.env.VUE_APP_SEARCH_USER_API, {
          params: {
            username: this.search.search_user,
            cursor: this.search.cursor,
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
    getGangMembersAPI: async function () {
      let res = {};
      await axios
        .get(process.env.VUE_APP_GET_GANG_MEMBERS_API, {
          withCredentials: true,
        })
        .then((response) => {
          res.status = response.status;
          res.membersList = response.data.members;
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
    sendInviteAPI: async function () {
      const response = await axios
        .post(
          process.env.VUE_APP_SEND_GANG_INVITES_API,
          {
            gang_name: this.invite.gang_name,
            gang_invite_for: this.invite.invite_to,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          return response.status;
        })
        .catch((e) => {
          if (e.response) {
            // Server sent a response
            return e.response.status;
          } else {
            // Server unreachable
            return 503;
          }
        });
      return response;
    },
    bootMemberAPI: async function (member) {
      const response = await axios
        .post(process.env.VUE_APP_BOOT_MEMBER_API, member, {
          withCredentials: true,
        })
        .then((r) => {
          return r.status;
        })
        .catch((e) => {
          if (e.response) {
            // Server sent a response
            return e.response.status;
          } else {
            return 503;
          }
        });
      return response;
    },
    getGangMembers: async function (retry) {
      this.membersList = [];
      this.loading_members_list = true;
      const response = await this.getGangMembersAPI();
      if (response.status == 200) {
        this.loading_members_list = false;
        this.membersList = response.membersList;
        this.membersList = this.membersList.map((e) => {
          return { ...e, load_boot_btn: false };
        });
      } else if (response.status == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.getGangMembers(true);
          }
        } else {
          // Error even after refreshing token
          this.showAddMemberModal = false;
          this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.showAddMemberModal = false;
        this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
    searchWithDelay: async function (retry) {
      this.search.loading_members_search = true;
      this.search.searchResult = [];
      clearTimeout(this.timeout);

      this.timeout = setTimeout(async () => {
        const response = await this.searchUsersAPI();
        if (response.status == 200) {
          this.search.searchResult = response.searchResult;
          this.search.cursor = response.cursor;
          this.search.searchResult = this.search.searchResult.map((e) => {
            return { ...e, load_invite_btn: 0 };
          });
          this.search.loading_members_search = false;
        } else if (response.status == 400) {
          // Bad request - validation issue or no data found
          this.search.loading_members_search = false;
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
            this.search.showAddMemberModal = false;
            this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.search.showAddMemberModal = false;
          this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      }, 1000);
    },
    sendInvite: async function (retry, member) {
      // loading icon on clicked invite btn
      member.load_invite_btn = 1;
      this.invite.invite_to = member.username;
      const response = await this.sendInviteAPI();
      if (response == 200) {
        // sent invite
        // sent success icon on clicked invite btn
        member.load_invite_btn = 2;
      } else if (response == 401) {
        // Unauthorized
        // set to default icon on clicked invite btn
        member.load_invite_btn = 0;
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.sendInvite(true);
          }
        } else {
          // Not able to send invite even after refreshing token
          // set to default icon on clicked invite btn
          member.load_invite_btn = 0;
          this.search.showAddMemberModal = false;
          this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        member.load_invite_btn = 0;
        this.search.showAddMemberModal = false;
        this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
      this.invite.invite_to = "";
    },
    bootMember: async function (retry, member, index) {
      member.load_boot_btn = true;
      const response = await this.bootMemberAPI({
        member_name: member.username,
        gang_name: this.gang.gang_name,
      });
      if (response == 200 || response == 400) {
        this.membersList.splice(index, 1);
      } else if (response == 401) {
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
          this.search.showAddMemberModal = false;
          this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.search.showAddMemberModal = false;
        this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
    toggleAddGangMemberModal: function () {
      this.search.showAddMemberModal = !this.search.showAddMemberModal;
    },
    removeErr: function () {
      this.$parent.$parent.removeErr();
    },
    validateForm: function () {
      let error = "";
      if (
        this.update.gang_name.length < 5 ||
        this.update.gang_name.length > 20
      ) {
        // gang_name length should be between [5,20]
        error = "Gang name should be of 5 - 20 characters.";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      } else if (/[^a-zA-Z0-9_.\s]/g.test(this.update.gang_name)) {
        error =
          "Gang name can contain only letters, numbers, underscore, period and whitespaces.";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      } else if (/[^\x20-\x7E]/g.test(this.update.gang_name)) {
        // gang_name should not contain any unprintable ASCII
        error = "Gang name cannot contain any weird characters.";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      } else if (this.update.gang_name.trim().length == 0) {
        // gang_name should'nt contain only spaces
        error = "Gang name cannot contain only whitespaces";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      } else if (this.update.gang_pass_key.length < 5) {
        // gang_passkey length should be >= 5
        error = "Gang passkey should be of at least 5 characters.";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      }
      return true;
    },
  },
  async mounted() {
    this.getGangMembers(false);
  },
};
</script>

<style scoped lang="css">
.gang-members-box-md {
  height: 250px;
  width: 350px;
}
.mb-1-5 {
  margin-bottom: 0.375rem;
}
</style>
