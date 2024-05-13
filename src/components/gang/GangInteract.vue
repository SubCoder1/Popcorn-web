<!-- Gang Chat page component -->

<template>
  <div
    class="modal fade"
    v-show="
      search.showAddMemberModal &&
      gangStore.getUserGang.is_admin &&
      !pocket_mode
    "
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
            @keyup="searchWithDelay(false, 0)"
            autocomplete="off"
          />
        </div>
        <div
          class="modal-body"
          ref="member_search_box"
          v-on:scroll="handleUserSearchOnScroll()"
        >
          <div class="d-flex flex-column justify-content-center mt-3">
            <div v-show="search.searchResult.size == 0" class="text-center">
              <img
                class="empty-search-img m-auto"
                src="@/assets/misc/empty-search.png"
                alt="Empty search"
              />
              <p class="text-secondary text-sm mt-4">
                Your searches will show up here.
              </p>
            </div>
            <TransitionGroup
              v-if="search.searchResult.size != 0"
              name="fade"
              tag="div"
            >
              <div
                class="d-flex flex-row justify-content-between mb-3"
                v-for="(user, index) in search.searchResult"
                :key="index"
              >
                <div class="d-flex flex-row align-items-center">
                  <img
                    v-if="user[1].user_profile_pic"
                    v-bind:src="
                      require(`@/assets/profile/${user[1].user_profile_pic}`)
                    "
                    class="me-3 profile-pic-sm"
                    alt="User profile picture"
                  />
                  <img
                    v-else
                    v-bind:src="require(`@/assets/profile/default.png`)"
                    class="me-3 profile-pic-sm"
                    alt="User profile picture"
                  />
                  <div class="d-flex flex-column justify-content-center">
                    <p class="mb-1 text-sm handle-txt-overflow txt-width">
                      {{ user[1].full_name }}
                    </p>
                    <p
                      class="mb-0 text-sm text-secondary handle-txt-overflow txt-width"
                    >
                      @{{ user[1].username }}
                    </p>
                  </div>
                </div>
                <button
                  v-if="gangStore.getUserGang.gang_admin != user[1].username"
                  type="button"
                  class="btn btn-circle d-flex align-items-center justify-content-center rounded-circle p-0"
                  v-bind:class="{
                    success: user[1].load_invite_btn == 2,
                  }"
                  @click="sendInvite(false, user[1])"
                  :disabled="
                    user[1].load_invite_btn == 1 || user[1].load_invite_btn == 2
                  "
                >
                  <svg
                    v-if="user[1].load_invite_btn == 0"
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
                    v-else-if="user[1].load_invite_btn == 1"
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
            </TransitionGroup>
          </div>
        </div>
        <div class="modal-footer border-0">
          <div class="loader me-3" v-if="search.loading_members_search"></div>
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
  <div
    class="modal fade"
    v-show="showGangInfoModal && !pocket_mode"
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
            <span class="text-sm mb-2">Screen Share:</span>
            <span class="text-sm text-break text-secondary">
              <span v-if="gangStore.getUserGang.gang_screen_share">ON</span>
              <span v-else>OFF</span>
            </span>
          </div>
          <div class="d-flex justify-content-between flex-wrap mb-3">
            <span class="text-sm mb-2">Members limit:</span>
            <span class="text-sm text-secondary">
              {{ gangStore.getUserGang.gang_member_limit }}
            </span>
          </div>
          <div
            class="d-flex justify-content-between align-items-center flex-wrap mb-3"
          >
            <span class="text-sm mb-2">Invite via URL:</span>
            <button
              type="button"
              class="btn d-flex align-items-center justify-content-center btn-xsm rounded-md text-xsm"
              :class="{ copied: copied }"
              :disabled="copied"
              @click="copyToClipboard()"
            >
              <span v-if="!copied">COPY</span>
              <span v-else>COPIED!</span>
            </button>
          </div>
          <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex flex-column">
              <label for="gangMembers" class="text-sm m-0">Gang Members:</label>
              <router-link
                to=""
                @click="toggleAddGangMemberModal()"
                v-if="
                  gangStore.getUserGang.is_admin &&
                  gangStore.getUserGang.gang_members_count <
                    gangStore.getUserGang.gang_member_limit
                "
              >
                Add members
              </router-link>
              <span
                v-else-if="
                  gangStore.getUserGang.gang_members_count >=
                  gangStore.getUserGang.gang_member_limit
                "
                class="text-xsm gang-full"
                aria-disabled="true"
                >Gang is full
              </span>
            </div>
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
                      <p class="mb-1 text-sm handle-txt-overflow txt-width">
                        {{ member.full_name }}
                      </p>
                      <p
                        class="mb-0 text-sm text-secondary handle-txt-overflow txt-width"
                      >
                        @{{ member.username }}
                      </p>
                    </div>
                  </div>
                  <button
                    v-if="
                      gangStore.getUserGang.is_admin &&
                      gangStore.getUserGang.gang_admin != member.username
                    "
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
                    class="d-flex align-items-center text-sm text-secondary mb-0"
                    v-else-if="
                      gangStore.getUserGang.gang_admin == member.username
                    "
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
    <div class="gang-interact-header d-flex" v-if="!pocket_mode">
      <div
        class="gang-info d-flex align-items-center justify-content-between flex-wrap w-100 pb-2"
      >
        <div class="position-relative">
          <h4 class="handle-txt-overflow txt-width">
            {{ gangStore.getUserGang.gang_name }}
          </h4>
          <router-link to="" @click="goBackToGangList()">Go back</router-link>
        </div>
        <div class="d-flex align-items-center">
          <button
            type="button"
            class="btn d-flex align-items-center justify-content-center btn-xsm rounded-md text-sm admin-btn ms-2"
            v-if="
              (gangStore.getUserGang.gang_content_ID.length != 0 ||
                gangStore.getUserGang.gang_content_url.length != 0 ||
                gangStore.getUserGang.gang_screen_share) &&
              gangStore.getUserGang.is_admin &&
              !gangStore.getUserGang.gang_streaming
            "
            :disabled="loading_play_btn"
            @click="playContent(false)"
          >
            <div class="loader" v-if="loading_play_btn"></div>
            <span v-else-if="gangStore.getUserGang.gang_screen_share">
              SHARE
            </span>
            <span v-else>PLAY</span>
          </button>
          <button
            type="button"
            class="btn d-flex align-items-center justify-content-center btn-xsm rounded-md text-sm delete-content-btn ms-2"
            v-else-if="
              (gangStore.getUserGang.gang_content_ID.length != 0 ||
                gangStore.getUserGang.gang_content_url.length != 0 ||
                gangStore.getUserGang.gang_screen_share) &&
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
            class="btn d-flex align-items-center justify-content-center btn-xsm rounded-md text-sm leave-gang-btn ms-2"
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
      class="gang-interact-body d-flex flex-column text-wrap"
      :class="{
        'shrink-for-stream':
          gangStore.getUserGang.gang_streaming && !pocket_mode,
      }"
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
          Gang messages will show up here
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
              :class="{
                sending: msg.status == 'sending' || msg.status == 'error',
              }"
            >
              <img
                v-bind:src="
                  require(`@/assets/profile/${msg.user.user_profile_pic}`)
                "
                class="me-2 profile-pic-sm"
                alt="User profile picture"
              />
              <div class="message-body">
                <span class="mb-1 text-xsm text-secondary">
                  @{{ msg.user.username }}
                  <span v-if="msg.status == 'error'" class="not-sent">
                    | ERROR
                  </span>
                </span>
                <div class="bubble" :class="{ 'mw-100': pocket_mode }">
                  <span class="text-sm text-wrap">{{ msg.message }}</span>
                </div>
              </div>
            </div>
            <div v-else class="d-flex flex-row-reverse align-items-center mb-3">
              <img
                v-bind:src="
                  require(`@/assets/profile/${msg.user.user_profile_pic}`)
                "
                class="ms-2 profile-pic-sm"
                alt="User profile picture"
              />
              <div class="message-body text-end">
                <span class="mb-1 text-xsm text-secondary">
                  @{{ msg.user.username }}
                </span>
                <div class="bubble-reverse" :class="{ 'mw-100': pocket_mode }">
                  <span class="text-sm text-wrap">{{ msg.message }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="gang-interact-footer d-flex">
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
  <div
    v-if="search.showAddMemberModal || showGangInfoModal"
    class="modal-backdrop fade show"
  ></div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { useGangStore } from "@/stores/gang.store";
import { useUserStore } from "@/stores/user.store";

export default {
  name: "GangInteract",
  data() {
    return {
      gangStore: useGangStore(),
      userStore: useUserStore(),
      authStore: useAuthStore(),
      invite: {
        gang_name: "",
        invite_to: "",
      },
      search: {
        search_user: "",
        cursor: 0,
        searchResult: new Map(),
        loading_members_search: false,
        showAddMemberModal: false,
      },
      message: "",
      copied: false,
      showGangInfoModal: false,
      loading_members_list: false,
      loading_play_btn: false,
      loading_stop_btn: false,
      loading_leave_btn: false,
    };
  },
  props: {
    pocket_mode: {
      type: Boolean,
      default: false,
    },
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
          this.forceStopModals();
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        } else if (response == 400) {
          this.gangStore.getUserGangInteract[idx].status = "error";
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
          this.forceStopModals();
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.forceStopModals();
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
    playContent: async function (retry) {
      this.loading_play_btn = true;
      await this.$parent.$parent.handleLiveKitEvents();
      const response = await this.$parent.$parent.playContentAPI();
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
            this.forceStopModals();
            this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.forceStopModals();
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        if (this.gangStore.getUserGang.gang_screen_share) {
          // turn on screen share
          this.$parent.$parent.toggleScreenShare(true);
        }
      }
      this.loading_play_btn = false;
    },
    stopContent: async function (retry) {
      this.loading_stop_btn = true;
      const response = await this.$parent.$parent.stopContentAPI();
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
            this.forceStopModals();
            this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.forceStopModals();
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // turn off screen share
        this.$parent.$parent.toggleScreenShare(false);
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
          this.forceStopModals();
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.forceStopModals();
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
      this.loading_leave_btn = false;
    },
    copyToClipboard: async function () {
      await navigator.clipboard.writeText(
        window.location.origin +
          "/invite/" +
          this.gangStore.getUserGang.gang_admin +
          "/" +
          this.gangStore.getUserGang.gang_invite_hashcode
      );
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 3500);
    },
    searchUsersAPI: async function () {
      let res = {};
      await axios
        .get(process.env.VUE_APP_SEARCH_USER_API, {
          params: {
            username: this.search.search_user,
            cursor: this.search.cursor,
          },
          withCredentials: true,
          timeout: 1000 * 5,
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
            timeout: 1000 * 5,
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
          timeout: 1000 * 5,
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
    searchWithDelay: async function (retry, cur) {
      this.search.loading_members_search = true;
      this.search.cursor = cur;
      if (this.search.cursor == 0) {
        this.search.searchResult.clear();
      }
      clearTimeout(this.timeout);

      this.timeout = setTimeout(async () => {
        const response = await this.searchUsersAPI();
        if (response.status == 200) {
          this.search.cursor = response.cursor;
          response.searchResult = response.searchResult.map((e) => {
            return { ...e, load_invite_btn: 0 };
          });
          response.searchResult.forEach((obj) => {
            this.search.searchResult.set(obj.username, obj);
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
            const ref_token_resp = await this.authStore.refreshToken();
            if (ref_token_resp.status == 200) {
              await this.searchWithDelay(true, cur);
            }
          } else {
            // Not able to search gang even after refreshing token
            this.forceStopModals();
            this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.forceStopModals();
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
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
          const ref_token_resp = await this.authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.sendInvite(true);
          }
        } else {
          // Not able to send invite even after refreshing token
          // set to default icon on clicked invite btn
          member.load_invite_btn = 0;
          this.forceStopModals();
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        member.load_invite_btn = 0;
        this.forceStopModals();
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
      this.invite.invite_to = "";
    },
    bootMember: async function (retry, member, index) {
      member.load_boot_btn = true;
      const response = await this.bootMemberAPI({
        member_name: member.username,
        gang_name: this.gangStore.getUserGang.gang_name,
      });
      if (response == 200 || response == 400) {
        this.gangStore.getUserGang.gang_members.splice(index, 1);
        this.gangStore.getUserGang.gang_members_count -= 1;
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const ref_token_resp = await this.authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.searchWithDelay(true);
          }
        } else {
          // Not able to search gang even after refreshing token
          this.forceStopModals();
          member.load_boot_btn = false;
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        member.load_boot_btn = false;
        this.forceStopModals();
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
    toggleAddGangMemberModal: function () {
      this.toggleGangInfoModal();
      this.search.showAddMemberModal = !this.search.showAddMemberModal;
    },
    forceStopModals: function () {
      this.showGangInfoModal = false;
      this.search.showAddMemberModal = false;
    },
    handleUserSearchOnScroll: async function () {
      let elem = this.$refs.member_search_box;
      if (
        elem.scrollTop + elem.clientHeight + 5 >= elem.scrollHeight &&
        this.search.cursor != 0
      ) {
        await this.searchWithDelay(false, this.search.cursor);
      }
    },
  },
  async mounted() {
    this.scrollToBottomOfChatBody();
    this.invite.gang_name = this.gangStore.getUserGang.gang_name;
  },
  updated() {
    this.$nextTick(() => {
      this.scrollToBottomOfChatBody();
    });
  },
};
</script>

<style scoped lang="css">
.bi-share {
  cursor: pointer;
}
.gang-info {
  height: fit-content;
}

.gang-interact-body {
  height: 370px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  transition: all 0.2s ease-in;
}

.shrink-for-stream {
  height: 160px;
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

.bubble::-webkit-scrollbar-thumb,
.bubble-reverse::-webkit-scrollbar-thumb {
  background-color: rgb(233 126 114);
  border-radius: 25px;
  background-clip: content-box;
}

.bubble::-webkit-scrollbar-thumb:hover,
.bubble-reverse::-webkit-scrollbar-thumb:hover {
  background-color: rgb(231, 116, 103);
}

.sending {
  opacity: 0.5;
}

.not-sent,
.gang-full {
  color: rgba(217, 34, 14, 0.746);
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

.gang-interact-img {
  height: 100px;
}

.copied {
  background: mediumaquamarine;
}

.txt-width {
  max-width: 330px;
}

@media only screen and (max-width: 497px) {
  .gang-interact-body {
    height: 300px;
  }

  .gang-info-members-list {
    margin-top: 0.8rem;
    width: 100%;
  }

  .shrink-for-stream {
    height: 100px;
  }

  .gang-interact-img {
    height: 90px;
  }

  .txt-width {
    max-width: 170px;
  }
}
</style>
