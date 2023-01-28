<!--
  Home View of Popcorn.
  Components like GangDashboard sub-view, GangInvite, UserProfile . . . are rendered through this View.
 -->

<template>
  <div
    class="home-view h-100 m-auto d-flex align-items-center justify-content-center"
  >
    <div
      class="gang-dashboard-container h-auto container-style container-shadow text-left me-4 p-4"
    >
      <GangDashboard />
    </div>
    <div class="d-flex flex-column">
      <div
        class="gang-invite-container container-style container-shadow text-left p-4"
      >
        <GangInvite />
      </div>
      <div
        class="user-profile-container container-style container-shadow w-auto mt-4 p-4"
      >
        <UserProfile />
      </div>
    </div>
  </div>
</template>

<script>
import GangDashboard from "@/components/gang/GangDashboard.vue";
import GangInvite from "@/components/gang/GangInvite.vue";
import UserProfile from "@/components/user/UserProfile.vue";

export default {
  name: "HomeView",
  components: {
    GangInvite,
    UserProfile,
    GangDashboard,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.gang-dashboard-container {
  width: 700px;
}

.gang-invite-container {
  width: 410px;
  height: 280px;
}
</style>
