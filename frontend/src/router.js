import { createRouter, createWebHistory } from 'vue-router';
import RequesterView from './views/RequesterView.vue';
import ValidatorView from './views/ValidatorView.vue';
import { getRole } from './lib/user';
import { toast } from './lib/toast';
import { ROLES } from '../../server/src/constants/roles';

const routes = [
  { path: '/', redirect: '/requester' },
  { path: '/requester', component: RequesterView, meta: { role: ROLES.REQUESTER } },
  { path: '/validator', component: ValidatorView, meta: { role: ROLES.VALIDATOR } }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, _from, next) => {
  const required = to.meta?.role;
  if (!required) return next();

  const current = getRole();
  if (current === required) return next();

  // Redirect to allowed route and explain
  toast(`Access to ${to.path} requires ${required}. Redirected.`, 'info');
  return next({ path: current === ROLES.VALIDATOR ? '/validator' : '/requester' });
});

export default router;

