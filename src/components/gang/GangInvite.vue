<!-- Gang Invite component rendered through GangDashboard -->

<template>
  <div
    v-if="!gangStore.canJoinGang"
    class="modal fade"
    v-show="showWarnModal"
    v-bind:class="{ show: showWarnModal, 'd-block': showWarnModal }"
    refs="WarnModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0">
        <div class="modal-body pb-0">
          <p class="text-sm text-justify">
            This will make you leave your current gang. You can rejoin your
            current gang through gang invites or searches.
          </p>
        </div>
        <div class="modal-footer border-0">
          <button
            type="submit"
            class="btn btn-sm d-flex align-items-center justify-content-center success rounded-md text-sm"
            :disabled="load_accept_btn"
            @click="acceptInvite(false)"
          >
            <div class="loader" v-if="load_accept_btn"></div>
            <span v-if="!load_accept_btn">Accept</span>
          </button>
          <button
            type="button"
            class="btn modal-close-btn rounded-md text-sm"
            data-bs-dismiss="modal"
            :disabled="load_accept_btn"
            @click="toggleWarnModal('', '', 0)"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
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
  <div v-else>
    <div v-if="invites.length == 0" class="text-center">
      <lottie-player
        src="https://lottie.host/f088f560-cc3a-4726-9837-ddae25f3308f/2lDmiXa8JA.json"
        background="transparent"
        speed="1"
        loop
        autoplay
        v-pre
      >
      </lottie-player>
      <span class="text-secondary text-sm">
        Oops! You haven't got any invites
      </span>
    </div>
    <div
      class="d-flex flex-column"
      v-for="(invite, index) in invites"
      :key="invite"
    >
      <div class="d-flex flex-row justify-content-between mb-3">
        <div class="d-flex flex-column justify-content-center text-sm">
          <span>
            Invite from
            <span class="text-secondary">@{{ invite.gang_admin }}</span>
          </span>
          <span>
            For
            <strong>{{ invite.gang_name }}</strong>
          </span>
          <span class="text-secondary text-xsm">
            {{ invite.invite_sent_timeago }}
          </span>
        </div>
        <div
          v-if="!invite.is_expired"
          class="d-flex flex-row align-items-center"
        >
          <button
            type="button"
            class="btn btn-circle d-flex align-items-center justify-content-center success rounded-circle p-0"
            @click="
              !gangStore.canJoinGang
                ? toggleWarnModal(invite.gang_admin, invite.gang_name)
                : acceptInvite(false, invite, index)
            "
          >
            <svg
              v-if="!invite.load_accept_btn"
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              class="bi bi-check2"
              viewBox="0 0 16 16"
            >
              <path
                d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
              />
            </svg>
            <div v-else class="loader"></div>
          </button>
          <button
            type="button"
            class="btn btn-circle d-flex align-items-center justify-content-center decline-invite-btn rounded-circle p-0 ms-3"
            @click="rejectInvite(false, invite)"
          >
            <svg
              v-if="!invite.load_reject_btn"
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              class="bi bi-trash3"
              viewBox="0 0 16 16"
            >
              <path
                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
              />
            </svg>
            <div v-else class="loader"></div>
          </button>
        </div>
        <div v-else class="d-flex flex-row align-items-center">
          <span class="text-sm text-secondary">Expired or Invalid</span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showWarnModal" class="modal-backdrop fade show"></div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { useGangStore } from "@/stores/gang.store";

export default {
  data() {
    return {
      loading: true,
      load_accept_btn: false,
      showWarnModal: false,
      invites: [],
      accept_invite: {
        gang_admin: "",
        gang_name: "",
        index: 0,
      },
      gangStore: useGangStore(),
    };
  },
  name: "GangInvite",
  methods: {
    getInvitesAPI: async function () {
      let res = {};
      await axios
        .get(process.env.VUE_APP_GET_INVITES_API, {
          withCredentials: true,
        })
        .then((response) => {
          res.status = 200;
          res.invites = response.data;
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
    rejectInviteAPI: async function (invite) {
      const response = await axios
        .post(process.env.VUE_APP_REJECT_INVITE_API, invite, {
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
            // Server unreachable
            return 503;
          }
        });
      return response;
    },
    getInvites: async function (retry) {
      this.loading = true;
      const response = await this.getInvitesAPI();
      if (response.status == 200) {
        this.invites = response.invites.invites;
        this.invites = this.invites.map((e) => {
          return {
            ...e,
            load_accept_btn: false,
            load_reject_btn: false,
            is_expired: false,
          };
        });
        this.loading = false;
      } else if (response.status == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.getInvites(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.showWarnModal = false;
          this.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.showWarnModal = false;
        this.$parent.$parent.$parent.srvErrModal();
      }
    },
    acceptInvite: async function (
      retry,
      invite = {
        gang_admin: this.accept_invite.gang_admin,
        gang_name: this.accept_invite.gang_name,
        load_btn: false,
      },
      index = this.accept_invite.index
    ) {
      invite.load_accept_btn = true;
      this.load_accept_btn = true;
      const response = await this.gangStore.acceptInvite({
        gang_admin: invite.gang_admin,
        gang_name: invite.gang_name,
      });
      if (response == 200) {
        this.load_accept_btn = false;
        invite.load_accept_btn = false;
        this.showWarnModal = false;
        this.invites.splice(index, 1);
        this.$parent.reloadDashboard();
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.acceptInvite(true, invite);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.showWarnModal = false;
          this.$parent.$parent.$parent.srvErrModal();
        }
      } else if (response == 400) {
        // invite expired or invalid
        invite.is_expired = true;
      } else {
        // Server error
        this.showWarnModal = false;
        this.$parent.$parent.$parent.srvErrModal();
      }
    },
    rejectInvite: async function (retry, invite, index) {
      invite.load_reject_btn = true;
      const response = await this.rejectInviteAPI({
        gang_admin: invite.gang_admin,
        gang_name: invite.gang_name,
      });
      if (response == 200) {
        this.invites.splice(index, 1);
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.rejectInvite(true, invite, index);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.showWarnModal = false;
          this.$parent.$parent.$parent.srvErrModal();
        }
      } else if (response == 400) {
        // Invalid or rejected invite
        invite.is_expired = true;
      } else {
        // Server error
        this.showWarnModal = false;
        this.$parent.$parent.$parent.srvErrModal();
      }
    },
    toggleWarnModal: function (gang_admin, gang_name, index) {
      this.showWarnModal = !this.showWarnModal;
      this.accept_invite.gang_admin = gang_admin;
      this.accept_invite.gang_name = gang_name;
      this.accept_invite.index = index;
    },
  },
  async mounted() {
    this.getInvites(false);
  },
};
</script>
