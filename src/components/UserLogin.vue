<!-- User login component rendered through AuthView -->

<template>
  <form @submit.prevent="login" class="login-form">
    <h2>Login.</h2>
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
import axios from "axios";

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
      // shows the loader
      this.form_submitted = true;
      // Login API request to server
      await axios
        .post(process.env.VUE_APP_LOGIN_API, {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          // successfully logged-in
          this.$router.push({ name: "home" });
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            if (e.response.data.status != 500) {
              this.formErr = "Username or Password is incorrect.";
            } else {
              this.formErr = "Server error occured.";
            }
          } else {
            // Server unreachable
            this.formErr = "Server unreachable at the moment.";
          }
          // Show error to client
          this.showErr = true;
        });
      // hides the loader
      this.form_submitted = false;
    },
    removeErr: async function () {
      // Clean & hide error box on click event to input boxes
      this.showErr = false;
      this.formErr = "";
    },
  },
};
</script>
