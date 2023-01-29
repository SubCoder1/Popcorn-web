// Global store of Gang permissions of an user in Popcorn-web.
// Updated during leaving or joining a gang, creating a gang etc.,

import { defineStore } from "pinia";
import axios from "axios";

export const useGangStore = defineStore("gang", {
  state: () => ({
    CreateGang: true,
    JoinGang: true,
    userGang: [],
  }),
  getters: {
    canCreateGang: (state) => state.CreateGang,
    canJoinGang: (state) => state.JoinGang,
    getUserGang: (state) => state.userGang,
  },
  actions: {
    // getGang API handler
    async getGang() {
      let res = {};
      await axios
        .get(process.env.VUE_APP_GET_GANG_API, {
          withCredentials: true,
        })
        .then((response) => {
          this.userGang = response.data.gang;
          this.CreateGang = response.data.canCreateGang;
          this.JoinGang = response.data.canJoinGang;
          res.status = response.status;
        })
        .catch((e) => {
          // error occured
          if (e.response) {
            // Server sent a response
            res.status = e.response.status;
            // show the first validation issue received from server
          } else {
            // Server unreachable
            res.status = 503;
          }
        });
      return res;
    },
    // createGang API handler
    async createGang(createGangData) {
      let res = {};
      await axios
        .post(process.env.VUE_APP_CREATE_GANG_API, createGangData, {
          withCredentials: true,
        })
        .then((response) => {
          // successfully created gang
          res.status = response.status;
          this.CreateGang = false;
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
    // joinGang API handler
    async joinGang(joinGangData) {
      let res = {};
      await axios
        .post(process.env.VUE_APP_JOIN_GANG_API, joinGangData, {
          withCredentials: true,
        })
        .then((response) => {
          res.status = response.status;
          this.JoinGang = false;
        })
        .catch((e) => {
          if (e.response) {
            // Server sent a response
            res.status = e.response.status;
            // 401 can be either passKey mismatch or authToken expired
            if (
              res.status == 401 &&
              e.response.data.message == "PassKey didn't match"
            ) {
              res.errMsg = "PassKey didn't match";
            } else {
              res.errMsg = "authToken expired";
            }
          } else {
            // Server unreachable
            res.status = 503;
          }
        });
      return res;
    },
  },
});
