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
        <EntityNumber :value="data.orderNumber" />
      </template>

      <n-space
        vertical
        :size="20"
      >
        <OrderDishes :data="data" />
        <OrderCustomer :data="data" />

        <p :style="{ textAlign: 'center', margin: 0 }">
          <n-text
            v-if="isOrderFinished"
            depth="3"
          >
            Created {{ formatDate(data.createdAt) }}
          </n-text>

          <n-text
            v-else
            depth="3"
          >
            Created
            <SmartDate :value="data.createdAt" />
          </n-text>
        </p>
      </n-space>

      <template #footer>
        <OrderStatusSelect
          editable
          :value="data.status"
          :type="data.type"
          @change-status="(status: OrderStatus) => {
            if (data.status === status) return;
            return onStatusChange(data, status);
          }"
        />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NDrawer, NDrawerContent, NSpace, NText } from 'naive-ui';

import { OrderStatus } from '@/declarations';
import { formatDate } from '@/utils';
import { useOrdersStore } from '@/stores';
import { useResponsive } from '@/composables';

import SmartDate from '@/components/SmartDate.vue';
import EntityNumber from '@/components/EntityNumber.vue';

import OrderDishes from './OrderDishes.vue';
import OrderCustomer from './OrderCustomer.vue';
import OrderStatusSelect from './OrderStatusSelect.vue';

const props = defineProps<{ data: IOrder }>();
const ordersStore = useOrdersStore();
const { calc } = useResponsive();

const isOrderFinished = computed(() => {
  const finishedStatuses = [
    OrderStatus.COMPLETED, OrderStatus.CANCELLED,
  ];

  return finishedStatuses.includes(props.data.status);
});

const onStatusChange = async (order: IOrder, status: OrderStatus) => {
  await ordersStore.changeOrderStatus(order, status);
};
</script>