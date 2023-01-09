<!-- User login component rendered through AuthView -->

<template>
  <div class="login-form">
    <h2>Login.</h2>
    <router-link to="/auth/register">or create a new one?</router-link>
  </div>
</template>

<script>
export default {
  name: "UserLogin",
};
</script>
