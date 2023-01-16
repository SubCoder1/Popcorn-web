// Global store of user authentication in Popcorn-web.
// Handles data from auth APIs of Popcorn and utilizes pinia's global state management feature to save info.

import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    user_auth: false,
    username: "",
    full_name: "",
    user_profile_pic: "",
  }),
  persist: true, // store in localStorage
  getters: {
    getUserAuth: (state) => state.user_auth,
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
          }
        )
        .then(() => {
          // successfully logged-in
          this.user_auth = true;
          res["status"] = 200;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.status;
            if (res["status"] != 500) {
              res["error"] = "Username or Password is incorrect.";
            }
          } else {
            // Server unreachable
            res["status"] = 503;
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
          }
        )
        .then(() => {
          // successful registration
          this.user_auth = true;
          res["status"] = 200;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.status;
            // show the first validation issue received from server
            res["error"] = e.response.data.details.errors[0].message;
          } else {
            // Server unreachable
            res["status"] = 503;
          }
        });
      return res;
    },
    // Logout API handler
    async logout() {
      let res = {};
      await axios
        .post(
          process.env.VUE_APP_LOGOUT_API,
          {},
          {
            withCredentials: true,
          }
        )
        .then(() => {
          // logout successful
          this.user_auth = false;
          this.username = "";
          this.full_name = "";
          this.user_profile_pic = "";
          res["status"] = 200;
        })
        .catch((e) => {
          // error during logout
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.status;
            if (e.response.data.status != 500) {
              // Invalid token
              this.user_auth = false;
              this.username = "";
              this.user_profile_pic = "";
            }
          } else {
            res["status"] = 503;
          }
        });
      return res;
    },
    // GetUser API handler
    async getUser() {
      let res = {};
      // GetUser API request to server
      await axios
        .get(process.env.VUE_APP_GET_USER_API)
        .then((response) => {
          // Successfully fetched client's data
          res["status"] = 200;
          this.username = response.data.username;
          this.full_name = response.data.full_name;
          this.user_profile_pic = response.data.user_profile_pic;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.status;
          } else {
            // Server unreachable
            res["status"] = 503;
          }
        });
      return res;
    },
    // Refresh token API handler
    async refreshToken() {
      let res = {};
      // Refresh Token API request to server
      await axios
        .post(
          process.env.VUE_APP_REFRESH_TOKEN_API,
          {},
          {
            withCredentials: true,
          }
        )
        .then(() => {
          // Successfully refreshed token
          res["status"] = 200;
        })
        .catch((e) => {
          // Error during refreshing token
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.status;
            if (res["status"] == 401) {
              // Access as well as Refresh token has expired.
              this.user_auth = false;
              this.user_profile_pic = "";
              this.username = "";
              this.full_name = "";
              res["error"] = "User session expired.";
            }
          } else {
            res["status"] = 503;
          }
        });
      return res;
    },
  },
});
