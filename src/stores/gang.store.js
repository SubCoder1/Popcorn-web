// Global store of Gang permissions of an user in Popcorn-web.
// Updated during leaving or joining a gang, creating a gang etc.,

import { defineStore } from "pinia";
import { useUserStore } from "@/stores/user.store";
import axios from "axios";

export const useGangStore = defineStore("gang", {
  state: () => ({
    CreateGang: true,
    JoinGang: true,
    userGang: {},
    userGangInvites: [],
  }),
  getters: {
    canCreateGang: (state) => state.CreateGang,
    canJoinGang: (state) => state.JoinGang,
    getUserGang: (state) => state.userGang,
    getUserGangInvites: (state) => state.userGangInvites,
  },
  actions: {
    // getGang API handler
    async getGang() {
      const res = await axios
        .get(process.env.VUE_APP_GET_GANG_API, {
          withCredentials: true,
        })
        .then((response) => {
          let userStore = useUserStore();
          this.userGang = response.data.gang;
          if (this.userGang.gang_admin === userStore.getUserName) {
            // This will be filled up later from getGangMembersAPI
            this.userGang.gang_members = [];
          }
          this.CreateGang = response.data.canCreateGang;
          this.JoinGang = response.data.canJoinGang;
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
          this.JoinGang = false;
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
          this.CreateGang = false;
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
              res.error = "PassKey didn't match";
            } else {
              res.error = "authToken expired";
            }
          } else {
            // Server unreachable
            res.status = 503;
          }
        });
      return res;
    },
    // getGangMembers API handler
    async getGangMembers() {
      const res = await axios
        .get(process.env.VUE_APP_GET_GANG_MEMBERS_API, {
          withCredentials: true,
        })
        .then((response) => {
          this.userGang.gang_members = response.data.members;
          return response.status;
        })
        .catch((e) => {
          if (e.response) {
            // Server sent a response
            return e.response.status;
            // show the first validation issue received from server
          } else {
            // Server unreachable
            return 503;
          }
        });
      return res;
    },
    // getGangInvite API handler
    async getGangInvites() {
      const res = await axios
        .get(process.env.VUE_APP_GET_INVITES_API, {
          withCredentials: true,
        })
        .then((response) => {
          this.userGangInvites = response.data.invites;
          return response.status;
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
    // acceptInvite API handler
    async acceptInvite(invite) {
      const res = await axios
        .post(process.env.VUE_APP_ACCEPT_INVITE_API, invite, {
          withCredentials: true,
        })
        .then((response) => {
          this.JoinGang = false;
          this.CreateGang = false;
          return response.status;
        })
        .catch((e) => {
          if (e.response) {
            // Server sent a response
            return e.response.status;
          } else {
            // Server unreachable
            return 503;
          }
        });
      return res;
    },
    // rejectInvite API handler
    async rejectInvite(invite) {
      const response = await axios
        .post(process.env.VUE_APP_REJECT_INVITE_API, invite, {
          withCredentials: true,
        })
        .then((r) => {
          return r.status;
        })
        .catch((e) => {
          if (e.response) {
            // Server sent a response
            return e.response.status;
          } else {
            // Server unreachable
            return 503;
          }
        });
      return response;
    },
    // delGang API handler
    async delGang() {
      const response = await axios
        .post(
          process.env.VUE_APP_DEL_GANG_API,
          {},
          {
            withCredentials: true,
          }
        )
        .then((r) => {
          return r.status;
        })
        .catch((e) => {
          if (e.response) {
            // Server sent a response
            return e.response.status;
          } else {
            // Server unreachable
            return 503;
          }
        });
      return response;
    },
  },
});