<!-- Invite via URL view of Popcorn which GangJoinViaUrl component -->

<template>
  <div class="d-flex align-items-center justify-content-center m-auto h-100">
    <div class="join-via-url-view container-style container-shadow p-3">
      <GangJoinViaUrl />
    </div>
  </div>
</template>

<script>
import GangJoinViaUrl from "@/components/gang/GangJoinViaUrl.vue";

export default {
  name: "InviteViaUrlView",
  components: {
    GangJoinViaUrl,
  },
};
</script>

<style scoped lang="css">
.join-via-url-view {
  height: auto;
  width: 500px;
}
</style>
