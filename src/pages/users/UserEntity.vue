<template>
  <n-thing
    :style="{
      backgroundColor: themeVars.baseColor,
      padding: '1rem',
      borderRadius: '5px',
    }"
  >
    <template #avatar>
      <n-avatar round>
        <n-icon :component="UserIcon" />
      </n-avatar>
    </template>

    <template #header>
      {{ data.name }}
    </template>

    <template #description>
      <n-text depth="3">
        {{ data.createdAt.toLocaleDateString() }}
      </n-text>
    </template>

    <template #header-extra>
      <n-tooltip
        trigger="hover"
        :disabled="!isAuthorizedUser"
      >
        <template #trigger>
          <div>
            <n-button
              circle
              secondary
              size="small"
              type="error"
              :focusable="false"
              :disabled="isAuthorizedUser"
              @click="onDeleteClick(data)"
            >
              <template #icon>
                <n-icon
                  size="14"
                  :component="TrashIcon"
                />
              </template>
            </n-button>
          </div>
        </template>
        You can't delete yourself
      </n-tooltip>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import {
  NThing,
  NAvatar,
  NIcon,
  NButton,
  NText,
  NTooltip,
  useThemeVars,
  useDialog,
} from 'naive-ui';

import {
  User as UserIcon,
  TrashCan as TrashIcon,
} from '@vicons/carbon';

import { computed } from 'vue';

import { useUsersStore } from '@/stores';
import { renderIcon } from '@/utils';
import { useAuth } from '@/composables';

const props = defineProps<{ data: IUser }>();

const themeVars = useThemeVars();
const dialogController = useDialog();
const usersStore = useUsersStore();
const { authorizedUser } = useAuth();

const isAuthorizedUser = computed(() => {
  return props.data.id === authorizedUser?.id;
});

const onDeleteClick = (user: IUser) => {
  if (isAuthorizedUser.value) return;

  dialogController.error({
    title: `Delete ${user.name}`,
    content: `Are you sure you want to delete ${user.name}?`,
    positiveText: 'Delete',
    autoFocus: false,
    positiveButtonProps: {
      secondary: true,
      size: 'medium',
    },
    icon: renderIcon(TrashIcon),
    onPositiveClick: async () => {
      if (isAuthorizedUser.value) {
        throw new Error('You can\'t delete yourself');
      }

      await usersStore.deleteUser(user);
    },
  });
};
</script>