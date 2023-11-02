<template>
  <n-menu
    v-model:value="selectedNavItem"
    :collapsed="isCollapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
  />
</template>

<script setup lang="ts">
import { NMenu, MenuOption } from 'naive-ui';

import { ref, watch, h, onMounted, Component } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

import { renderIcon } from '@/utils';

import OrderNotificationBadge from './OrderNotificationBadge.vue';

const emit = defineEmits(['navigate']);
defineProps<{ isCollapsed: boolean }>();

const ORDERS_ROUTE = '/orders';

const selectedNavItem = ref('');
const menuOptions = ref<MenuOption[]>([]);
const router = useRouter();

const renderMenuLabel = (label: string, path: string) => {
  return () => {
    return h(
      RouterLink,
      { to: { path }, onClick: () => emit('navigate') },
      { default: () => label }
    );
  };
};

const buildMenuOptions = () => {
  const routes = router.getRoutes();

  menuOptions.value = routes.reduce<MenuOption[]>((result, { path, meta }) => {
    if (!meta.navigational) return result;

    const icon = path !== ORDERS_ROUTE
      ? renderIcon(meta.icon as Component)
      : () => {
        return h(OrderNotificationBadge, null, {
          default: renderIcon(meta.icon as Component),
        });
      };

    result.push({
      key: path,
      label: renderMenuLabel(String(meta.title), path),
      icon,
    });

    if (meta.divided) {
      result.push({ type: 'divider' });
    }

    return result;
  }, []);
};

const handlePageChange = () => {
  selectedNavItem.value = router.currentRoute.value.path;
};

watch(router.currentRoute, handlePageChange);

onMounted(() => {
  handlePageChange();
  buildMenuOptions();
});
</script>