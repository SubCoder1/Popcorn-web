<!-- Gang Chat page component -->

<template>
  <div class="gang-interact-body"></div>
</template>

<script>
import { useGangStore } from "@/stores/gang.store";

export default {
  name: "GangInteract",
  data() {
    return {
      gangStore: useGangStore(),
    };
  },
};
</script>
