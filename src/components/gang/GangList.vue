<template>
  <div class="d-flex justify-content-between">
    <div
      class="d-flex br-left ps-3"
      v-bind:class="{
        'br-left': !gangStore.getUserGang.is_admin,
        'admin-br-left': gangStore.getUserGang.is_admin,
      }"
    >
      <div class="d-flex flex-column justify-content-center">
        <p class="text-sm mb-1">
          {{ gangStore.getUserGang.gang_name }}
        </p>
        <p class="text-sm mb-1 text-secondary">
          Admin: {{ gangStore.getUserGang.gang_admin }}
        </p>
        <p class="text-sm mb-1 text-secondary">
          {{ gangStore.getUserGang.gang_members_count }} /
          {{ gangStore.getUserGang.gang_member_limit }} members
        </p>
      </div>
    </div>
    <div class="d-flex flex-column">
      <p class="text-xsm text-secondary text-end">
        {{ gangStore.getUserGang.gang_createdaa }}
      </p>
      <button
        v-if="gangStore.getUserGang.is_admin"
        type="button"
        class="btn btn-sm rounded-md text-sm"
        v-bind:class="{ 'admin-btn': gangStore.getUserGang.is_admin }"
        @click="showCustomizeGangOnly(gangStore.getUserGang)"
      >
        Customize
      </button>
      <button v-else type="button" class="btn btn-sm rounded-md text-sm">
        Join
      </button>
    </div>
  </div>
  <router-link to="" v-if="gangStore.canJoinGang" @click="showGangList()">
    Join a gang
  </router-link>
  <router-link to="" v-if="gangStore.canCreateGang" @click="showGangList()">
    Create a gang
  </router-link>
</template>

<script>
import { useGangStore } from "@/stores/gang.store";

export default {
  name: "GangList",
  data() {
    return {
      gangStore: useGangStore(),
    };
  },
  methods: {
    showGangList: function () {
      this.$parent.$parent.toggleGangList();
    },
    showCustomizeGangOnly: function (gang) {
      this.$parent.$parent.showCustomizeGangOnly(gang);
    },
  },
};
</script>
