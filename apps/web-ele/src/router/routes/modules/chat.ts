import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Chat',
    path: '/chat',
    component: () => import('#/views/chat/index.vue'),
    meta: {
      // affixTab: true,
      icon: 'lucide:bot-message-square',
      order: 2,
      title: $t('page.chat.title'),
    },
  },
];

export default routes;
