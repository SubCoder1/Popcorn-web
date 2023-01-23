<template>
  <div class="d-flex flex-column">
    <div
      class="d-flex flex-row justify-content-between mb-3"
      v-bind:key="gang"
      v-for="gang in gangData"
    >
      <div class="d-flex border-left ps-3">
        <div class="d-flex flex-column justify-content-center">
          <p class="text-sm mb-1">{{ gang.gang.gang_name }}</p>
          <p class="text-sm mb-1 text-secondary">
            Admin: {{ gang.gang.gang_admin }}
          </p>
          <p class="text-sm mb-1 text-secondary">
            {{ gang.members }} / {{ gang.gang.gang_member_limit }} members
          </p>
        </div>
      </div>
      <div class="d-flex flex-column">
        <p class="text-xsm text-secondary text-end">
          {{ gang.gang_created_timeago }}
        </p>
        <button
          v-if="gang.is_admin"
          type="button"
          class="btn btn-sm rounded-md text-sm"
        >
          Customize
        </button>
        <button v-else type="button" class="btn btn-sm rounded-md text-sm">
          Join
        </button>
      </div>
    </div>
  </div>
  <router-link
    to=""
    v-if="canJoin"
    @click="this.$parent.$parent.showJoinGangOnly()"
  >
    Join a gang
  </router-link>
  <router-link
    to=""
    v-if="canCreate"
    @click="this.$parent.$parent.showCreateGangOnly()"
  >
    Create a gang
  </router-link>
</template>

<script>
export default {
  props: {
    gangData: Object,
    canCreate: Boolean,
    canJoin: Boolean,
  },
  name: "GangList",
};
</script>
