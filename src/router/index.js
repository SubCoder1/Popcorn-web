// Routes to all of the views in Popcorn are defined here. This is one of the root components in Popcorn-web.

import { createRouter, createWebHistory } from "vue-router";
import UserAuth from "../views/AuthView.vue";
import UserLogin from "../components/UserLogin.vue";
import UserReg from "../components/UserReg.vue";
import UserFPwD from "../components/UserFPwD.vue";
import UserHome from "../views/HomeView.vue";
import { useUserStore } from "@/stores/auth.store";

const routes = [
  // AuthView routes
  {
    path: "/auth",
    redirect: { name: "login" },
    name: "auth",
    component: UserAuth,
    children: [
      {
        // UserLogin will be rendered inside UserAuth's <router-view>
        // when /auth/login is matched
        path: "login",
        name: "login",
        component: UserLogin,
      },
      {
        // UserReg will be rendered inside UserAuth's <router-view>
        // when /auth/register is matched
        path: "register",
        name: "register",
        component: UserReg,
      },
      {
        // UserFPwD will be rendered inside UserAuth's <router-view>
        // when /auth/register is matched
        path: "forgot-password",
        name: "forgotpwd",
        component: UserFPwD,
      },
    ],
  },
  // HomeView routes
  {
    path: "/",
    name: "home",
    component: UserHome,
    meta: {
      requiresAuth: true,
    },
  },
  // catch all redirect to home page
  {
    path: "/:pathMatch(.*)*",
    name: "unknown",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
});

// Global guard to ensure that client is authenticated before visiting auth only pages
// even though this is handled server-side
router.beforeEach(async (to) => {
  const authStore = useUserStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // View or Component requires auth
    if (!authStore.getUserAuth) {
      // client not authenticated
      return { name: "auth" };
    }
  } else {
    // View or Component doesn't require auth
    if (authStore.getUserAuth) {
      // client authenticated, redirect to home
      return { name: "home" };
    }
  }
});

export default router;
