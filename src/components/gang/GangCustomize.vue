<!-- Customize Gang Component -->

<template>
  <div
    class="modal fade"
    v-show="upload.showUploadSuccessModal"
    v-bind:class="{
      show: upload.showUploadSuccessModal,
      'd-block': upload.showUploadSuccessModal,
    }"
    id="UploadSuccessModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="UploadSuccessModal"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
      <div class="modal-content border-0">
        <div class="modal-body h-auto">
          <span class="text-secondary">
            Great! Now you can live-stream this content by visiting
            <button type="button" class="btn btn-circle rounded-circle pe-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="26"
                fill="currentColor"
                class="bi bi-camera-reels"
                viewBox="0 0 16 16"
              >
                <path
                  d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"
                />
                <path
                  d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7zm6 8.73V7.27l-3.5 1.555v4.35l3.5 1.556zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1z"
                />
                <path
                  d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"
                />
              </svg>
            </button>
            and press
            <button class="btn btn-xsm rounded-md text-sm play-btn pe-none">
              PLAY
            </button>
            <br /><br />
            <strong>
              Remember: You cannot change content while you're streaming.
            </strong>
          </span>
        </div>
        <div class="modal-footer border-0">
          <button
            type="button"
            class="btn modal-close-btn rounded-md text-sm mt-2 mb-2"
            data-bs-dismiss="modal"
            @click="toggleUploadSuccessModal()"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
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
        <div class="modal-body" id="member-search-parent">
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
                  v-if="gangStore.getUserGang.gang_admin != member.username"
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
  <form @submit.prevent="updateGang(false)" class="gang-update-form p-4">
    <div
      class="upload-content-container d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangContentFile" class="text-sm">
        Content File <br />
        <span class="text-secondary">(MP4 Or MKV only):</span>
      </label>
      <div
        v-if="gangStore.getUserGang.gang_content_name.length != 0"
        class="content-box d-flex align-items-center justify-content-between"
      >
        <span class="content-txt text-sm text-break text-secondary">
          {{ gangStore.getUserGang.gang_content_name }}
        </span>
        <button
          type="button"
          class="btn btn-circle d-flex align-items-center justify-content-center rounded-circle delete-content-btn"
          @click="deleteContent(false)"
          :disabled="gangStore.getUserGang.gang_streaming"
        >
          <svg
            v-if="!upload.load_del_content_btn"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
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
      <div
        v-else-if="!upload.uploading"
        class="d-flex align-items-center justify-content-between flex-wrap"
      >
        <input
          type="file"
          class="input-md text-sm"
          id="gangContentFile"
          @change="uploadContent"
          accept="video/mp4,video/x-matroska,video/*"
          :disabled="
            update.gang_content_url.length != 0 ||
            update.gang_screen_share ||
            gangStore.getUserGang.gang_streaming
          "
        />
      </div>
      <div
        class="upload-box text-sm rounded-md input-md"
        :class="{ show: upload.uploading, 'd-none': !upload.uploading }"
      >
        <div class="progress m-3">
          <div
            class="progress-bar"
            role="progressbar"
            :aria-valuenow="upload.percentage"
            :style="{ width: upload.percentage + '%' }"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div class="upload-text-progress text-center text-secondary mb-2">
          {{ upload.status }}
        </div>
        <button
          type="button"
          class="btn btn-circle d-flex align-items-center justify-content-center rounded-circle content-pause-unpause-btn m-auto"
          ref="pauseUpauseContent"
        >
          <svg
            v-if="!upload.upload_paused"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-pause"
            viewBox="0 0 16 16"
          >
            <path
              d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-play"
            viewBox="0 0 16 16"
          >
            <path
              d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
            />
          </svg>
        </button>
      </div>
    </div>
    <span
      class="d-flex justify-content-center text-secondary text-sm"
      style="margin-bottom: 0.78rem"
    >
      --- OR ---
    </span>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangContentURL" class="text-sm">
        Content URL <br />
        <span class="text-secondary">Should be downloadable:</span>
      </label>
      <input
        type="url"
        class="form-control text-sm rounded-md input-md"
        placeholder="Content URL"
        v-model="update.gang_content_url"
        id="gangContentURL"
        @click="removeErr()"
        :disabled="
          upload.uploading == true ||
          gangStore.getUserGang.gang_content_name.length != 0 ||
          update.gang_screen_share ||
          gangStore.getUserGang.gang_streaming
        "
      />
    </div>
    <span
      class="d-flex justify-content-center text-secondary text-sm"
      style="margin-bottom: 0.78rem"
    >
      --- OR ---
    </span>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangScreenShare" class="text-sm">Screen Share</label>
      <div class="input-md">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="update.gang_screen_share"
          id="gangScreenShare"
          :disabled="
            upload.uploading == true ||
            gangStore.getUserGang.gang_content_name.length != 0 ||
            update.gang_content_url.length != 0 ||
            gangStore.getUserGang.gang_streaming
          "
        />
      </div>
    </div>
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
      />
    </div>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangLimit" class="text-sm">Members:</label>
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
        <label for="gangMembers" class="text-sm m-0">Gang Members:</label>
        <router-link
          to=""
          @click="toggleAddGangMemberModal()"
          v-if="
            gangStore.getUserGang.gang_members_count < update.gang_member_limit
          "
        >
          Add members
        </router-link>
      </div>
      <div class="gang-members-box-md">
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
        <transition-group v-else name="fade" tag="div">
          <div
            class="d-flex flex-row justify-content-between mb-3"
            v-for="(member, index) in gangStore.getUserGang.gang_members"
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
              v-if="gangStore.getUserGang.gang_admin != member.username"
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
    <button
      type="submit"
      class="btn d-flex align-items-center justify-content-center btn-md rounded-md text-sm update-btn mt-4"
      :disabled="update.form_submitted"
    >
      <div class="loader" v-if="update.form_submitted"></div>
      <span v-if="!update.form_submitted">{{ update.update_txt }}</span>
    </button>
  </form>
  <div
    v-if="search.showAddMemberModal || upload.showUploadSuccessModal"
    class="modal-backdrop fade show"
  ></div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { useGangStore } from "@/stores/gang.store";
import { useUserStore } from "@/stores/user.store";

let gangStore = useGangStore();
let userStore = useUserStore();
var tus = require("tus-js-client");

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default {
  name: "GangCustomize",
  data() {
    return {
      gangStore: gangStore,
      update: {
        gang_name: gangStore.getUserGang.gang_name,
        gang_pass_key: "",
        gang_member_limit: gangStore.getUserGang.gang_member_limit,
        gang_content_url: gangStore.getUserGang.gang_content_url,
        gang_screen_share: gangStore.getUserGang.gang_screen_share,
        form_submitted: false,
        update_txt: "Update",
      },
      invite: {
        gang_name: gangStore.getUserGang.gang_name,
        invite_to: "",
      },
      search: {
        search_user: "",
        cursor: 0,
        searchResult: [],
        loading_members_search: false,
        showAddMemberModal: false,
      },
      upload: {
        uploading: false,
        status: "Initializing . . .",
        percentage: 0,
        upload_paused: false,
        load_del_content_btn: false,
        showUploadSuccessModal: false,
      },
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
      this.loading_members_list = true;
      const response = await this.gangStore.getGangMembers();
      if (response == 200) {
        this.loading_members_list = false;
      } else if (response == 401) {
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
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.showAddMemberModal = false;
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
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
            this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else {
          // Server error
          this.search.showAddMemberModal = false;
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
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        member.load_invite_btn = 0;
        this.search.showAddMemberModal = false;
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
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.searchWithDelay(true);
          }
        } else {
          // Not able to search gang even after refreshing token
          this.search.showAddMemberModal = false;
          member.load_boot_btn = false;
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        member.load_boot_btn = false;
        this.search.showAddMemberModal = false;
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
    updateGang: async function (retry) {
      this.update.form_submitted = true;
      if (this.validateForm()) {
        let updateGangData = {
          gang_content_url: this.update.gang_content_url,
          gang_name: this.update.gang_name,
          gang_pass_key: this.update.gang_pass_key,
          gang_member_limit: this.update.gang_member_limit,
          gang_screen_share: this.update.gang_screen_share,
        };
        const response = await this.gangStore.updateGang(updateGangData);
        if (response.status == 200) {
          await this.getGangMembers(false);
          this.update.update_txt = "Updated!";
          setTimeout(() => {
            this.update.update_txt = "Update";
          }, 3000);
        } else if (response == 401) {
          // Unauthorized
          if (retry == false) {
            // access_token expired, use refresh_token to refresh JWT
            // Try again on success
            const authStore = useAuthStore();
            const ref_token_resp = await authStore.refreshToken();
            if (ref_token_resp.status == 200) {
              await this.updateGang(true);
            }
          } else {
            // Not able to create gang even after refreshing token
            this.$parent.$parent.$parent.$parent.srvErrModal();
          }
        } else if (response >= 500) {
          // Server error
          this.$parent.$parent.$parent.$parent.srvErrModal();
        } else {
          // Maybe validation
          this.$parent.$parent.ErrPopUp(response.error);
        }
      }
      this.update.form_submitted = false;
    },
    uploadContent: function (e) {
      this.upload.uploading = true;
      var file = e.target.files[0];
      var srverr = this.$parent.$parent.$parent.$parent.$parent.$parent;
      // Create a new tus upload
      var tus_upload = new tus.Upload(file, {
        // Endpoint is the upload creation URL from your tus server
        endpoint: process.env.VUE_APP_UPLOAD_API,
        addRequestId: true,
        // Retry delays will enable tus-js-client to automatically retry on errors
        retryDelays: [0, 3000, 5000, 10000, 20000],
        // Attach additional meta data about the file for the server
        metadata: {
          user: userStore.getUserName,
          filename: file.name,
          filetype: file.type,
        },
        onBeforeRequest: (req) => {
          var xhr = req.getUnderlyingObject();
          xhr.withCredentials = true;
        },
        // Callback for errors which cannot be fixed using retries
        onError: (error) => {
          console.log("Failed because: " + error);
          tus_upload.abort();
          this.upload.uploading = false;
          this.upload.status = "Initializing . . .";
          srverr.srvErrModal();
        },
        // Callback for reporting upload progress
        onProgress: (bytesUploaded, bytesTotal) => {
          var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(bytesUploaded, bytesTotal, percentage + "%");
          this.upload.percentage = percentage;
          this.upload.status = `Uploaded ${formatBytes(
            bytesUploaded
          )} of ${formatBytes(bytesTotal)} (${percentage}%)`;
        },
        // Callback for once the upload is completed
        onSuccess: () => {
          this.upload.showUploadSuccessModal = true;
          this.upload.uploading = false;
          this.upload.upload_paused = false;
          this.upload.percentage = 0;
          this.upload.status = "Initializing . . .";
          this.upload.load_del_content_btn = false;
        },
      });

      var startOrResumeUpload = (tus_upload) => {
        // Check if there are any previous uploads to continue.
        tus_upload.findPreviousUploads().then(function (previousUploads) {
          // Found previous uploads so we select the first one.
          if (previousUploads.length) {
            tus_upload.resumeFromPreviousUpload(previousUploads[0]);
          }
          // Start the upload
          tus_upload.start();
        });
      };

      // Add listeners for the pause and unpause button
      var pauseUnpauseButton = this.$refs.pauseUpauseContent;

      pauseUnpauseButton.addEventListener("click", () => {
        this.upload.upload_paused = !this.upload.upload_paused;
        if (this.upload.upload_paused) {
          tus_upload.abort();
        } else {
          startOrResumeUpload(tus_upload);
        }
      });

      startOrResumeUpload(tus_upload);
    },
    deleteContent: async function (retry) {
      this.upload.load_del_content_btn = true;
      const response = await this.gangStore.delContent();
      if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const authStore = useAuthStore();
          const ref_token_resp = await authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.deleteContent(false);
          }
        } else {
          // Error even after refreshing token
          this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else if (response >= 404) {
        // Server error
        this.$parent.$parent.$parent.$parent.$parent.$parent.srvErrModal();
      }
      this.upload.uploading = false;
      this.upload.upload_paused = false;
      this.upload.percentage = 0;
      this.upload.status = "Initializing . . .";
      this.upload.load_del_content_btn = false;
    },
    toggleAddGangMemberModal: function () {
      this.search.showAddMemberModal = !this.search.showAddMemberModal;
    },
    toggleUploadSuccessModal: function () {
      this.upload.showUploadSuccessModal = !this.upload.showUploadSuccessModal;
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
      } else if (
        this.update.gang_pass_key.length > 1 &&
        this.update.gang_pass_key.length < 5
      ) {
        // gang_passkey length should be >= 5
        error = "Gang passkey should be of at least 5 characters.";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      }
      return true;
    },
  },
  async mounted() {
    // Detect when scrolled to bottom.
    const listElm = document.querySelector("#member-search-parent");
    listElm.addEventListener("scroll", async () => {
      if (
        listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight &&
        this.search.cursor != 0
      ) {
        await this.searchWithDelay(false);
      }
    });
  },
};
</script>

<style scoped lang="css">
.gang-members-box-md {
  max-height: 250px;
  width: 350px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.gang-members-box-md::-webkit-scrollbar {
  display: none;
}

.mb-1-5 {
  margin-bottom: 0.375rem;
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

input::file-selector-button {
  cursor: pointer;
  background: rgb(241, 133, 121);
  color: white;
  border-color: transparent;
  box-shadow: none;
  outline: none;
  width: 150px;
  padding: 0.75rem;
  height: 48px;
  border-radius: 0.375rem;
  margin-right: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.2s ease-in;
}

input::file-selector-button:hover {
  background: rgb(228, 77, 60);
}

input:disabled::file-selector-button {
  background: grey;
  cursor: auto;
}

.upload-box {
  background-color: rgba(243, 246, 248, 1);
  height: auto;
  padding: 0.375rem;
  border: 2px solid #efefef;
}

.upload-text-progress {
  font-size: 13px;
}

.progress-bar {
  background-color: rgb(241, 133, 121);
}

.content-box {
  width: 350px;
}

.content-txt {
  font-size: 13px;
  width: 290px;
}

.form-check-input[type="checkbox"] {
  border-radius: 1rem;
  border: 2px solid #dfdfdf;
}

.form-check-input[type="checkbox"]:focus {
  box-shadow: none;
  border: 2px solid rgb(241, 133, 121);
}

.form-check-input[type="checkbox"]:checked {
  border: 2px solid rgb(241, 133, 121);
  background-color: rgb(241, 133, 121);
}

@media only screen and (max-width: 1050px) {
  .content-box {
    width: 100%;
  }

  .content-txt {
    width: 360px;
  }
}

@media only screen and (max-width: 1000px) {
  .gang-members-box-md {
    max-height: 200px;
    width: 100%;
    margin-top: 0.8rem;
  }

  .content-box {
    width: 100%;
  }

  .content-txt {
    width: 360px;
  }
}
</style>
