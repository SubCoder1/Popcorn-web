// Global store of user data in Popcorn-web.
// Handles data from user APIs of Popcorn and utilizes pinia's global state management feature to save info.

import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: "",
    full_name: "",
    user_profile_pic: "",
  }),
  getters: {
    getUserName: (state) => state.username,
    getUserFullName: (state) => state.full_name,
    getUserProfPic: (state) => state.user_profile_pic,
  },
  actions: {
    // GetUser API handler
    async getUser() {
      let res = {};
      // GetUser API request to server
      await axios
        .get(process.env.VUE_APP_GET_USER_API, {
          withCredentials: true,
          timeout: 1000 * 5,
        })
        .then((response) => {
          // Successfully fetched client's data
          res["status"] = response.status;
          this.username = response.data.user.username;
          this.full_name = response.data.user.full_name;
          this.user_profile_pic = response.data.user.user_profile_pic;
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
    // Clears user data, useful during login
    clearUserData() {
      this.username = "";
      this.full_name = "";
      this.user_profile_pic = "";
    },
  },
});
