<!-- Create Gang form component rendered through HomeView -->

<template>
  <form
    @submit.prevent="createGang(false)"
    class="gang-create-form pe-4 pb-4 ps-4"
  >
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangName" class="text-sm">Name of the Gang:</label>
      <input
        type="text"
        class="form-control text-sm rounded-md input-md"
        placeholder="Name"
        v-model.trim="gang_name"
        minlength="5"
        maxlength="20"
        id="gangName"
        @click="removeErr()"
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
        minlength="5"
        id="gangPassKey"
        @click="removeErr()"
        required
      />
    </div>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap mb-3"
    >
      <label for="gangLimit" class="text-sm">Members:</label>
      <div class="input-md d-flex align-items-center text-secondary text-sm">
        <input
          type="number"
          class="form-control text-sm rounded-md input-xsm me-3"
          placeholder="Passkey"
          v-model.number="gang_member_limit"
          id="gangLimit"
          @click="removeErr()"
          min="2"
          max="10"
          required
        />
        / 10 (Max Gang Members)
      </div>
    </div>
    <button
      type="submit"
      class="btn d-flex align-items-center justify-content-center btn-md rounded-md text-sm mt-4"
      :disabled="form_submitted"
    >
      <div class="loader" v-if="form_submitted"></div>
      <span v-if="!form_submitted">Create</span>
    </button>
  </form>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store";
import { useGangStore } from "@/stores/gang.store";

export default {
  data() {
    return {
      form_submitted: false,
      gang_name: "",
      gang_pass_key: "",
      gang_member_limit: 2,
    };
  },
  name: "GangCreate",
  methods: {
    createGang: async function (retry) {
      // shows the loader
      this.form_submitted = true;
      if (this.validateForm()) {
        const gangStore = useGangStore();
        let createGangData = {
          gang_name: this.gang_name,
          gang_pass_key: this.gang_pass_key,
          gang_member_limit: this.gang_member_limit,
        };
        const response = await gangStore.createGang(createGangData);
        if (response.status == 200) {
          // Success
          await this.$parent.$parent.getUserGang(false);
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
              this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
            }
          } else if (response.status >= 500) {
            // Server error
            this.$parent.$parent.$parent.$parent.$parent.srvErrModal();
          } else {
            // Maybe validation
            this.$parent.$parent.ErrPopUp(response.error);
          }
        }
      }
      this.form_submitted = false;
    },
    removeErr: function () {
      this.$parent.$parent.removeErr();
    },
    validateForm: function () {
      let error = "";
      if (this.gang_name.length < 5 || this.gang_name.length > 20) {
        // gang_name length should be between [5,20]
        error = "Gang name should be of 5 - 20 characters.";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      } else if (/[^a-zA-Z0-9_.\s]/g.test(this.gang_name)) {
        error =
          "Gang name can contain only letters, numbers, underscore, period and whitespaces.";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      } else if (/[^\x20-\x7E]/g.test(this.gang_name)) {
        // gang_name should not contain any unprintable ASCII
        error = "Gang name cannot contain any weird characters.";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      } else if (this.gang_name.trim().length == 0) {
        // gang_name should'nt contain only spaces
        error = "Gang name cannot contain only whitespaces";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      } else if (this.gang_pass_key.length < 5) {
        // gang_passkey length should be >= 5
        error = "Gang passkey should be of at least 5 characters.";
        this.$parent.$parent.ErrPopUp(error);
        return false;
      }
      return true;
    },
  },
};
</script>
