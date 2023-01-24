<template>
  <div class="d-flex flex-column">
    <div
      class="d-flex flex-row justify-content-between mb-3"
      v-for="gang in gangData"
      :key="gang.gang_admin"
    >
      <div
        class="d-flex br-left ps-3"
        v-bind:class="{
          'br-left': !gang.gang_admin,
          'admin-br-left': gang.gang_admin,
        }"
      >
        <div class="d-flex flex-column justify-content-center">
          <p class="text-sm mb-1">{{ gang.gang_name }}</p>
          <p class="text-sm mb-1 text-secondary">
            Admin: {{ gang.gang_admin }}
          </p>
          <p class="text-sm mb-1 text-secondary">
            {{ gang.gang_members_count }} / {{ gang.gang_member_limit }} members
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
          v-bind:class="{ 'admin-btn': gang.is_admin }"
        >
          Customize
        </button>
        <button v-else type="button" class="btn btn-sm rounded-md text-sm">
          Join
        </button>
      </div>
    </div>
  </div>
  <router-link to="" v-if="canJoin" @click="showJoinGangOnly()">
    Join a gang
  </router-link>
  <router-link to="" v-if="canCreate" @click="showCreateGangOnly()">
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
  methods: {
    showJoinGangOnly: async function () {
      await this.$parent.$parent.showJoinGangOnly();
    },
    showCreateGangOnly: async function () {
      await this.$parent.$parent.showCreateGangOnly();
    },
  },
};
</script>
