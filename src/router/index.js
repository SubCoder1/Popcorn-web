// Routes to all of the views in Popcorn are defined here. This is one of the root components in Popcorn-web.

import { createRouter, createWebHistory } from "vue-router";
import UserAuth from "@/views/AuthView.vue";
import UserLogin from "@/components/UserLogin.vue";
import UserReg from "@/components/UserReg.vue";
import UserFPwD from "@/components/UserFPwD.vue";
import UserHome from "@/views/HomeView.vue";
import GangDashboard from "@/components/GangDashboard.vue";
import GangCreate from "@/components/GangCreate.vue";
import GangJoin from "@/components/GangJoin.vue";
import GangList from "@/components/GangList.vue";
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
  // HomeView routes
  {
    path: "/home",
    redirect: { name: "dashboard" },
    name: "home",
    component: UserHome,
    meta: {
      requiresAuth: true,
    },
    children: [
      // Dashboard routes
      {
        path: "dashboard",
        name: "dashboard",
        redirect: { name: "listgang" },
        component: GangDashboard,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            // GangList will be rendered through GangDashboard's <router-view>
            path: "list-gang",
            name: "listgang",
            component: GangList,
            meta: {
              requiresAuth: true,
            },
          },
          {
            // GangCreate will be rendered through GangDashboard's <router-view>
            path: "create-gang",
            name: "creategang",
            component: GangCreate,
            meta: {
              requiresAuth: true,
            },
          },
          {
            // GangJoin will be rendered through GangDashboard's <router-view>
            path: "join-gang",
            name: "joingang",
            component: GangJoin,
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
    ],
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
router.beforeEach(async (to, from) => {
  if (from.name == undefined || from.name != to.name) {
    const loaderStore = useLoaderStore();
    loaderStore.loading = true;
  }
  const authStore = useAuthStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // View or Component requires auth
    if (!authStore.getUserAuth && !(await authStore.isUserAuth())) {
      // client not authenticated
      // use refresh_token and check if user can still authenticate
      await authStore.refreshToken();
      if (!authStore.getUserAuth) {
        // refreshing token didn't work, redirect to login
        return { name: "auth" };
      }
    }
  } else {
    // View or Component doesn't require auth
    if (authStore.getUserAuth) {
      // client authenticated, redirect to home
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
