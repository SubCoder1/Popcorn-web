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
        {{ gangStore.getUserGang.gang_created }}
      </p>
      <div class="d-flex flex-row justify-content-between">
        <button
          v-if="gangStore.getUserGang.is_admin"
          type="button"
          class="btn btn-circle d-flex align-items-center justify-content-center rounded-circle"
          v-bind:class="{ 'admin-btn': gangStore.getUserGang.is_admin }"
          @click="showCustomizeGangOnly(gangStore.getUserGang)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="currentColor"
            class="bi bi-pencil"
            viewBox="0 0 16 16"
          >
            <path
              d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
            />
          </svg>
        </button>
        <button
          v-else
          type="button"
          class="btn btn-circle d-flex align-items-center justify-content-center rounded-circle"
        >
          J
        </button>
        <button
          v-if="gangStore.getUserGang.is_admin"
          type="button"
          class="btn btn-circle d-flex align-items-center justify-content-center rounded-circle delete-gang-btn"
          v-bind:class="{ 'admin-btn': gangStore.getUserGang.is_admin }"
          @click="delGang()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="currentColor"
            class="bi bi-trash3"
            viewBox="0 0 16 16"
          >
            <path
              d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
            />
          </svg>
        </button>
        <button
          v-else
          type="button"
          class="btn btn-circle d-flex align-items-center justify-content-center rounded-circle leave-gang-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
            />
          </svg>
        </button>
      </div>
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
    delGang: async function () {
      this.$parent.$parent.delUserCreatedGang(true);
    },
  },
};
</script>
