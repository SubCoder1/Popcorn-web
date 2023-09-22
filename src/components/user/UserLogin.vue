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
        class="btn d-flex align-items-center justify-content-center w-100 rounded-md text-sm mt-2 mb-2"
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
</style>
