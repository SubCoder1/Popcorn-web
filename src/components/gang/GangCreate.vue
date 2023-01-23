<!-- Create Gang form component rendered through HomeView -->

<template>
  <div class="d-flex justify-content-between">
    <div class="gang-create-error">
      <p
        class="form-errors rounded-md text-sm"
        v-bind:class="{ 'show-error': showErr }"
      >
        {{ formErr }}
      </p>
    </div>
  </div>
  <form @submit.prevent="createGang(false)" class="gang-create-form">
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangName" class="text-sm">Name of the Gang:</label>
      <input
        type="text"
        class="form-control text-sm rounded-md input-md"
        placeholder="Name"
        v-model.trim="gang_name"
        id="gangName"
        @click="removeErr"
        autocomplete="off"
        required
      />
    </div>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangPassKey" class="text-sm">Gang Passkey:</label>
      <input
        type="password"
        class="form-control text-sm rounded-md input-md"
        placeholder="Passkey"
        v-model="gang_pass_key"
        id="gangPassKey"
        @click="removeErr"
        required
      />
    </div>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangLimit" class="text-sm">Gang Members limit:</label>
      <div class="input-md d-flex align-items-center text-secondary text-sm">
        <input
          type="number"
          class="form-control text-sm rounded-md input-xsm me-3"
          placeholder="Passkey"
          v-model.number="gang_member_limit"
          id="gangLimit"
          @click="removeErr"
          min="2"
          max="10"
          required
        />
        / 10 (Max Gang Members)
      </div>
    </div>
    <button
      type="submit"
      class="btn d-flex align-items-center justify-content-center position-relative btn-md rounded-md text-sm mt-4"
    >
      <div v-if="form_submitted" class="loader-2 position-absolute">
        <span />
      </div>
      Create
    </button>
  </form>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

export default {
  data() {
    return {
      showErr: false,
      form_submitted: false,
      formErr: "",
      gang_name: "",
      gang_pass_key: "",
      gang_member_limit: 2,
    };
  },
  name: "GangCreate",
  methods: {
    createGangAPI: async function () {
      let res = {};
      await axios
        .post(
          process.env.VUE_APP_CREATE_GANG_API,
          {
            gang_name: this.gang_name,
            gang_pass_key: this.gang_pass_key,
            gang_member_limit: this.gang_member_limit,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          // successfully created gang
          res["status"] = 200;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.status;
            // show the first validation issue received from server
            if (res["status"] == 422) {
              // JSON bind error
              res["error"] = "Invalid JSON provided.";
            } else if (res["status"] == 400) {
              // Validation error
              res["error"] = e.response.data.details.errors[0].message;
            } else {
              // Server error
              res["error"] = "Server error occured.";
            }
          } else {
            // Server unreachable
            res["status"] = 503;
          }
        });
      return res;
    },
    createGang: async function (retry) {
      // shows the loader
      this.form_submitted = true;
      if (this.validateForm()) {
        const response = await this.createGangAPI();
        if (response.status == 200) {
          // Success
          this.$parent.getUserGang();
        } else {
          // Error
          if (response.status == 401) {
            // Unauthorized
            if (retry == false) {
              // access_token expired, use refresh_token to refresh JWT
              // Try again on success
              const authStore = useAuthStore();
              const ref_token_resp = await authStore.refreshToken();
              if (ref_token_resp.status == 200) {
                await this.getUserData(true);
              }
            } else {
              // Not able to create gang even after refreshing token
              this.$parent.$parent.$parent.$parent.srvErrModal();
            }
          } else if (response.status >= 500) {
            // Server error
            this.$parent.$parent.$parent.$parent.srvErrModal();
          } else {
            // Maybe validation
            this.formErr = response.error;
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
      if (this.gang_name.length < 5 || this.gang_name.length > 20) {
        // gang_name length should be between [5,20]
        this.formErr = "Gang name should be of 5 - 20 characters.";
        this.showErr = true;
        return false;
      } else if (/[^\x20-\x7E]/g.test(this.gang_name)) {
        // gang_name should not contain any unprintable ASCII
        this.formErr = "Gang name cannot contain any weird characters.";
        this.showErr = true;
        return false;
      } else if (this.gang_name.trim().length == 0) {
        // gang_name should'nt contain only spaces
        this.formErr = "Gang name cannot contain only whitespaces";
        this.showErr = true;
        return false;
      } else if (this.gang_pass_key.length < 5) {
        // gang_passkey length should be >= 5
        this.formErr = "Gang passkey should be of at least 5 characters.";
        this.showErr = true;
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped lang="css">
.input-md {
  width: 350px;
}

.btn-md {
  width: 203px;
}

.input-xsm {
  width: 60px;
}
</style>
