// Routes to all of the views in Popcorn are defined here. This is one of the root components in Popcorn-web.

import { createRouter, createWebHistory } from "vue-router";
import UserAuth from "../views/AuthView.vue";
import UserLogin from "../components/UserLogin.vue";
import UserReg from "../components/UserReg.vue";
import UserFPwD from "../components/UserFPwD.vue";
import UserHome from "../views/HomeView.vue";

const routes = [
  {
    path: "/auth",
    redirect: "/auth/login",
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
      {
        // UserFPwD will be rendered inside UserAuth's <router-view>
        // when /auth/register is matched
        path: "forgot-password",
        component: UserFPwD,
      },
    ],
  },
  {
    path: "/",
    name: "home",
    component: UserHome,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
});

export default router;
