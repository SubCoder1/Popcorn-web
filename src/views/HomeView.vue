<!--
  Home View of Popcorn.
  Components like GangCreate, GangJoin, UserAcc . . . are rendered through this View.
  Kinda like the dashboard pages in other applications. Needs auth users to access this view.
 -->

<template>
  <div
    class="home-view h-100 m-auto d-flex align-items-center justify-content-center"
  >
    <div class="gang-create-container h-auto container-style text-left p-5">
      <GangCreate />
    </div>
    <div class="d-flex flex-column">
      <div class="gang-join-container container-style text-left p-5">
        <GangJoin />
      </div>
      <div class="user-profile-container container-style w-auto mt-4 p-5">
        <UserProfile />
      </div>
    </div>
  </div>
</template>

<script>
import GangCreate from "@/components/GangCreate.vue";
import GangJoin from "@/components/GangJoin.vue";
import UserProfile from "@/components/UserProfile.vue";

export default {
  name: "HomeView",
  components: {
    GangCreate,
    GangJoin,
    UserProfile,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.gang-create-container {
  width: 700px;
  margin-right: 50px;
}

.gang-join-container {
  width: 410px;
  height: 390px;
}
</style>
