<!-- User Registration component rendered through AuthView -->

<template>
  <form @submit.prevent="register" class="reg-form">
    <h3>Register.</h3>
    <router-link to="/auth/login">or have one already?</router-link>
    <p
      class="form-errors form-errors-md rounded-md text-sm mt-2"
      v-bind:class="{ 'show-error': showErr, 'd-none': !showErr }"
    >
      {{ formErr }}
    </p>
    <div class="mt-3 mb-3">
      <input
        type="text"
        class="form-control text-sm rounded-md mb-3"
        placeholder="Full Name"
        v-model.trim="full_name"
        @click="removeErr"
        required
      />
      <input
        type="text"
        class="form-control text-sm rounded-md mb-3"
        placeholder="Username"
        v-model="username"
        @click="removeErr"
        required
      />
      <div class="position-relative d-flex align-items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="26"
          fill="#f18579"
          class="bi bi-eye"
          viewBox="0 0 16 16"
          v-if="showPassword"
          @click="showPassword = !showPassword"
        >
          <path
            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
          />
          <path
            d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="26"
          fill="#f18579"
          class="bi bi-eye-slash"
          viewBox="0 0 16 16"
          v-else
          @click="showPassword = !showPassword"
        >
          <path
            d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"
          />
          <path
            d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"
          />
          <path
            d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"
          />
        </svg>
        <input
          :type="showPassword ? 'text' : 'password'"
          class="form-control text-sm rounded-md"
          placeholder="Password"
          v-model="password"
          @click="removeErr"
          autocomplete
          required
        />
      </div>
      <button
        type="submit"
        class="btn d-flex align-items-center justify-content-center w-100 rounded-md text-sm mt-3 mb-2"
        :disabled="form_submitted"
      >
        <div class="loader" v-if="form_submitted"></div>
        <span v-if="!form_submitted">Create</span>
      </button>
    </div>
  </form>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store";

export default {
  data() {
    return {
      form_submitted: false,
      username: "",
      full_name: "",
      password: "",
      showPassword: false,
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
        const authStore = useAuthStore();
        // Register API request to server
        const resp = await authStore.register(
          this.username,
          this.full_name,
          this.password
        );
        if (resp.status == 200) {
          this.$router.replace({ name: "home" });
        } else {
          // Error during Register
          if (resp.status >= 500) {
            // Server error
            this.$parent.$parent.$parent.$parent.srvErrModal();
          } else {
            // Maybe validation
            this.formErr = resp.error;
            this.showErr = true;
          }
        }
      }
      this.form_submitted = false;
    },
    removeErr: function () {
      this.showErr = false;
      this.formErr = "";
    },
    validateForm: function () {
      // useless client side validation of user registration in Popcorn.
      if (this.full_name.length < 5 || this.full_name.length > 30) {
        // full_name length should be between [5,20]
        this.formErr = "FullName should be of 5 - 30 characters.";
        this.showErr = true;
        return false;
      } else if (!/^[A-Za-z\s]*$/.test(this.full_name)) {
        // full_name should only contain alphabets (spaces excluded)
        this.formErr = "Full Name should only contain alphabets and spaces";
        this.showErr = true;
        return false;
      } else if (this.username.length < 5 || this.username.length > 30) {
        // username length should be between [5,20]
        this.formErr = "Username should be of 5 - 20 characters.";
        this.showErr = true;
        return false;
      } else if (/[^a-zA-Z0-9_.]/g.test(this.username)) {
        // username should not contain whitespace in-between
        this.formErr =
          "Username can only contain letters, numbers, underscores and periods";
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
        this.formErr =
          "Password should contain at least 1 character & 1 number.";
        this.showErr = true;
        return false;
      }
      return true;
    },
  },
};
</script>
<style scoped="css">
.bi-eye,
.bi-eye-slash {
  position: absolute;
  right: 12px;
  z-index: 1;
  cursor: pointer;
}
</style>
