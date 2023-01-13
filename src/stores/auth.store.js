// Global store of user authentication in Popcorn-web.
// Handles data from auth APIs of Popcorn and utilizes pinia's global state management feature to save info.

import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    user_auth: false,
    username: "",
  }),
  persist: true, // store in localStorage
  getters: {
    getUserAuth: (state) => state.user_auth,
    getUserName: (state) => state.username,
  },
  actions: {
    // Login API handler
    async login(username, password) {
      let res = {};
      // Login API request to server
      await axios
        .post(process.env.VUE_APP_LOGIN_API, {
          username: username,
          password: password,
        })
        .then(() => {
          // successfully logged-in
          this.user_auth = true;
          this.username = username;
          res["status"] = 200;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.data.status;
            if (e.response.data.status != 500) {
              res["error"] = "Username or Password is incorrect.";
            } else {
              res["error"] = "Server error occured.";
            }
          } else {
            // Server unreachable
            res["status"] = 503;
            res["error"] = "Server unreachable at the moment.";
          }
        });
      return res;
    },
    // Register API handler
    async register(username, password) {
      let res = {};
      await axios
        .post(process.env.VUE_APP_REGISTER_API, {
          username: username,
          password: password,
        })
        .then(() => {
          // successful registration
          this.user_auth = true;
          this.username = username;
          res["status"] = 200;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.data.status;
            // show the first validation issue received from server
            res["error"] = e.response.data.details.errors[0].message;
          } else {
            // Server unreachable
            res["status"] = 503;
            res["error"] = "Server unreachable at the moment.";
          }
        });
      return res;
    },
    // Logout API handler
    async logout() {
      let res = {};
      await axios
        .post(process.env.VUE_APP_LOGOUT_API)
        .then(() => {
          // logout successful
          this.user_auth = false;
          this.username = "";
          res["status"] = 200;
        })
        .catch((e) => {
          // error during logout
          if (e.response) {
            // Server sent a response
            res["status"] = e.response.data.status;
            if (e.response.data.status != 500) {
              // Invalid token
              this.user_auth = false;
              this.username = "";
            } else {
              // Server error
              res["error"] = "Server error occured.";
            }
          }
        });
      return res;
    },
  },
});
