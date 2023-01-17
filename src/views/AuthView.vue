<!-- 
  Authentication View of Popcorn.
  Components UserLogin and UserReg is rendered through the router-view mentioned here.
-->
<template>
  <div class="auth-view h-100 d-flex align-items-center justify-content-center">
    <div class="page-info d-flex flex-column justify-content-start">
      <lottie-player
        src="https://assets4.lottiefiles.com/private_files/lf30_pe36bsil.json"
        class="auth-page-animation mb-3"
        background="#f8f6f3"
        speed="1"
        loop
        autoplay
        v-pre
      >
      </lottie-player>
      <h2>Create. Upload. Watch.</h2>
      <div class="d-flex align-items-center">
        <p class="m-0">And don't forget to make some</p>
        <img
          class="auth-page-logo mb-2 ms-2"
          src="@/assets/logo/logo-128x128.png"
        />
      </div>
    </div>
    <div class="auth-form-container container-style text-left p-5">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthView",
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
}

.auth-page-logo {
  height: 50px;
  width: 50px;
}

.auth-page-animation {
  width: 400px;
  height: 300px;
}

@media only screen and (max-width: 1026px) {
  .page-info {
    display: none !important;
  }
}
</style>
