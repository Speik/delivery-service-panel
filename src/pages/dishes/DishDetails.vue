<template>
  <n-drawer
    v-bind="$attrs"
    :width="calc`100% s:100% m:384px l:384px xl:384px 2xl:384px`"
  >
    <n-drawer-content
      :native-scrollbar="false"
      closable
    >
      <template #header>
        Dish details
      </template>

      <n-card
        :title="data.name"
        embedded
      >
        <template #cover>
          <n-image
            preview-disabled
            :src="resolveResourceUrl('image', data.image)"
            :alt="data.name"
          />
        </template>

        <template #header-extra>
          {{ formatPrice(data.price) }}
        </template>

        <n-text :depth="data.description ? 1 : 3">
          {{ data.description ?? 'No description' }}
        </n-text>

        <template #footer>
          <n-space>
            <VisibilityTag :visible="data.visible" />

            <n-tag :bordered="false">
              <template #icon>
                <n-icon :component="TagIcon" />
              </template>
              {{ data.category?.name ?? 'Unknown' }}
            </n-tag>
          </n-space>
        </template>
      </n-card>

      <p :style="{ marginTop: '1rem', textAlign: 'center' }">
        <n-text depth="3">
          Updated
          <SmartDate :value="data.updatedAt" />
        </n-text>
      </p>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NDrawer,
  NDrawerContent,
  NSpace,
  NImage,
  NCard,
  NText,
  NTag,
  NIcon,
} from 'naive-ui';

import { Tag as TagIcon } from '@vicons/carbon';

import { formatPrice, resolveResourceUrl } from '@/utils';
import { useResponsive } from '@/composables';

import SmartDate from '@/components/SmartDate.vue';
import VisibilityTag from './VisibilityTag.vue';

defineProps<{ data: IDish }>();

const { calc } = useResponsive();
</script>