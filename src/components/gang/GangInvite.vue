<template>
  <div v-if="loading" class="d-flex flex-column p-5">
    <div class="d-flex flex-row mb-3">
      <div class="skeleton user-prof-skeleton-md rounded-circle me-3"></div>
      <div class="d-flex flex-column justify-content-center">
        <div class="skeleton skeleton-text mb-3"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
    <div class="d-flex flex-row mb-3">
      <div class="skeleton user-prof-skeleton-md rounded-circle me-3"></div>
      <div class="d-flex flex-column justify-content-center">
        <div class="skeleton skeleton-text mb-3"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
    <div class="d-flex flex-row mb-3">
      <div class="skeleton user-prof-skeleton-md rounded-circle me-3"></div>
      <div class="d-flex flex-column justify-content-center">
        <div class="skeleton skeleton-text mb-3"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  </div>
  <div v-if="!loading" class="p-3 text-center">
    <lottie-player
      src="https://lottie.host/f088f560-cc3a-4726-9837-ddae25f3308f/2lDmiXa8JA.json"
      background="transparent"
      speed="1"
      loop
      autoplay
      v-pre
    >
    </lottie-player>
    <span class="text-secondary text-sm">
      Oops! You haven't got any invites
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  name: "GangInvite",
  methods: {},
};
</script>
