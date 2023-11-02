<template>
  <n-badge
    :color="themeVars.primaryColor"
    :show="isShown"
    dot
    processing
  >
    <slot />
  </n-badge>
</template>

<script setup lang="ts">
import { NBadge, useThemeVars } from 'naive-ui';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth, useFetch, useSleep } from '@/composables';

type OrdersCount = { count: string };

const isShown = ref(false);

const router = useRouter();
const themeVars = useThemeVars();
const { sleep } = useSleep();

const checkOrdersNotification = async () => {
  const { authorizedUser } = useAuth();
  if (!authorizedUser) return;

  const { count } = await useFetch<OrdersCount>('/orders/count/active', {
    method: 'GET',
  });

  await sleep(300);
  isShown.value = Boolean(Number(count));
};

watch(router.currentRoute, checkOrdersNotification);
onMounted(checkOrdersNotification);
</script>