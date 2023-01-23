<!-- User login component rendered through AuthView -->

<template>
  <form @submit.prevent="login" class="login-form">
    <h3>Login.</h3>
    <router-link to="/auth/register">or create a new one?</router-link>
    <p
      class="form-errors rounded-md text-sm mt-2"
      v-bind:class="{ 'show-error': showErr }"
    >
      {{ formErr }}
    </p>
    <div class="mt-3 mb-3">
      <input
        type="text"
        class="form-control text-sm rounded-md mb-3"
        placeholder="Username"
        v-model="username"
        @click="removeErr"
        autocomplete
        required
      />
      <input
        type="password"
        class="form-control text-sm rounded-md mb-3"
        placeholder="Password"
        v-model="password"
        @click="removeErr"
        autocomplete
        required
      />
      <button
        type="submit"
        class="btn d-flex align-items-center justify-content-center position-relative w-100 rounded-md text-sm mt-2 mb-2"
        :disabled="form_submitted"
      >
        <div v-if="form_submitted" class="loader-1 position-absolute">
          <span />
        </div>
        Log in
      </button>
    </div>
    <router-link to="/auth/forgot-password">
      forgot your password?
    </router-link>
  </form>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store";

export default {
  data() {
    return {
      form_submitted: false,
      username: "",
      password: "",
      showErr: false,
      formErr: "",
    };
  },
  name: "UserLogin",
  methods: {
    login: async function () {
      const authStore = useAuthStore();
      // shows the loader
      this.form_submitted = true;
      // Login API request to server
      const resp = await authStore.login(this.username, this.password);
      if (resp.status == 200) {
        // login successful
        this.$router.replace({ name: "home" });
      } else {
        // Error during login
        if (resp.status >= 500) {
          // Server error
          this.$parent.$parent.$parent.$parent.srvErrModal();
        } else {
          // Maybe validation
          this.formErr = resp.error;
          this.showErr = true;
        }
      }
      // hides the loader
      this.form_submitted = false;
    },
    removeErr: function () {
      // Clean & hide error box on click event to input boxes
      this.showErr = false;
      this.formErr = "";
    },
  },
};
</script>
