<!-- User Registration component rendered through AuthView -->

<template>
  <form @submit.prevent="register" class="reg-form">
    <h3>Register.</h3>
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
        :disabled="form_submitted"
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
import { useAuthStore } from "@/stores/auth.store";

export default {
  data() {
    return {
      form_submitted: false,
      username: "",
      full_name: "",
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
      } else if (this.username.length < 5 || this.username.length > 20) {
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
