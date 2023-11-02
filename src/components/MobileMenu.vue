<template>
  <n-drawer
    v-bind="$attrs"
    id="mobile-menu"
    width="100%"
  >
    <n-drawer-content
      title="Navigation"
      closable
      :native-scrollbar="false"
    >
      <template #header>
        <n-space
          align="center"
          :size="8"
        >
          <n-icon
            size="24"
            :component="AvatarIcon"
            :color="themeVars.primaryColorHover"
          />
          {{ authorizedUser?.name ?? 'Unknown' }}
        </n-space>
      </template>

      <NavigationMenu
        :is-collapsed="false"
        @navigate="emit('close')"
      />

      <template #footer>
        <div :style="{ flex: '1 1 auto' }">
          <n-button
            secondary
            type="error"
            @click="onLogoutClick"
          >
            <template #icon>
              <n-icon
                size="24"
                :component="LogoutIcon"
              />
            </template>

            Logout
          </n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NDrawer,
  NDrawerContent,
  NSpace,
  NIcon,
  NButton,
  useThemeVars,
  useDialog,
} from 'naive-ui';

import {
  UserAvatar as AvatarIcon,
  Logout as LogoutIcon,
} from '@vicons/carbon';

import { useRouter } from 'vue-router';

import { useAuth } from '@/composables';
import { renderIcon } from '@/utils';

import NavigationMenu from './NavigationMenu.vue';

const emit = defineEmits(['close']);

const themeVars = useThemeVars();
const dialogController = useDialog();
const router = useRouter();
const { authorizedUser, setAuthorizedUser } = useAuth();

const onLogoutClick = () => {
  dialogController.error({
    title: 'Leave account',
    content: 'Are you sure you want to leave your account?',
    positiveText: 'Proceed',
    autoFocus: false,
    positiveButtonProps: {
      secondary: true,
      size: 'medium',
    },
    icon: renderIcon(LogoutIcon),
    onPositiveClick: () => {
      setAuthorizedUser(null);
      router.replace('/login');
    },
  });
};
</script>

<style>
#mobile-menu .n-drawer-body-content-wrapper {
  padding: 1rem .25rem;
}
</style>