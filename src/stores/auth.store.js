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
          this.user_auth = false;
          this.username = "";
          // error occured
          res["status"] = 400;
          if (e.response) {
            // Server sent a response
            if (e.response.data.status != 500) {
              res["error"] = "Username or Password is incorrect.";
            } else {
              res["error"] = "Server error occured.";
            }
          } else {
            // Server unreachable
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
          this.user_auth = false;
          this.username = "";
          // error occured
          res["status"] = 400;
          if (e.response) {
            // Server sent a response
            // show the first validation issue received from server
            res["error"] = e.response.data.details.errors[0].message;
          } else {
            // Server unreachable
            res["error"] = "Server unreachable at the moment.";
          }
        });
      return res;
    },
  },
});
