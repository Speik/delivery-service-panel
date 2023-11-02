<template>
  <n-page-header
    :style="{
      padding: '1rem 0',
      paddingLeft: calc`1rem s:1rem m:1.5rem l:2rem xl:2rem 2xl:2rem`,
      paddingRight: calc`1rem s:1rem m:1.5rem l:2rem xl:2rem 2xl:2rem`,
    }"
  >
    <template #title>
      <n-button
        text
        size="large"
        :focusable="false"
        :style="{ fontSize: '1.2rem' }"
        @click="router.push('/dashboard')"
      >
        <template #icon>
          <n-icon
            size="24"
            :component="TruckIcon"
            :color="themeVars.primaryColorHover"
          />
        </template>
        {{ appName }}
      </n-button>
    </template>

    <template #extra>
      <div v-if="checkMobileScreen()">
        <n-button
          v-show="checkMobileScreen()"
          :style="{ marginLeft: '1rem' }"
          @click="isNavigationShown = true"
        >
          <template #icon>
            <n-icon :component="MenuIcon" />
          </template>
        </n-button>
      </div>

      <div v-else>
        <n-dropdown
          trigger="click"
          :options="dropdownOptions"
        >
          <n-button text>
            <template #icon>
              <n-icon
                size="24"
                :component="AvatarIcon"
                :color="themeVars.primaryColorHover"
              />
            </template>
            {{ authorizedUser?.name ?? 'Unknown' }}
          </n-button>
        </n-dropdown>
      </div>
    </template>
  </n-page-header>

  <MobileMenu
    v-model:show="isNavigationShown"
    @close="isNavigationShown = false"
  />
</template>

<script setup lang="ts">
import {
  NPageHeader,
  NIcon,
  NDropdown,
  NButton,
  useThemeVars,
  useDialog,
} from 'naive-ui';

import {
  Delivery as TruckIcon,
  UserAvatar as AvatarIcon,
  Logout as LogoutIcon,
  List as MenuIcon,
} from '@vicons/carbon';

import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import { useRouter } from 'vue-router';
import { inject, ref } from 'vue';

import { useAuth, useResponsive } from '@/composables';
import { renderIcon } from '@/utils';

import MobileMenu from './MobileMenu.vue';

const appName = inject('appName');

const themeVars = useThemeVars();
const router = useRouter();
const dialogController = useDialog();
const { authorizedUser, setAuthorizedUser } = useAuth();
const { calc, checkMobileScreen } = useResponsive();

const isNavigationShown = ref(false);

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

const dropdownOptions: DropdownMixedOption[] = [
  {
    label: 'Logout',
    key: 'logout',
    icon: renderIcon(LogoutIcon, {
      color: themeVars.value.errorColorHover
    }),
    props: {
      onClick: onLogoutClick,
      style: {
        color: themeVars.value.errorColorHover,
      },
    },
  }
];
</script>
