<!-- Gang Chat page component -->

<template>
  <div
    class="modal fade"
    v-show="showGangInfoModal"
    v-bind:class="{
      show: showGangInfoModal,
      'd-block': showGangInfoModal,
    }"
    id="GangInfoModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="GangInfoModal"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
      <div class="modal-content border-0">
        <div class="modal-header"></div>
        <div class="modal-body h-100">
          <div class="d-flex justify-content-between flex-wrap mb-3">
            <span class="text-sm mb-2">Content:</span>
            <span class="text-sm text-break text-secondary">
              <span v-if="gangStore.getUserGang.gang_content_name.length != 0">
                {{ gangStore.getUserGang.gang_content_name }}
              </span>
              <span v-else>Yet to be uploaded.</span>
            </span>
          </div>
          <div class="d-flex justify-content-between flex-wrap mb-3">
            <span class="text-sm mb-2">Members limit:</span>
            <span class="text-sm text-secondary">
              {{ gangStore.getUserGang.gang_member_limit }} / 10
            </span>
          </div>
          <div class="d-flex justify-content-between flex-wrap">
            <span class="text-sm mt-1">Members:</span>
            <div class="gang-info-members-list">
              <div v-if="loading_members_list">
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
              <transition-group name="fade" tag="div" v-else>
                <div
                  class="d-flex flex-row justify-content-between mb-3"
                  v-for="member in gangStore.getUserGang.gang_members"
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
                  <p
                    class="d-flex align-items-center text-sm text-secondary mb-0"
                    v-if="gangStore.getUserGang.gang_admin == member.username"
                  >
                    Admin
                  </p>
                </div>
              </transition-group>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button
            type="button"
            class="btn modal-close-btn rounded-md text-sm mt-2 mb-2"
            data-bs-dismiss="modal"
            @click="toggleGangInfoModal()"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="gang-interact-parent">
    <div class="gang-interact-header d-flex">
      <div
        class="gang-info d-flex align-items-center justify-content-between w-100 p-4"
      >
        <div>
          <h4>{{ gangStore.getUserGang.gang_name }}</h4>
          <router-link to="" @click="goBackToGangList()">Go back</router-link>
        </div>
        <div class="d-flex">
          <button
            type="button"
            class="btn d-flex align-items-center justify-content-center btn-xsm rounded-md text-sm admin-btn"
            v-if="
              (gangStore.getUserGang.gang_content_ID.length != 0 ||
                gangStore.getUserGang.gang_content_url.length != 0) &&
              gangStore.getUserGang.is_admin &&
              !gangStore.getUserGang.gang_streaming
            "
            :disabled="loading_play_btn"
            @click="playContent(false)"
          >
            <div class="loader" v-if="loading_play_btn"></div>
            <span v-else>PLAY</span>
          </button>
          <button
            type="button"
            class="btn d-flex align-items-center justify-content-center btn-xsm rounded-md text-sm delete-content-btn"
            v-else-if="
              gangStore.getUserGang.gang_content_ID.length != 0 &&
              gangStore.getUserGang.is_admin &&
              gangStore.getUserGang.gang_streaming
            "
            :disabled="loading_stop_btn"
            @click="stopContent(false)"
          >
            <div class="loader" v-if="loading_stop_btn"></div>
            <span v-else>STOP</span>
          </button>
          <button
            type="button"
            class="btn d-flex align-items-center justify-content-center btn-xsm rounded-md text-sm leave-gang-btn"
            v-if="!gangStore.getUserGang.is_admin"
            @click="leaveGang(false)"
          >
            <div class="loader" v-if="loading_leave_btn"></div>
            <span v-else>LEAVE</span>
          </button>
          <button
            type="button"
            class="btn d-flex align-items-center justify-content-center btn-xsm rounded-md text-sm gang-info-btn ms-2"
            @click="toggleGangInfoModal()"
          >
            INFO
          </button>
        </div>
      </div>
    </div>
    <div
      class="gang-interact-body d-flex flex-column text-wrap ps-4 pe-4"
      :class="{ 'shrink-for-stream': gangStore.getUserGang.gang_streaming }"
      ref="gangChatBody"
    >
      <div
        v-if="gangStore.getUserGangInteract.length == 0"
        class="d-flex flex-column justify-content-center text-center m-auto"
      >
        <img
          class="gang-interact-img m-auto"
          src="@/assets/misc/gang-interact.png"
          alt="Empty search"
        />
        <span class="mt-3 text-sm text-secondary">
          Have a chat with the members
        </span>
      </div>
      <transition-group name="fade" tag="div">
        <div
          class="d-flex flex-column"
          v-for="(msg, index) in gangStore.getUserGangInteract"
          :key="index"
        >
          <div v-if="msg.type == 'gangJoin'">
            <span
              class="d-flex justify-content-center text-secondary text-sm mb-3"
            >
              {{ msg.message.username }} HAS JOINED THE GANG
            </span>
          </div>
          <div v-else-if="msg.type == 'gangLeave'">
            <span
              class="d-flex justify-content-center text-secondary text-sm mb-3"
            >
              {{ msg.message }} HAS LEFT THE GANG
            </span>
          </div>
          <div v-else-if="msg.type == 'gangUpdate'">
            <span
              class="d-flex justify-content-center text-secondary text-sm mb-3"
            >
              {{ msg.message }}
            </span>
          </div>
          <div v-else>
            <div
              v-if="userStore.getUserName == msg.user.username"
              class="d-flex align-items-center justify-content-start mb-3"
              :class="{ sending: msg.status == 'sending' }"
            >
              <img
                v-bind:src="
                  require(`@/assets/profile/${msg.user.user_profile_pic}`)
                "
                class="me-2 profile-pic-xsm"
                alt="User profile picture"
              />
              <div class="message-body">
                <span class="mb-1 text-xsm text-secondary">
                  @{{ msg.user.username }}
                </span>
                <div class="bubble text-wrap">
                  <span class="text-sm">{{ msg.message }}</span>
                </div>
              </div>
            </div>
            <div v-else class="d-flex flex-row-reverse align-items-center mb-3">
              <img
                v-bind:src="
                  require(`@/assets/profile/${msg.user.user_profile_pic}`)
                "
                class="ms-2 profile-pic-xsm"
                alt="User profile picture"
              />
              <div class="message-body text-end">
                <span class="mb-1 text-xsm text-secondary">
                  @{{ msg.user.username }}
                </span>
                <div class="bubble-reverse text-wrap">
                  <span class="text-sm">{{ msg.message }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="gang-interact-footer d-flex ps-4 pe-4 pb-3">
      <input
        type="text"
        class="form-control text-sm rounded-md input-lg"
        placeholder="Type a message . . ."
        v-model="message"
        @keyup.enter="sendMessage()"
      />
      <button
        type="button"
        class="btn btn-circle d-flex align-items-center justify-content-center rounded-circle join-gang-btn ms-2"
        @click="sendMessage()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          fill="currentColor"
          class="bi bi-send"
          viewBox="0 0 16 16"
        >
          <path
            d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
          />
        </svg>
      </button>
    </div>
  </div>
  <div v-if="showGangInfoModal" class="modal-backdrop fade show"></div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store";
import { useGangStore } from "@/stores/gang.store";
import { useUserStore } from "@/stores/user.store";
import axios from "axios";

export default {
  name: "GangInteract",
  data() {
    return {
      gangStore: useGangStore(),
      userStore: useUserStore(),
      authStore: useAuthStore(),
      message: "",
      showGangInfoModal: false,
      loading_members_list: false,
      loading_play_btn: false,
      loading_stop_btn: false,
      loading_leave_btn: false,
    };
  },
  methods: {
    goBackToGangList: function () {
      this.$parent.$parent.goBack();
    },
    sendMessage: async function () {
      if (this.message.length > 0) {
        var idx = this.gangStore.getUserGangInteract.length;
        this.gangStore.getUserGangInteract.push({
          type: "gangMessage",
          message: this.message,
          status: "sending",
          user: {
            username: this.userStore.getUserName,
            user_profile_pic: this.userStore.getUserProfPic,
          },
        });
        const response = await this.gangStore.sendGangMessage(
          idx,
          this.message
        );
        if (response >= 500) {
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
        this.message = "";
      }
    },
    getGangMembers: async function (retry) {
      this.loading_members_list = true;
      const response = await this.gangStore.getGangMembers();
      if (response == 200) {
        this.loading_members_list = false;
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const ref_token_resp = await this.authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.getGangMembers(true);
          }
        } else {
          // Error even after refreshing token
          this.showAddMemberModal = false;
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.showAddMemberModal = false;
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
    playContentAPI: async function () {
      const resp = await axios
        .post(
          process.env.VUE_APP_PLAY_CONTENT_API,
          {},
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          return response.status;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            return e.response.status;
            // show the first validation issue received from server
          } else {
            // Server unreachable
            return 503;
          }
        });
      return resp;
    },
    playContent: async function (retry) {
      this.loading_play_btn = true;
      const response = await this.playContentAPI();
      if (response != 200) {
        if (response == 401) {
          // Unauthorized
          if (retry == false) {
            // access_token expired, use refresh_token to refresh JWT
            // Try again on success
            const authStore = useAuthStore();
            const ref_token_resp = await authStore.refreshToken();
            if (ref_token_resp.status == 200) {
              await this.playContent(true);
            }
          } else {
            // Error even after refreshing token
            this.showAddMemberModal = false;
            this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.showAddMemberModal = false;
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      }
      this.loading_play_btn = false;
    },
    stopContentAPI: async function () {
      const resp = await axios
        .post(
          process.env.VUE_APP_STOP_CONTENT_API,
          {},
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          return response.status;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            return e.response.status;
            // show the first validation issue received from server
          } else {
            // Server unreachable
            return 503;
          }
        });
      return resp;
    },
    stopContent: async function (retry) {
      this.loading_stop_btn = true;
      const response = await this.stopContentAPI();
      if (response != 200) {
        if (response == 401) {
          // Unauthorized
          if (retry == false) {
            // access_token expired, use refresh_token to refresh JWT
            // Try again on success
            const ref_token_resp = await this.authStore.refreshToken();
            if (ref_token_resp.status == 200) {
              await this.stopContent(true);
            }
          } else {
            // Error even after refreshing token
            this.showAddMemberModal = false;
            this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.showAddMemberModal = false;
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      }
      setTimeout(() => {
        this.loading_stop_btn = false;
      }, 2500);
    },
    scrollToBottomOfChatBody: function () {
      const el = this.$refs.gangChatBody;
      if (el != null || el != undefined) {
        el.scrollTop = el.scrollHeight;
      }
    },
    toggleGangInfoModal: function () {
      this.showGangInfoModal = !this.showGangInfoModal;
    },
    leaveGang: async function (retry) {
      this.loading_leave_btn = true;
      const response = await this.gangStore.leaveGang();
      if (response == 200) {
        this.authStore.stream_token = "";
        this.$parent.$parent.$parent.$parent.reloadDashboard();
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const ref_token_resp = await this.authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.leaveGang(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
      this.loading_leave_btn = false;
    },
  },
  async mounted() {
    this.scrollToBottomOfChatBody();
  },
  updated() {
    this.$nextTick(() => {
      this.scrollToBottomOfChatBody();
    });
  },
};
</script>

<style scoped lang="css">
.gang-info {
  height: fit-content;
}

.gang-interact-header {
  height: 109px;
}
.gang-interact-body {
  height: 370px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  transition: all 0.2s ease-in;
}

.shrink-for-stream {
  height: 185px;
}

.gang-interact-body::-webkit-scrollbar {
  display: none;
}

.bubble,
.bubble-reverse {
  max-height: 114px;
  max-width: 535px;
  background: rgb(241 133 121 / 80%);
  border-radius: 2px 8px 8px 8px;
  padding-top: 7px;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
  color: white;
  border: 2px solid rgb(233 126 114);
  overflow: auto;
  display: -webkit-box;
  text-align: justify;
}

.bubble-reverse {
  border-radius: 8px 2px 8px 8px;
}

.bubble::-webkit-scrollbar,
.bubble-reverse::-webkit-scrollbar {
  width: 10px;
}

.bubble::-webkit-scrollbar-track,
.bubble-reverse::-webkit-scrollbar-track {
  background: transparent;
  background-clip: content-box;
}

.bubble::-webkit-scrollbar-thumb,
.bubble-reverse::-webkit-scrollbar-thumb {
  background: rgb(240, 90, 73);
  border-radius: 20px;
  border: 3px solid rgb(240, 90, 73);
  height: 8px;
}

.sending {
  opacity: 0.5;
}

.modal-body {
  height: 236px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.modal-body::-webkit-scrollbar {
  display: none;
}

.gang-info-members-list {
  width: 330px;
  height: 250px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.gang-info-members-list::-webkit-scrollbar {
  display: none;
}

.modal-body {
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.modal-body::-webkit-scrollbar {
  display: none;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

@media only screen and (max-width: 497px) {
  .gang-info-members-list {
    margin-top: 0.8rem;
    width: 100%;
  }

  .shrink-for-stream {
    height: 100px;
  }

  .gang-interact-img {
    height: 95px;
  }
}
</style>
