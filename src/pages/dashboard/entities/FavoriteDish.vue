<template>
  <n-space vertical>
    <n-text depth="3">
      Favorite dish
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
      class="favorite-dish"
    >
      <template #avatar>
        <n-avatar
          size="large"
          :src="resolveResourceUrl('avatar', data.image)"
          :style="{ marginRight: '.5rem' }"
        />
      </template>

      <template #header>
        {{ data.name }}
      </template>

      <template #header-extra>
        <div :style="{ marginLeft: '.75rem' }">
          {{ formatPrice(data.price) }}
        </div>
      </template>

      <template #description>
        <n-tag
          :bordered="false"
          size="small"
        >
          <template #icon>
            <n-icon :component="CategoryIcon" />
          </template>

          {{ data.category?.name ?? 'Unknown' }}
        </n-tag>
      </template>
    </n-thing>

    <n-empty
      v-if="!dashboardStore.isLoading && !data"
      description="Could not get data"
      size="small"
    >
      <template #icon>
        <n-icon :component="DishesIcon" />
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
  NEmpty,
} from 'naive-ui';

import {
  Tag as CategoryIcon,
  ServiceDesk as DishesIcon,
} from '@vicons/carbon';

import { computed } from 'vue';

import { formatPrice, resolveResourceUrl } from '@/utils';
import { useDashboardStore } from '@/stores';

const dashboardStore = useDashboardStore();

const data = computed(() => {
  return dashboardStore.data.favoriteDish;
});
</script>