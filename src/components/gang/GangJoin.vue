<!-- Join Gang form component rendered through HomeView -->

<template>
  <h4>Join a Gang!</h4>
  <router-link :to="{ name: 'creategang' }">or create one?</router-link>
</template>

<script>
export default {
  data() {
    return {};
  },
  name: "GangJoin",
  methods: {},
};
</script>
