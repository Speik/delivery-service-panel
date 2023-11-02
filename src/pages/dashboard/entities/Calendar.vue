<template>
  <div :style="{ ...sectionStyle, height: '100%'}">
    <n-calendar
      id="calendar"
      v-model:value="selectedDate"
      :style="{ height: '100%' }"
      :is-date-disabled="timestamp => timestamp > Date.now()"
      @update:value="onDateClick"
      @panel-change="onMonthChange"
    />

    <n-drawer
      v-bind="$attrs"
      id="calendar-details"
      v-model:show="isDetailsShown"
      :width="calc`100% s:100% m:384px l:384px xl:384px 2xl:384px`"
    >
      <n-drawer-content
        :native-scrollbar="false"
        closable
      >
        <template #header>
          {{ drawerTitle }}
        </template>

        <div v-if="isLoading">
          <n-space
            vertical
            :size="20"
          >
            <n-skeleton
              v-for="i in Array.from({ length: 4 }, (_, i) => i)"
              :key="i"
              :width="calc`100% s:100% m:336px l:336px xl:336px 2xl:336px`"
              height="88px"
            />
          </n-space>
        </div>

        <n-space
          v-if="!isLoading && data"
          :size="20"
          vertical
        >
          <n-text depth="3">
            {{ data.orders.length }} orders
          </n-text>

          <n-thing
            v-for="order in data.orders"
            :key="order.id"
            :style="{ padding: '1rem', backgroundColor: themeVars.bodyColor }"
          >
            <template #avatar>
              <n-avatar
                :style="{
                  marginRight: '.5rem',
                  backgroundColor: themeVars.primaryColorSuppl,
                  color: themeVars.primaryColor,
                }"
              >
                <n-icon
                  size="22"
                  :component="OrdersIcon"
                />
              </n-avatar>
            </template>

            <template #header>
              <EntityNumber :value="order.orderNumber" />
            </template>

            <template #header-extra>
              <div :style="{ marginLeft: '.75rem' }">
                {{ formatPrice(order.price) }}
              </div>
            </template>

            <template #description>
              <n-space>
                <OrderTypeTag
                  :value="order.type"
                  size="small"
                  :style="{ backgroundColor: themeVars.closeColorHover }"
                />
                <PaymentMethodTag
                  :value="order.paymentMethod"
                  size="small"
                  :style="{ backgroundColor: themeVars.closeColorHover }"
                />
              </n-space>
            </template>
          </n-thing>
        </n-space>

        <template #footer>
          <div
            v-if="isLoading"
            :style="{ flex: '1 1 auto' }"
          >
            <n-skeleton
              width="156px"
              height="12px"
              :style="{ marginTop: '.5rem' }"
            />

            <n-skeleton
              width="128px"
              height="32px"
              :style="{ marginTop: '.5rem' }"
            />
          </div>

          <div
            v-if="!isLoading"
            :style="{ flex: '1 1 auto' }"
          >
            <n-statistic
              label="Total income"
              :value="data?.totalIncome.toFixed(2) ?? 0"
            >
              <template #suffix>
                $
              </template>
            </n-statistic>
          </div>
        </template>

        <n-empty
          v-if="!isLoading && !data"
          description="Could not get data"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }"
        >
          <template #icon>
            <n-icon :component="OrdersIcon" />
          </template>
        </n-empty>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import {
  NCalendar,
  NDrawer,
  NDrawerContent,
  NThing,
  NAvatar,
  NIcon,
  NSpace,
  NStatistic,
  NSkeleton,
  NText,
  NEmpty,
  useThemeVars,
} from 'naive-ui';

import { Restaurant as OrdersIcon } from '@vicons/carbon';
import { CSSProperties, computed, ref } from 'vue';

import { formatPrice, getDayRange, getMonthRange } from '@/utils';
import { useDashboardStore } from '@/stores';
import { useResponsive } from '@/composables';

import OrderTypeTag from '@/components/OrderTypeTag.vue';
import PaymentMethodTag from '@/components/PaymentMethodTag.vue';
import EntityNumber from '@/components/EntityNumber.vue';

type MonthChangePayload = {
  year: number;
  month: number;
}

defineProps<{ sectionStyle: CSSProperties }>();

const themeVars = useThemeVars();
const dashboardStore = useDashboardStore();
const { calc } = useResponsive();

const isLoading = ref(false);
const isDetailsShown = ref(false);
const selectedDate = ref(Date.now());

const data = computed(() => {
  return dashboardStore.data.dailyStats;
});

const drawerTitle = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  return (
    new Intl.DateTimeFormat('en', options)
      .format(new Date(selectedDate.value))
  );
});

const onDateClick = async (timestamp: number) => {
  isDetailsShown.value = true;
  isLoading.value = true;

  const [start, end] = getDayRange(new Date(timestamp));
  dashboardStore.setDailyDateRange(start, end);

  try {
    await dashboardStore.fetchDailyStats();
  } finally {
    isLoading.value = false;
  }
};

const onMonthChange = async ({ year, month }: MonthChangePayload) => {
  const [start, end] = getMonthRange(new Date(year, month - 1, 15));
  dashboardStore.setMonthlyDateRange(start, end);

  await dashboardStore.fetchData();
};
</script>

<style>
#calendar-details .n-drawer-body-content-wrapper {
  height: 100%;
}

@media screen and (max-width: 576px) {
  #calendar .n-calendar-date__day {
    display: none;
  }

  #calendar .n-calendar-date__date {
    font-size: .95rem;
  }

  #calendar .n-calendar-header {
    display: block;
  }

  #calendar .n-calendar-header__title {
    margin-bottom: 1rem;
  }
}
</style>