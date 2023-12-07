import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from "../components/LoginPage.vue";
import CreateUser from "../components/CreateUser.vue";
import AccountPage from "../components/AccountPage.vue";
import CreateAccount from "../components/CreateAccount.vue";
import TransferPage from "../components/TransferPage.vue";


const routes = [
  { path: "/", component: LoginPage },
  { path: "/create-user", component: CreateUser},
  { path: "/create-account", component: CreateAccount, meta: { requiresAuth: true } },
  { path: "/account-info", component: AccountPage, meta: { requiresAuth: true } },
  { path: "/transfer", component: TransferPage, meta: { requiresAuth: true } },
];

const router = createRouter({ 
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Redirect to login page if the user is not authenticated
      next({ path: '/' });
    } else {
      // Continue to the protected route if the user is authenticated
      next();
    }
  } else {
    // For non-protected routes, allow access without authentication
    next();
  }
});

export default router;