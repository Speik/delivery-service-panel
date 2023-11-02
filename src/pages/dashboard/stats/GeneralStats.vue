<template>
  <n-grid
    cols="1 s:2 m:1 l:1 xl:1 2xl:1"
    rows="4"
    x-gap="16"
    y-gap="16"
    responsive="screen"
  >
    <n-gi
      v-for="meta in statsMeta"
      :key="meta.key"
      :style="sectionStyle"
    >
      <FancyStatistic
        :title="meta.label"
        :value="meta.value"
        :loading="dashboardStore.isLoading"
        :icon="meta.icon"
        :icon-background="themeVars.primaryColorSuppl"
        :icon-color="themeVars.primaryColor"
        :suffix="meta.suffix"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi, useThemeVars } from 'naive-ui';
import { CSSProperties, computed } from 'vue';

import {
  Restaurant as OrdersIcon,
  UserMultiple as CustomersIcon,
  PiggyBank as IncomeIcon,
  DocumentTasks as BillIcon,
} from '@vicons/carbon';

import { useDashboardStore } from '@/stores';

import FancyStatistic from '../entities/FancyStatistic.vue';

defineProps<{ sectionStyle: CSSProperties }>();

const themeVars = useThemeVars();
const dashboardStore = useDashboardStore();

const statsMeta = computed(() => {
  return [
    {
      key: 'income',
      icon: IncomeIcon,
      label: 'Income',
      value: dashboardStore.data.generalStats.totalIncome,
      suffix: '$',
    },
    {
      key: 'averageBill',
      icon: BillIcon,
      label: 'Average bill',
      value: dashboardStore.data.generalStats.averageBill,
      suffix: '$',
    },
    {
      key: 'orders',
      icon: OrdersIcon,
      label: 'Orders',
      value: dashboardStore.data.generalStats.totalOrders,
    },
    {
      key: 'uniqueCustomers',
      icon: CustomersIcon,
      label: 'Unique customers',
      value: dashboardStore.data.generalStats.uniqueCustomers,
    },
  ];
});
</script>