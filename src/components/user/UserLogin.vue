<!-- User login component rendered through AuthView -->

<template>
  <form @submit.prevent="login" class="login-form">
    <div class="d-flex align-items-start justify-content-between">
      <div>
        <h3>Login.</h3>
        <router-link to="/auth/register">or create a new one?</router-link>
      </div>
      <a href="https://github.com/SubCoder1/Popcorn" target="_blank">
        <img
          src="@/assets/logo/github-128x128.png"
          class="git-icon"
          alt="Github logo"
        />
      </a>
    </div>
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
        placeholder="Username"
        v-model="username"
        @click="removeErr"
        autocomplete
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
        <span v-if="!form_submitted">Log in</span>
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
      showPassword: false,
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
      if (this.validateForm()) {
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
      }
      // hides the loader
      this.form_submitted = false;
    },
    removeErr: function () {
      // Clean & hide error box on click event to input boxes
      this.showErr = false;
      this.formErr = "";
    },
    validateForm: function () {
      if (this.username.length < 5 || this.username.length > 30) {
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
      } else {
        return true;
      }
    },
  },
};
</script>
<style scoped lang="css">
.git-icon {
  height: 38px;
}

.bi-eye,
.bi-eye-slash {
  position: absolute;
  right: 12px;
  z-index: 1;
  cursor: pointer;
}
</style>
