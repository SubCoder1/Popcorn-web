<!-- 
  Authentication View of Popcorn.
  Components UserLogin and UserReg is rendered through the router-view mentioned here.
-->
<template>
  <div
    class="login-component h-100 d-flex align-items-center justify-content-center"
  >
    <div class="page-info d-flex flex-column justify-content-center">
      <h2>Create. Upload. Watch.</h2>
      <div class="d-flex align-items-center">
        <p class="m-0">And don't forget to make some</p>
        <img class="auth-page-logo mb-2" src="@/assets/logo/logo-128x128.png" />
      </div>
    </div>
    <div class="auth-form-container text-left p-5">
      <router-view />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import UserLogin from "@/components/UserLogin.vue";

export default {
  name: "UserAuth",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.page-info {
  height: 625px;
  width: 600px;
}

.auth-form-container {
  height: 460px;
  width: 410px;
  background: white;
  border-radius: 0.5rem;
}

.auth-page-logo {
  height: 50px;
  width: 50px;
}
</style>
