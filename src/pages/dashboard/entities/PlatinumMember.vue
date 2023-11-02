<template>
  <n-space vertical>
    <n-text depth="3">
      Platinum member
    </n-text>

    <n-thing v-if="dashboardStore.isLoading">
      <template #avatar>
        <n-skeleton
          height="40px"
          width="40px"
        />
      </template>

      <template #header>
        <n-skeleton
          :style="{ width: '128px' }"
          round
          text
        />
      </template>

      <template #header-extra>
        <n-skeleton
          width="40px"
          round
          text
        />
      </template>

      <template #description>
        <n-skeleton
          width="64px"
          height="16px"
          round
        />
      </template>
    </n-thing>

    <n-thing
      v-if="!dashboardStore.isLoading && data"
      class="platinum-member"
    >
      <template #avatar>
        <n-avatar
          size="large"
          :style="{
            marginRight: '.5rem',
            backgroundColor: themeVars.primaryColorSuppl,
            color: themeVars.primaryColor,
          }"
        >
          <n-icon :component="UserIcon" />
        </n-avatar>
      </template>

      <template #header>
        {{ data.name }}
      </template>

      <template #header-extra>
        <div :style="{ marginLeft: '.75rem' }">
          {{ data.totalOrders }} orders
        </div>
      </template>

      <template #description>
        <n-tooltip>
          <template #trigger>
            <a
              :href="`tel:${data.phone}`"
              :style="{ textDecoration: 'none' }"
            >
              <n-tag
                size="small"
                :bordered="false"
                :style="{ cursor: 'pointer' }"
              >
                <template #icon>
                  <n-icon :component="PhoneIcon" />
                </template>
                +{{ data.phone }}
              </n-tag>
            </a>
          </template>

          Click to call number
        </n-tooltip>
      </template>
    </n-thing>

    <n-empty
      v-if="!dashboardStore.isLoading && !data"
      description="Could not get data"
      size="small"
    >
      <template #icon>
        <n-icon :component="UserIcon" />
      </template>
    </n-empty>
  </n-space>
</template>

<script setup lang="ts">
import {
  NAvatar,
  NText,
  NTag,
  NIcon,
  NSpace,
  NThing,
  NSkeleton,
  NTooltip,
  NEmpty,
  useThemeVars,
} from 'naive-ui';

import {
  UserFavorite as UserIcon,
  Phone as PhoneIcon,
} from '@vicons/carbon';

import { computed } from 'vue';
import { useDashboardStore } from '@/stores';

const themeVars = useThemeVars();
const dashboardStore = useDashboardStore();

const data = computed(() => {
  return dashboardStore.data.platinumMember;
});
</script>