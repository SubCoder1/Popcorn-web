<!-- Gang Chat page component -->

<template>
  <div class="gang-interact-parent">
    <div class="gang-interact-header d-flex align-items-center">
      <div class="gang-info">
        <h4>{{ gangStore.getUserGang.gang_name }}</h4>
        <router-link to="" @click="goBackToGangList()">Go back</router-link>
      </div>
    </div>
    <div
      class="gang-interact-body d-flex flex-column text-wrap"
      ref="gangChatBody"
    >
      <div
        v-if="gangStore.getUserGang.gang_interact.length == 0"
        class="d-flex flex-column justify-content-center text-center m-auto"
      >
        <img
          class="gang-interact-img m-auto"
          src="@/assets/misc/gang-interact.png"
          alt="Empty search"
        />
        <span class="mt-3 text-secondary">A place for gang discussions!</span>
      </div>
      <transition-group name="fade" tag="div" v-else>
        <div
          class="d-flex flex-column"
          v-for="(msg, index) in gangStore.getUserGang.gang_interact"
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
</template>

<script>
import { useGangStore } from "@/stores/gang.store";
import { useUserStore } from "@/stores/user.store";

export default {
  name: "GangInteract",
  data() {
    return {
      gangStore: useGangStore(),
      userStore: useUserStore(),
      message: "",
    };
  },
  methods: {
    goBackToGangList: function () {
      this.$parent.$parent.goBack();
    },
    sendMessage: async function () {
      var userStore = useUserStore();
      if (this.message.length > 0) {
        var idx = this.gangStore.getUserGang.gang_interact.length;
        this.gangStore.getUserGang.gang_interact.push({
          type: "gangMessage",
          message: this.message,
          status: "sending",
          user: {
            username: userStore.getUserName,
            user_profile_pic: userStore.getUserProfPic,
          },
        });
        const response = await this.gangStore.sendGangMessage(
          idx,
          this.message
        );
        if (response >= 500) {
          this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
        }
        this.message = "";
      }
    },
    scrollToBottomOfChatBody() {
      const el = this.$refs.gangChatBody;
      el.scrollTop = el.scrollHeight;
    },
  },
  mounted() {
    this.scrollToBottomOfChatBody();
  },
};
</script>

<style scoped lang="css">
.gang-interact-header {
  height: 109px;
}
.gang-interact-body {
  height: 490px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
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
</style>
