<template>
  <n-space vertical>
    <n-text depth="3">
      Most costly order
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
      class="expensive-order"
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
          <n-icon :component="OrdersIcon" />
        </n-avatar>
      </template>

      <template #header>
        <EntityNumber :value="data.orderNumber" />
      </template>

      <template #header-extra>
        <div :style="{ marginLeft: '.75rem' }">
          {{ formatPrice(data.price) }}
        </div>
      </template>

      <template #description>
        <n-space>
          <OrderTypeTag
            :value="data.type"
            size="small"
          />
          <PaymentMethodTag
            :value="data.paymentMethod"
            size="small"
          />
        </n-space>
      </template>
    </n-thing>

    <n-empty
      v-if="!dashboardStore.isLoading && !data"
      description="Could not get data"
      size="small"
    >
      <template #icon>
        <n-icon :component="OrdersIcon" />
      </template>
    </n-empty>
  </n-space>
</template>

<script setup lang="ts">
import {
  NAvatar,
  NText,
  NIcon,
  NSpace,
  NThing,
  NSkeleton,
  NEmpty,
  useThemeVars,
} from 'naive-ui';

import { Restaurant as OrdersIcon } from '@vicons/carbon';
import { computed } from 'vue';

import { formatPrice } from '@/utils';
import { useDashboardStore } from '@/stores';

import OrderTypeTag from '@/components/OrderTypeTag.vue';
import PaymentMethodTag from '@/components/PaymentMethodTag.vue';
import EntityNumber from '@/components/EntityNumber.vue';

const themeVars = useThemeVars();
const dashboardStore = useDashboardStore();

const data = computed(() => {
  return dashboardStore.data.costlyOrder;
});
</script>