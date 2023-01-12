<!-- User Registration component rendered through AuthView -->

<template>
  <form @submit.prevent="register" class="reg-form">
    <h2>Register.</h2>
    <router-link to="/auth/login">or have one already?</router-link>
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
        required
      />
      <input
        type="password"
        class="form-control text-sm rounded-md mb-3"
        placeholder="Password"
        v-model="password"
        @click="removeErr"
        required
      />
      <button
        type="submit"
        class="btn d-flex align-items-center justify-content-center position-relative w-100 rounded-md text-sm mt-2 mb-2"
      >
        <div v-if="form_submitted" class="loader-1 position-absolute">
          <span />
        </div>
        Create
      </button>
    </div>
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
  name: "UserReg",
  methods: {
    register: async function () {
      // shows the loader
      this.form_submitted = true;
      if (this.validateForm()) {
        // Register API request to server
        await axios
          .post(process.env.VUE_APP_REGISTER_API, {
            username: this.username,
            password: this.password,
          })
          .then(() => {
            // successful registration
            this.$router.push({ name: "home" });
          })
          .catch((e) => {
            // error occured
            if (e.response) {
              // Server sent a response
              // show the first validation issue received from server
              this.formErr = e.response.data.details.errors[0].message;
            } else {
              // Server unreachable
              this.formErr = "Server unreachable at the moment.";
            }
            // Show error to client
            this.showErr = true;
          });
      }
      this.form_submitted = false;
    },
    removeErr: async function () {
      this.showErr = false;
      this.formErr = "";
    },
    validateForm: async function () {
      // useless client side validation of user registration in Popcorn.
      if (this.username.length < 5 || this.username.length > 20) {
        // username length should be between [5,20]
        this.formErr = "Username should be of 5 - 20 characters.";
        this.showErr = true;
        return false;
      } else if (/\s/g.test(this.username)) {
        // username should not contain whitespace in-between
        this.formErr = "Username shouldn't contain spaces.";
        this.showErr = true;
        return false;
      } else if (/[^\x20-\x7E]/g.test(this.username)) {
        // username should not contain any unprintable ASCII
        this.formErr = "No weird characters allowed.";
        this.showErr = true;
        return false;
      } else if (this.password.length < 5) {
        // password length should be at least 5
        this.formErr = "Password should be of at least 5 characters.";
        this.showErr = true;
        return false;
      } else if (!/\d/.test(this.password) || !/[a-zA-Z]/.test(this.password)) {
        // password should contain at least 1 character and 1 number.
        this.formErr = "Password should contain at least 1 character & number.";
        this.showErr = true;
        return false;
      }
      return true;
    },
  },
};
</script>
