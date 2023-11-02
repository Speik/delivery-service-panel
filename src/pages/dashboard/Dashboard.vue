<template>
  <ContentHeader
    hide-search
    subtitle="Your monthly achievments"
    @refresh="onPageRefreshClick"
  />

  <n-grid
    cols="1 s:1 m:3 l:3 xl:3 2xl:3"
    x-gap="16"
    y-gap="16"
    :style="{ marginBottom: '1rem' }"
    responsive="screen"
  >
    <n-gi span="2">
      <Calendar :section-style="dashboardSectionStyle" />
    </n-gi>

    <n-gi span="1">
      <GeneralStats :section-style="dashboardSectionStyle" />
    </n-gi>
  </n-grid>

  <n-grid
    cols="1 s:1 m:3 l:3 xl:3 2xl:3"
    x-gap="16"
    y-gap="16"
    :style="{ marginBottom: '2rem' }"
    responsive="screen"
  >
    <n-gi>
      <ExtraStats :section-style="dashboardSectionStyle" />
    </n-gi>

    <n-gi :span="2">
      <n-grid
        cols="1 s:2 m:2 l:2 xl:2 2xl:2"
        x-gap="16"
        y-gap="16"
        responsive="screen"
      >
        <n-gi>
          <DetailedStats
            :section-style="dashboardSectionStyle"
            :type="OrderType.DELIVERY"
          />
        </n-gi>

        <n-gi>
          <DetailedStats
            :section-style="dashboardSectionStyle"
            :type="OrderType.TAKEAWAY"
          />
        </n-gi>
      </n-grid>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi, useThemeVars } from 'naive-ui';
import { CSSProperties, onMounted } from 'vue';

import { OrderType } from '@/declarations';
import { useDashboardStore } from '@/stores';
import { getMonthRange } from '@/utils';

import ContentHeader from '@/components/ContentHeader.vue';

import GeneralStats from './stats/GeneralStats.vue';
import DetailedStats from './stats/DetailedStats.vue';
import ExtraStats from './stats/ExtraStats.vue';
import Calendar from './entities/Calendar.vue';

const themeVars = useThemeVars();
const dashboardStore = useDashboardStore();

const dashboardSectionStyle: CSSProperties = {
  padding: '1rem',
  backgroundColor: themeVars.value.baseColor,
  borderRadius: '5px',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const onPageRefreshClick = async () => {
  await dashboardStore.fetchData();
};

onMounted(async () => {
  const [start, end] = getMonthRange(new Date());
  dashboardStore.setMonthlyDateRange(start, end);

  await dashboardStore.fetchData();
});
</script>