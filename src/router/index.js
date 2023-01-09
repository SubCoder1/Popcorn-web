// Routes to all of the views in Popcorn are defined here. This is one of the root components in Popcorn-web.

import { createRouter, createWebHistory } from "vue-router";
import UserAuth from "../components/UserAuth.vue";
import UserLogin from "../components/UserLogin.vue";
import UserReg from "../components/UserReg.vue";

const routes = [
  {
    path: "/auth",
    name: "auth",
    component: UserAuth,
    children: [
      {
        // UserLogin will be rendered inside UserAuth's <router-view>
        // when /auth/login is matched
        path: "login",
        component: UserLogin,
      },
      {
        // UserReg will be rendered inside UserAuth's <router-view>
        // when /auth/register is matched
        path: "register",
        component: UserReg,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
});

export default router;
