<!-- User login component rendered through AuthView -->

<template>
  <div class="login-form">
    <h2>Login.</h2>
    <router-link to="/auth/register">or create a new one?</router-link>
    <p class="form-errors rounded-md text-sm mt-2 pt-2 pb-2"></p>
    <div class="mt-3">
      <input
        type="text"
        class="form-control text-sm rounded-md mb-3"
        placeholder="Username"
      />
      <input
        type="password"
        class="form-control text-sm rounded-md mb-3"
        placeholder="Password"
      />
      <button type="button" class="btn w-100 rounded-md text-sm mt-2 mb-2">
        Log in
      </button>
    </div>
    <div class="text-right">
      <router-link to="/auth/forgot-password">
        forgot your password?
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserLogin",
};
</script>
