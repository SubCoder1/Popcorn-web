// Global store of user authentication in Popcorn-web.
// Handles data from auth APIs of Popcorn and utilizes pinia's global state management feature to save info.

import { defineStore } from "pinia";
import { useUserStore } from "./user.store";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user_auth: false,
    stream_token: "",
  }),
  getters: {
    getUserAuth: (state) => state.user_auth,
    getUserStreamToken: (state) => state.stream_token,
  },
  actions: {
    // Login API handler
    async login(username, password) {
      let res = {};
      // Login API request to server
      await axios
        .post(
          process.env.VUE_APP_LOGIN_API,
          {
            username: username,
            password: password,
          },
          {
            withCredentials: true,
            timeout: 1000 * 5,
          }
        )
        .then(() => {
          // successfully logged-in
          this.user_auth = true;
          res.status = 200;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res.status = e.response.status;
            if (res.status == 422) {
              // JSON bind error
              res.error = "Invalid JSON provided.";
            } else if (res.status == 401 || res.status == 400) {
              // Validation error
              res.error = "Username or Password is incorrect.";
            } else {
              // Server error
              res.error = "Server error occured.";
            }
          } else {
            // Server unreachable
            res.status = 503;
            res.error = "Server unreachable.";
          }
        });
      return res;
    },
    // Register API handler
    async register(username, full_name, password) {
      let res = {};
      await axios
        .post(
          process.env.VUE_APP_REGISTER_API,
          {
            username: username,
            full_name: full_name,
            password: password,
          },
          {
            withCredentials: true,
            timeout: 1000 * 5,
          }
        )
        .then(() => {
          // successful registration
          this.user_auth = true;
          res.status = 200;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res.status = e.response.status;
            // show the first validation issue received from server
            if (res.status == 422) {
              // JSON bind error
              res.error = "Invalid JSON provided.";
            } else if (res.status == 400) {
              // Validation error
              res.error = e.response.data.details.errors[0].message;
            } else {
              // Server error
              res.error = "Server error occured.";
            }
          } else {
            // Server unreachable
            res.status = 503;
          }
        });
      return res;
    },
    // Logout API handler
    async logout() {
      let res = {};
      const userStore = useUserStore();
      await axios
        .post(
          process.env.VUE_APP_LOGOUT_API,
          {},
          {
            withCredentials: true,
            timeout: 1000 * 5,
          }
        )
        .then(async () => {
          // logout successful
          this.user_auth = false;
          this.stream_token = "";
          userStore.clearUserData();
          res.status = 200;
        })
        .catch((e) => {
          // error during logout
          if (e.response) {
            // Server sent a response
            res.status = e.response.status;
            if (e.response.data.status != 500) {
              // Invalid token
              this.user_auth = false;
              userStore.clearUserData();
            } else {
              // Server error
              res.error = "Server error occured.";
            }
          } else {
            res.status = 503;
            res.error = "Server unreachable.";
          }
        });
      return res;
    },
    // isUserAuthenticated API handler
    async isUserAuthenticated() {
      let authenticated = await axios
        .get(process.env.VUE_APP_AUTH_CHECK_API, {
          withCredentials: true,
          timeout: 1000 * 5,
        })
        .then(() => {
          // User is authenticated
          this.user_auth = true;
          return true;
        })
        .catch(() => {
          // Error occured
          this.user_auth = false;
          return false;
        });
      return authenticated;
    },
    // Refresh token API handler
    async refreshToken() {
      let res = {};
      const userStore = useUserStore();
      // Refresh Token API request to server
      await axios
        .post(
          process.env.VUE_APP_REFRESH_TOKEN_API,
          {},
          {
            withCredentials: true,
            timeout: 1000 * 5,
          }
        )
        .then(() => {
          // Successfully refreshed token
          this.user_auth = true;
          res.status = 200;
        })
        .catch((e) => {
          // Error during refreshing token
          if (e.response) {
            // Server sent a response
            res.status = e.response.status;
            if (res.status == 401) {
              // Access as well as Refresh token has expired.
              this.user_auth = false;
              userStore.clearUserData();
              res.error = "User session expired.";
            } else {
              // Server error
              res.error = "Server error occured.";
            }
          } else {
            res.status = 503;
            res.error = "Server unreachable.";
          }
        });
      return res;
    },
    // streamToken API handler
    async getStreamingToken() {
      const resp = await axios
        .post(
          process.env.VUE_APP_GET_STREAMING_TOKEN_API,
          {},
          {
            withCredentials: true,
            timeout: 1000 * 5,
          }
        )
        .then((response) => {
          this.stream_token = response.data.stream_token;
          return response.status;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            return e.response.status;
            // show the first validation issue received from server
          } else {
            // Server unreachable
            return 503;
          }
        });
      return resp;
    },
  },
});
