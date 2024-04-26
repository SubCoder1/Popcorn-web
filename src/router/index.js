// Routes to all of the views in Popcorn are defined here. This is one of the root components in Popcorn-web.

import { createRouter, createWebHistory } from "vue-router";
import UserAuth from "@/views/AuthView.vue";
import UserLogin from "@/components/user/UserLogin.vue";
import UserReg from "@/components/user/UserReg.vue";
import UserFPwD from "@/components/user/UserFPwD.vue";
import HomeView from "@/views/HomeView.vue";
import InviteViaUrlView from "@/views/InviteViaUrlView.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useLoaderStore } from "@/stores/loader.store";

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
  // InviteView routes
  {
    path: "/invite/:from/:hashcode",
    name: "invite",
    component: InviteViaUrlView,
    meta: {
      requiresAuth: true,
    },
  },
  // HomeView routes
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      requiresAuth: true,
    },
  },
  // catch all redirect to home page
  {
    path: "/:catchAll(.*)*",
    name: "404",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
});

// Global navigation guard which gets executed before any navigation to router paths
router.beforeEach(async (to) => {
  const loaderStore = useLoaderStore();
  loaderStore.loading = true;
  const authStore = useAuthStore();
  if (to.meta.requiresAuth) {
    // View or Component requires auth
    if (!(await authStore.isUserAuth())) {
      // client not authenticated
      // use refresh_token and check if user can still authenticate
      await authStore.refreshToken();
      if (!authStore.getUserAuth) {
        // refreshing token didn't work, redirect to login
        return {
          name: "auth",
          // to come back later to this path after login
          query: { redirect: to.fullPath },
        };
      }
    }
  } else {
    // User can't access noAuth pages like login, register... if they're already authenticated
    if (authStore.getUserAuth) {
      return { name: "home" };
    }
  }
});
// Global navigation guard which gets executed after any navigation to router paths
router.afterEach(() => {
  const loaderStore = useLoaderStore();
  loaderStore.loading = false;
});

export default router;
