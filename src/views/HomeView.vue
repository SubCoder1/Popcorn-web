<!--
  Home View of Popcorn.
  Components like GangDashboard sub-view, GangInvite, UserProfile . . . are rendered through this View.
 -->

<template>
  <div
    class="home-view d-flex align-items-center justify-content-center"
    :class="{
      'flex-column': small_screen,
      'h-100 m-auto': !small_screen,
    }"
  >
    <div
      class="d-flex align-items-center justify-content-center mb-3 mt-2"
      :class="{ 'd-none': !small_screen || split_screen }"
    >
      <button
        class="btn btn-sm ms-2 dashboard-collapse-btn collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseDashboard"
        aria-expanded="false"
        aria-controls="collapseDashboard"
        ref="collapseDashboard"
        @click="switchTabs('dashboard')"
      >
        Dashboard
      </button>
      <button
        class="btn btn-sm ms-2 user-collapse-btn collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExtras"
        aria-expanded="false"
        aria-controls="collapseExtras"
        ref="collapseExtras"
        @click="switchTabs('extras')"
      >
        User
      </button>
    </div>
    <div
      class="adjust-dashboard"
      :class="{
        collapse: small_screen,
        'h-100 w-100': split_screen && !small_screen,
      }"
      id="collapseDashboard"
    >
      <div
        :class="{
          'h-100 w-100': split_screen && !small_screen,
          'gang-dashboard-container h-auto': !split_screen,
        }"
        class="container-style container-shadow text-left"
      >
        <GangDashboard :key="reload" />
      </div>
    </div>
    <div
      v-if="!split_screen"
      :class="{
        collapse: small_screen,
        'd-flex': !small_screen,
        'me-4': small_screen,
      }"
      class="flex-column ms-4"
      id="collapseExtras"
    >
      <div
        class="gang-invite-container container-style container-shadow text-left p-4"
      >
        <GangInvite />
      </div>
      <div
        class="user-profile-container container-style container-shadow w-auto mt-4 mb-2 p-4"
      >
        <UserProfile />
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "HomeView",
  components: {
    GangInvite: defineAsyncComponent(() =>
      import("@/components/gang/GangInvite.vue")
    ),
    UserProfile: defineAsyncComponent(() =>
      import("@/components/user/UserProfile.vue")
    ),
    GangDashboard: defineAsyncComponent(() =>
      import("@/components/gang/GangDashboard.vue")
    ),
  },
  data() {
    return {
      reload: 0,
      small_screen: false,
      split_screen: false,
    };
  },
  methods: {
    reloadDashboard: function () {
      this.reload += 1;
    },
    detectSmallScreen: function (e) {
      this.small_screen = window.innerWidth < 995;
    },
    switchTabs: function (to) {
      if (to == "extras") {
        this.$refs.collapseDashboard.classList.remove("active");
        this.$refs.collapseExtras.classList.add("active");
        if (!this.$refs.collapseDashboard.classList.contains("collapsed")) {
          this.$refs.collapseDashboard.click();
        }
      } else {
        this.$refs.collapseExtras.classList.remove("active");
        this.$refs.collapseDashboard.classList.add("active");
        if (!this.$refs.collapseExtras.classList.contains("collapsed")) {
          this.$refs.collapseExtras.click();
        }
      }
    },
    toggleSplitScreen: function () {
      this.split_screen = !this.split_screen;
    },
  },
  mounted() {
    window.addEventListener("resize", this.detectSmallScreen);
    // default
    this.detectSmallScreen();
    if (this.small_screen) {
      this.$refs.collapseDashboard.click();
    }
  },
  unmounted() {
    window.removeEventListener("resize", this.myEventHandler);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.gang-dashboard-container {
  width: 800px;
  max-height: 782px;
  overflow: auto;
}

.gang-invite-container {
  width: 460px;
  height: 320px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.gang-invite-container::-webkit-scrollbar {
  display: none;
}

.adjust-dashboard {
  width: auto;
}

.dashboard-collapse-btn,
.user-collapse-btn {
  background: #f8f6f3;
  border: 2px solid mediumpurple;
  color: mediumpurple;
}

.dashboard-collapse-btn:hover,
.user-collapse-btn:hover {
  background: mediumpurple;
  color: white;
}

.dashboard-collapse-btn:focus,
.user-collapse-btn:focus,
.dashboard-collapse-btn:active,
.user-collapse-btn:active {
  background: #7b56c7;
}

.dashboard-collapse-btn.active,
.user-collapse-btn.active {
  background: #7b56c7;
  color: white;
}

@media only screen and (max-width: 1180px) {
  .gang-dashboard-container {
    width: 600px;
    margin-top: 5px;
  }

  .gang-invite-container {
    width: 390px;
    height: 280px;
  }
}

@media only screen and (max-width: 1000px) {
  .gang-dashboard-container {
    width: 510px;
  }

  .gang-invite-container {
    height: 270px;
    width: 370px;
  }
}

@media only screen and (max-width: 552px) {
  .gang-dashboard-container {
    margin-right: 0;
    margin: 12px;
    width: auto;
    max-height: 715px;
  }

  .adjust-dashboard {
    width: 100%;
  }

  .gang-invite-container {
    width: 340px;
  }
}
</style>
