<!--
  Home View of Popcorn.
  Components like GangDashboard sub-view, GangInvite, UserProfile . . . are rendered through this View.
 -->

<template>
  <div
    class="home-view h-100 m-auto d-flex align-items-center justify-content-center"
  >
    <div
      class="gang-dashboard-container h-auto container-style text-left me-4 p-5"
    >
      <router-view />
    </div>
    <div class="d-flex flex-column">
      <div class="gang-invite-container container-style text-left">
        <GangInvite />
      </div>
      <div class="user-profile-container container-style w-auto mt-4 p-5">
        <UserProfile />
      </div>
    </div>
  </div>
</template>

<script>
import GangInvite from "@/components/GangInvite.vue";
import UserProfile from "@/components/UserProfile.vue";

export default {
  name: "HomeView",
  components: {
    GangInvite,
    UserProfile,
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
