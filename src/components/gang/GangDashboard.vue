<!-- Gang Dashboard sub-view of Popcorn, rendered through HomeView. -->

<template>
  <div
    :class="{ 'h-75': split_screen }"
    class="stream-player d-flex align-items-center justify-content-center"
    v-if="
      gang_stream_loading &&
      (!gangStore.getUserGang.gang_screen_share ||
        (!gangStore.getUserGang.is_admin &&
          gangStore.getUserGang.gang_screen_share))
    "
  >
    <div class="loader"></div>
  </div>
  <div
    ref="remoteMediaContainer"
    :class="{
      'player-split-screen': split_screen && !gang_stream_loading,
      'stream-player':
        load_video &&
        (!gangStore.getUserGang.gang_screen_share ||
          (!gangStore.getUserGang.is_admin &&
            gangStore.getUserGang.gang_screen_share)),
    }"
    @dblclick="togglePlayerFullScreen"
  ></div>
  <div
    :class="{
      'h-25': split_screen,
      'd-flex': !play_permission || split_screen,
      'align-items-center': !play_permission || split_screen,
      'justify-content-center': !play_permission,
    }"
    class="gang-users flex-column pb-3 p-4"
    v-if="!gangStore.canCreateGang || !gangStore.canJoinGang"
  >
    <button
      type="button"
      class="btn rounded-md text-xsm allow-play-perm h-auto"
      v-if="!play_permission"
      @click="handleLiveKitEvents(false)"
    >
      click here to allow voice or video interactions
    </button>
    <div v-else class="d-flex justify-content-between">
      <div class="d-flex flex-column align-items-center justify-content-around">
        <button
          type="button"
          class="btn btn-circle-md d-flex align-items-center justify-content-center rounded-circle p-0"
          :class="{ 'mic-btn': speaking, 'mic-off-btn': !speaking }"
          :disabled="loading_members"
          @click="toggleMic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="18"
            fill="currentColor"
            class="bi bi-mic"
            viewBox="0 0 16 16"
            v-if="speaking"
          >
            <path
              d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"
            />
            <path
              d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="18"
            fill="currentColor"
            class="bi bi-mic-mute"
            viewBox="0 0 16 16"
            v-else
          >
            <path
              d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3z"
            />
            <path
              d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="btn btn-circle-md d-flex align-items-center justify-content-center rounded-circle p-0"
          :class="{ 'ss-on': split_screen, 'ss-off': !split_screen }"
          v-if="
            !small_screen &&
            gangStore.getUserGang.gang_streaming &&
            (!gangStore.getUserGang.gang_screen_share ||
              !gangStore.getUserGang.is_admin)
          "
          @click="toggleSplitScreen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            fill="currentColor"
            class="bi bi-grid-1x2"
            viewBox="0 0 16 16"
          >
            <path
              d="M6 1H1v14h5V1zm9 0h-5v5h5V1zm0 9v5h-5v-5h5zM0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm1 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-5z"
            />
          </svg>
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="26"
          fill="currentColor"
          class="bi bi-arrow-down"
          :class="{ expanded: expand_members }"
          viewBox="0 0 16 16"
          @click="expand_members = !expand_members"
          v-if="gangStore.getUserGang.gang_members.length > 3 && !split_screen"
        >
          <path
            fill-rule="evenodd"
            d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
          />
        </svg>
      </div>
      <div
        v-if="loading_members"
        class="d-flex flex-row justify-content-between w-100"
      >
        <div class="d-flex flex-column align-items-center me-3 ms-3">
          <div class="skeleton user-prof-skeleton-lg rounded-circle mb-2"></div>
          <div class="skeleton skeleton-text skeleton-text-sm mb-1"></div>
          <div class="skeleton skeleton-text skeleton-text-xsm"></div>
        </div>
        <div class="d-flex flex-column align-items-center me-3 ms-3">
          <div class="skeleton user-prof-skeleton-lg rounded-circle mb-2"></div>
          <div class="skeleton skeleton-text skeleton-text-sm mb-1"></div>
          <div class="skeleton skeleton-text skeleton-text-xsm"></div>
        </div>
        <div class="d-flex flex-column align-items-center me-3 ms-3">
          <div class="skeleton user-prof-skeleton-lg rounded-circle mb-2"></div>
          <div class="skeleton skeleton-text skeleton-text-sm mb-1"></div>
          <div class="skeleton skeleton-text skeleton-text-xsm"></div>
        </div>
        <div
          class="d-flex flex-column align-items-center me-3 ms-3"
          v-if="!small_screen"
        >
          <div class="skeleton user-prof-skeleton-lg rounded-circle mb-2"></div>
          <div class="skeleton skeleton-text skeleton-text-sm mb-1"></div>
          <div class="skeleton skeleton-text skeleton-text-xsm"></div>
        </div>
      </div>
      <div
        v-else
        ref="memberActivity"
        class="d-flex flex-row w-100 overflow-auto"
        :class="{ 'expand-members-tab': expand_members }"
      >
        <div
          v-for="member in active_members"
          :key="member"
          :id="member[0]"
          class="member position-relative d-flex flex-column align-items-center ms-3 me-3"
        >
          <div
            class="d-flex align-items-center justify-content-center member-view rounded-circle"
            ref="memberRef"
            :class="{
              speaking: isParticipantSpeaking(member[0]),
              'user-split-screen': split_screen,
              'user-expanded': expand_members,
            }"
          >
            <img
              v-bind:src="
                require(`@/assets/profile/${getMemberProfilePic(member[0])}`)
              "
              class="profile-pic-lg"
              alt="User profile picture"
            />
          </div>
          <span class="text-secondary text-xsm">@{{ member[0] }}</span>
          <button
            v-if="!member[1].isLocal"
            class="btn btn-circle-sm rounded-circle position-absolute d-flex align-items-center justify-content-center p-0"
            :class="{
              'mute-sound-btn': member[1].getVolume() != 0,
              'unmute-sound-btn': member[1].getVolume() == 0,
            }"
            @click="toggleMemberNoise(member[1])"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-volume-mute"
              viewBox="0 0 16 16"
              v-if="member[1].getVolume() != 0"
            >
              <path
                d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06M6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-volume-up"
              viewBox="0 0 16 16"
              v-else
            >
              <path
                d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"
              />
              <path
                d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"
              />
              <path
                d="M10.025 8a4.5 4.5 0 0 1-1.318 3.182L8 10.475A3.5 3.5 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.5 4.5 0 0 1 10.025 8M7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      class="d-flex align-items-center justify-content-center text-secondary text-xsm mt-3 m-auto"
      v-if="play_permission && !loading_members"
    >
      ---
      <div class="online rounded-circle ms-2 me-2"></div>
      {{ active_members.size }} active ---
    </div>
  </div>
  <div v-if="loading" class="d-flex flex-column pt-0 p-4">
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
    <div class="d-flex flex-row">
      <div class="skeleton user-prof-skeleton-md rounded-circle me-3"></div>
      <div class="d-flex flex-column justify-content-center">
        <div class="skeleton skeleton-text mb-3"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  </div>
  <div v-else-if="!split_screen" class="d-flex flex-column">
    <GangList v-if="showGangList" />
    <GangInteract v-else-if="showGangInteract" />
    <div class="h-auto" v-else>
      <template v-if="gangStore.canCreateGang && gangStore.canJoinGang">
        <div
          class="d-flex flex-wrap align-items-center justify-content-between p-4 pb-2"
        >
          <div>
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
          </div>
          <div class="mt-1 mb-1">
            <p
              class="form-errors rounded-md text-sm mb-0"
              v-bind:class="{ 'show-error': showErr, 'd-none': !showErr }"
            >
              {{ formErr }}
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="d-flex flex-wrap align-items-center justify-content-between p-4 pb-0"
        >
          <div class="dashboard-header">
            <h4 v-if="showCustomizePage">Customize Gang</h4>
            <h4 v-else-if="gangStore.canCreateGang">Create a Gang</h4>
            <h4 v-else>Join a Gang</h4>
            <router-link to="" @click="goBack()">Go back</router-link>
          </div>
          <div class="mt-1 mb-1">
            <p
              class="form-errors rounded-md text-sm"
              v-bind:class="{ 'show-error': showErr, 'd-none': !showErr }"
            >
              {{ formErr }}
            </p>
          </div>
        </div>
      </template>
      <GangCustomize v-if="showCustomizePage" />
      <GangJoin v-else-if="gangStore.canJoinGang && createOrJoin" />
      <GangCreate v-else />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { useGangStore } from "@/stores/gang.store";
import { useUserStore } from "@/stores/user.store";
import { defineAsyncComponent } from "vue";
import time2TimeAgo from "@/utils/timeago";
import { Room, RoomEvent } from "livekit-client";
import { ref } from "vue";

let sseClient;

const remoteMediaContainer = ref(null);
const memberRef = ref([]);
const memberActivity = ref(0);

const room = new Room({
  // automatically manage subscribed video quality
  adaptiveStream: true,
  dynacast: true,
});

export default {
  data() {
    return {
      loading: true,
      small_screen: false,
      loading_members: false,
      gangStore: useGangStore(),
      userStore: useUserStore(),
      authStore: useAuthStore(),
      createOrJoin: true, // true -> join, false -> create
      showGangList: false,
      showCustomizePage: false,
      showGangInteract: false,
      showErr: false,
      formErr: "",
      gang_stream_loading: false,
      load_audio: false,
      load_video: false,
      play_permission: false,
      active_members: new Map(),
      active_speakers: [],
      speaking: false,
      expand_members: false,
      split_screen: false,
    };
  },
  name: "GangDashboard",
  methods: {
    getUserGang: async function (retry) {
      this.loading = true;
      const response = await this.gangStore.getGang();
      if (response == 200) {
        this.loading = false;
        if (this.gangStore.canCreateGang && this.gangStore.canJoinGang) {
          this.showGangList = false;
        } else {
          this.showGangList = true;
        }
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const ref_token_resp = await this.authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.getUserGang(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.$parent.srvErrModal();
      }
    },
    delUserCreatedGang: async function (retry) {
      const response = await this.gangStore.delGang();
      if (response == 200) {
        this.authStore.stream_token = "";
        await this.getUserGang(false);
      } else if (response == 401) {
        // Unauthorized
        if (retry == false) {
          // access_token expired, use refresh_token to refresh JWT
          // Try again on success
          const ref_token_resp = await this.authStore.refreshToken();
          if (ref_token_resp.status == 200) {
            await this.delUserCreatedGang(true);
          }
        } else {
          // Not able to create gang even after refreshing token
          this.$parent.$parent.$parent.$parent.srvErrModal();
        }
      } else {
        // Server error
        this.$parent.$parent.$parent.$parent.srvErrModal();
      }
      return response;
    },
    // used when user can create and join a gang
    toggleCreateOrJoinGang: function () {
      this.createOrJoin = !this.createOrJoin;
    },
    goBack: function () {
      this.showGangList = true;
      this.showCustomizePage = false;
      this.showGangInteract = false;
    },
    showCustomizeGangOnly: function (gang) {
      this.showGangList = false;
      this.showCustomizePage = true;
    },
    showGangInteractOnly: function () {
      this.showGangList = false;
      this.showGangInteract = true;
    },
    // used in GangList component to switch to create or join gang view
    toggleGangList: function () {
      this.showCustomizePage = false;
      this.showGangList = !this.showGangList;
    },
    ErrPopUp: function (errMsg) {
      this.formErr = errMsg;
      this.showErr = true;
    },
    removeErr: function () {
      this.showErr = false;
      this.formErr = "";
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
    handleLiveKitEvents: async function (retry) {
      if (!this.play_permission) {
        this.play_permission = true;
        this.loading_members = true;
        // Fetch livekit client token from popcorn server if not present
        if (!this.authStore.getUserStreamToken.length) {
          const response = await this.authStore.getStreamingToken();
          if (response != 200 || !this.authStore.getUserStreamToken.length) {
            if (response == 401) {
              // Unauthorized
              if (retry == false) {
                // access_token expired, use refresh_token to refresh JWT
                // Try again on success
                const ref_token_resp = await this.authStore.refreshToken();
                if (ref_token_resp.status == 200) {
                  await this.handleLiveKitEvents(true);
                }
              } else {
                // Not able to create gang even after refreshing token
                this.$parent.$parent.$parent.$parent.srvErrModal();
              }
            } else {
              // Server error
              this.$parent.$parent.$parent.$parent.srvErrModal();
            }
          }
        }
        // Connect with livekit room using the fetched token
        await room
          .connect(
            process.env.VUE_APP_LIVEKIT_HOST_URL,
            this.authStore.getUserStreamToken
          )
          .then(() => {
            this.loading_members = false;
            console.log("connected to room - ", room.name);
            room.participants.forEach((p) => {
              this.handleConnectedParticipant(p);
            });
          })
          .catch(async () => {
            if (retry == false) {
              this.play_permission = false;
              this.authStore.stream_token = "";
              await this.handleLiveKitEvents(false);
            } else {
              this.$parent.$parent.$parent.$parent.srvErrModal();
            }
          });
      }
    },
    handleTrackSubscribed: function (track, publication, participant) {
      const media = publication.track.attach();
      if (
        participant.identity == "gang_admin" ||
        participant.identity == this.gangStore.getUserGang.gang_admin
      ) {
        // Stream
        this.gang_stream_loading = false;
        if (publication.kind == "video" && !this.load_video) {
          this.load_video = true;
          this.$refs.remoteMediaContainer.appendChild(media);
        } else if (publication.kind == "audio" && !this.load_audio) {
          this.load_audio = true;
          this.$refs.remoteMediaContainer.appendChild(media);
        }
      } else {
        // User video or audio
        if (this.play_permission) {
          var member_div = this.$refs.memberRef.find(
            (x) => x.id == participant.identity
          );
          if (member_div != undefined) {
            member_div.appendChild(media);
          }
        }
      }
    },
    handleActiveSpeakers: function (speakers) {
      this.active_speakers = speakers;
    },
    handleConnectedParticipant: function (participant) {
      if (participant.identity != "gang_admin") {
        this.active_members.set(participant.identity, participant);
      }
    },
    handleDisconnectedParticipant: function (participant) {
      if (participant.identity != "gang_admin") {
        delete this.active_members.delete(participant.identity);
      }
    },
    handleScreenShare: function (action) {
      if (action) {
        if (!room.localParticipant.isScreenShareEnabled) {
          room.localParticipant.setScreenShareEnabled(true, {
            audio: true,
            video: true,
          });
        }
      } else {
        if (room.localParticipant.isScreenShareEnabled) {
          room.localParticipant.setScreenShareEnabled(false);
        }
      }
    },
    handleScreenShareStopped: async function (publication, participant) {
      if (publication.source == "screen_share") {
        await this.stopContentAPI();
      }
    },
    isParticipantSpeaking: function (participant) {
      let result = false;
      this.active_speakers.forEach((speaker) => {
        if (speaker.identity == participant) {
          result = true;
          return;
        }
      });
      return result;
    },
    toggleMic: function () {
      this.speaking = !this.speaking;
      room.localParticipant.setMicrophoneEnabled(this.speaking);
    },
    toggleMemberNoise: function (member) {
      if (member.getVolume() == 0) {
        member.setVolume(1); // Unmute
      } else {
        member.setVolume(0); // Mute
      }
    },
    clearStream: async function () {
      this.load_video = false;
      this.load_audio = false;
      this.gang_stream_loading = false;
      this.$refs.remoteMediaContainer.innerHTML = "";
    },
    togglePlayerFullScreen: function (event) {
      const playerElement = event.target;
      if (!document.fullscreenElement) {
        playerElement.requestFullscreen();
      } else if (document.exitFullScreen) {
        document.exitFullscreen();
      }
    },
    enterFullScreen: function () {
      var isInFullScreen =
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
          document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
          document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
      var elem = document.documentElement;
      if (!isInFullScreen) {
        elem.requestFullscreen();
      }
    },
    exitFullScreen: function () {
      var isInFullScreen =
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
          document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
          document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
      if (isInFullScreen) {
        document.exitFullscreen();
      }
    },
    detectSmallScreen: function (e) {
      this.small_screen = window.innerWidth < 995;
    },
    getMemberProfilePic: function (member) {
      var m = this.gangStore.getUserGang.gang_members.find(
        (m) => m.username == member
      );
      if (m != undefined) {
        return m.user_profile_pic;
      }
      return "default.png";
    },
    toggleSplitScreen: function () {
      this.split_screen = !this.split_screen;
      if (this.split_screen) {
        this.enterFullScreen();
      } else {
        this.exitFullScreen();
      }
      this.$parent.$parent.toggleSplitScreen();
    },
  },
  components: {
    GangList: defineAsyncComponent(() => import("./GangList.vue")),
    GangCreate: defineAsyncComponent(() => import("./GangCreate.vue")),
    GangJoin: defineAsyncComponent(() => import("./GangJoin.vue")),
    GangCustomize: defineAsyncComponent(() => import("./GangCustomize.vue")),
    GangInteract: defineAsyncComponent(() => import("./GangInteract.vue")),
  },
  async mounted() {
    window.addEventListener("resize", this.detectSmallScreen);
    this.detectSmallScreen();
    // Load Livekit room event handlers
    room.on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed);
    room.on(RoomEvent.ActiveSpeakersChanged, this.handleActiveSpeakers);
    room.on(RoomEvent.ParticipantConnected, this.handleConnectedParticipant);
    room.on(
      RoomEvent.ParticipantDisconnected,
      this.handleDisconnectedParticipant
    );
    room.on(RoomEvent.LocalTrackUnpublished, this.handleScreenShareStopped);
    await this.getUserGang(false);
    // Mark yourself as active
    this.active_members.set(this.userStore.getUserName, room.localParticipant);

    sseClient = await this.$sse.create({
      url: process.env.VUE_APP_SSE_API,
      format: "json",
      withCredentials: true,
      polyfill: true,
    });
    sseClient.connect().catch((err) => {
      // When this error is caught, it means the initial connection to the
      // events server failed.  No automatic attempts to reconnect will be made.
      console.error("Failed to connect to server", err);
      this.$parent.$parent.$parent.$parent.srvErrModal();
    });
    // Handle incoming gangInvite messages from server
    sseClient.on("gangInvite", (msg) => {
      // Values used in GangInvite frontend
      msg.message.load_accept_btn = false;
      msg.message.load_reject_btn = false;
      msg.message.is_expired = false;
      msg.message.invite_sent_timeago = time2TimeAgo(
        msg.message.invite_sent_timeago
      );
      // Add the new invite in the array
      let f = this.gangStore.userGangInvites.findIndex(
        (e) => e.gang_admin == msg.message.gang_admin
      );
      if (f > -1) {
        this.gangStore.userGangInvites[f] = msg.message;
      } else {
        this.gangStore.userGangInvites.unshift(msg.message);
      }
    });
    // Handle incoming gangJoin messages from server
    sseClient.on("gangJoin", (msg) => {
      msg.message.load_boot_btn = false;
      if (this.gangStore.getUserGang.gang_members != undefined) {
        this.gangStore.getUserGang.gang_members.push(msg.message);
        this.gangStore.getUserGang.gang_members_count =
          this.gangStore.getUserGang.gang_members.length;
        this.gangStore.getUserGangInteract.push({
          type: "gangJoin",
          message: msg.message,
        });
        memberActivity.value++;
      }
    });
    // Handle incoming gangBoot messages from server
    sseClient.on("gangBoot", async () => {
      this.authStore.stream_token = "";
      this.$parent.$parent.reloadDashboard();
    });
    // Handle incoming gangLeave messages from server
    sseClient.on("gangLeave", async (msg) => {
      await this.gangStore.getGang();
      this.gangStore.getUserGangInteract.push({
        type: "gangLeave",
        message: msg.message,
      });
    });
    // Handle incoming gangUpdate messages from server
    sseClient.on("gangUpdate", async () => {
      this.gangStore.getUserGangInteract.push({
        type: "gangUpdate",
        message: "THE GANG HAS BEEN UPDATED",
      });
      await this.gangStore.getGang();
    });
    // Handle incoming gangDelete messages from server
    sseClient.on("gangDelete", async () => {
      this.$parent.$parent.reloadDashboard();
    });
    // Handle incoming gangChat messages from server
    sseClient.on("gangMessage", (msg) => {
      this.gangStore.getUserGangInteract.push({
        type: "gangMessage",
        message: msg.message.text,
        user: msg.message.user,
      });
    });
    // Handle incoming gangPlayContent messages from server
    sseClient.on("gangPlayContent", async () => {
      this.gangStore.getUserGang.gang_streaming = true;
      this.gang_stream_loading = true;
      await this.handleLiveKitEvents(false);
    });
    // Handle incoming gangStopContent messages from server
    sseClient.on("gangEndContent", async () => {
      this.clearStream();
      if (this.split_screen) {
        this.toggleSplitScreen();
      }
      this.gangStore.getUserGangInteract.push({
        type: "gangUpdate",
        message: "THE STREAM HAS ENDED",
      });
      await this.gangStore.getGang();
    });
    // Handle incoming tokenRefresh requests from server
    sseClient.on("tokenRefresh", async () => {
      await this.authStore.getStreamingToken();
    });
    // Catch any errors (ie. lost connections, etc.)
    sseClient.on("error", (e) => {
      console.error("lost connection or failed to parse!", e);
      this.$parent.$parent.$parent.$parent.srvErrModal();
      // If this error is due to an unexpected disconnection, EventSource will
      // automatically attempt to reconnect indefinitely. You will _not_ need to
      // re-add your handlers.
    });
  },
  async beforeUnmount() {
    if (
      this.gangStore.getUserGang.gang_screen_share &&
      this.gangStore.getUserGang.gang_streaming
    ) {
      room.localParticipant.setScreenShareEnabled(false);
      await this.stopContentAPI();
    }
    await room.disconnect();
    // Make sure to close the connection with the events server
    // when the component is destroyed, or we'll have ghost connections!
    sseClient.disconnect();
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

.stream-player {
  height: 480px;
  border-radius: 0.5rem 0.5rem 0 0;
  width: auto;
  background: rgb(43, 42, 51);
}

.gang-users {
  height: auto;
  -moz-transition: all 0.3s ease-in;
  -webkit-transition: all 0.3s ease-in;
  -o-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.member-view {
  height: 100px;
  width: 100px;
  background: #80808029;
}

.speaking {
  border: 3.55px solid mediumaquamarine;
}

.member {
  animation: shift-left 0.3s ease-in forwards;
  -moz-transition: all 0.3s ease-in;
  -webkit-transition: all 0.3s ease-in;
  -o-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

@keyframes shift-left {
  0% {
    margin-left: 2rem;
  }
  100% {
    margin-left: 0;
  }
}

.expand-members-tab {
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.user-expanded {
  height: 120px !important;
  width: 120px !important;
}

.bi-arrow-down {
  position: relative;
  color: grey;
  cursor: pointer;
  top: 0;
  -moz-transition: all 0.2s ease-in;
  -webkit-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
}

.bi-arrow-down.expanded {
  transform: rotate(180deg);
}

.bi-arrow-down:hover {
  top: 5px;
}

.bi-arrow-down.expanded:hover {
  top: -5px;
}

.bi-grid {
  transform: rotate(90deg);
}

.player-split-screen {
  width: 100% !important;
  height: 75% !important;
  border-radius: 0% !important;
}

.user-split-screen {
  height: 160px !important;
  width: 160px !important;
}

.seperator {
  height: 5px;
  margin: 1rem;
}

.mute-sound-btn {
  top: 0;
  right: -10px;
  background: #db70936e;
}

.unmute-sound-btn {
  top: 0;
  right: -10px;
  background: #66cdaa6e;
}

.online {
  height: 8px;
  width: 8px;
  background: mediumaquamarine;
  position: relative;
  top: 1px;
}

@media only screen and (max-width: 497px) {
  .stream-player {
    height: 285px;
  }
}
</style>
