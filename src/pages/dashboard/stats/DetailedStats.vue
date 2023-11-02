<template>
  <div :style="{...sectionStyle, height: '100%'}">
    <div
      :style="{ marginBottom: '1rem' }"
    >
      <n-text depth="3">
        {{ label }}
      </n-text>
    </div>

    <div
      :style="{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
      }"
    >
      <n-progress
        type="circle"
        :percentage="ordersPercentage"
        :color="themeVars.primaryColor"
      />
    </div>

    <n-space
      v-if="!dashboardStore.isLoading"
      vertical
      :size="32"
    >
      <n-space
        :size="Number(calc`32 s:64 m:64 l:64 xl:64 2xl:64`)"
        :vertical="checkSmallScreen()"
      >
        <n-statistic
          label="Income"
          :value="data.totalIncome"
        >
          <template #prefix>
            <n-icon
              :component="IncomeIcon"
              :color="themeVars.primaryColor"
              size="24"
            />
          </template>

          <template #suffix>
            $
          </template>
        </n-statistic>

        <n-statistic
          label="Orders"
          :value="data.totalOrders"
        >
          <template #prefix>
            <n-icon
              :component="OrdersIcon"
              :color="themeVars.primaryColor"
              size="24"
            />
          </template>
        </n-statistic>
      </n-space>

      <n-statistic
        label="Average time"
        :value="averageTime"
      >
        <template #prefix>
          <n-icon
            :component="TimeIcon"
            :color="themeVars.primaryColor"
            size="24"
          />
        </template>

        <template #suffix>
          min
        </template>
      </n-statistic>
    </n-space>

    <n-space
      v-if="dashboardStore.isLoading"
      vertical
      :size="32"
    >
      <n-space :size="64">
        <div>
          <n-skeleton
            :style="{ marginBottom: '1rem' }"
            width="64px"
            height="16px"
            round
          />

          <n-skeleton
            width="128px"
            height="32px"
            round
          />
        </div>

        <div>
          <n-skeleton
            :style="{ marginBottom: '1rem' }"
            width="64px"
            height="16px"
            round
          />

          <n-skeleton
            width="128px"
            height="32px"
            round
          />
        </div>
      </n-space>

      <div>
        <n-skeleton
          :style="{ marginBottom: '1rem' }"
          width="64px"
          height="16px"
          round
        />

        <n-skeleton
          width="128px"
          height="32px"
          round
        />
      </div>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {
  NStatistic,
  NIcon,
  NText,
  NSpace,
  NSkeleton,
  NProgress,
  useThemeVars,
} from 'naive-ui';

import {
  Restaurant as OrdersIcon,
  PiggyBank as IncomeIcon,
  Timer as TimeIcon,
} from '@vicons/carbon';

import { CSSProperties, computed } from 'vue';

import { OrderType } from '@/declarations';
import { useDashboardStore } from '@/stores';
import { useResponsive } from '@/composables';

const props = defineProps<{ sectionStyle: CSSProperties, type: OrderType }>();

const themeVars = useThemeVars();
const dashboardStore = useDashboardStore();
const { calc, checkSmallScreen } = useResponsive();

const label = computed(() => {
  return props.type.charAt(0).toUpperCase() + props.type.slice(1);
});

const data = computed(() => {
  if (props.type === OrderType.DELIVERY) {
    return dashboardStore.data.detailedStats.delivery;
  }

  return dashboardStore.data.detailedStats.takeaway;
});

const ordersPercentage = computed(() => {
  if (dashboardStore.isLoading) {
    return 0;
  }

  const deliveryData = dashboardStore.data.detailedStats.delivery;
  const takeawayData = dashboardStore.data.detailedStats.takeaway;
  const totalOrders = deliveryData.totalOrders + takeawayData.totalOrders;

  if (totalOrders === 0) {
    return 0;
  }

  return Number((data.value.totalOrders / totalOrders * 100).toFixed(1));
});

const averageTime = computed(() => {
  return Math.ceil(data.value.averageTime / 60);
});
</script>