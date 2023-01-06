<template>
  <div class="home">
    <UserLogin msg="Welcome to Popcorn" />
  </div>
</template>

<script>
// @ is an alias to /src
import UserLogin from "@/components/UserLogin.vue";

export default {
  name: "HomeView",
  components: {
    UserLogin,
  },
};
</script>
