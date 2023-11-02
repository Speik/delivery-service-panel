<template>
  <ContentHeader
    subtitle="Handle your orders"
    @search="onSearchTrigger"
    @search-clear="onSearchCancel"
    @refresh="onPageRefreshClick"
  />

  <n-space :style="{ padding: '0 0 .5rem .15rem' }">
    <n-switch
      v-model:value="isOnlyActive"
      :disabled="isSearching"
      :loading="pageLoading.state"
    />
    <n-text>
      Only active
    </n-text>
  </n-space>

  <n-empty
    v-if="!ordersStore.orders.length"
    description="No orders found"
    size="huge"
    :style="{ flex: '1 1 auto' }"
  />

  <HorizontalScroller
    :breakpoints="['xs', 's', 'm', 'l']"
    active-width="850px"
  >
    <n-data-table
      v-if="ordersStore.orders.length"
      table-layout="fixed"
      :columns="createCols()"
      :data="ordersStore.orders"
      :pagination="false"
      :bordered="false"
      :style="{ borderRadius: '5px', overflow: 'hidden' }"
      :row-props="getRowProps"
    />
  </HorizontalScroller>

  <OrderDetails
    v-model:show="isDetailsShown"
    :data="(detailsData as IOrder)"
  />
</template>

<script setup lang="ts">
import {
  NEmpty,
  NDataTable,
  NText,
  NSwitch,
  NSpace,
  DataTableColumns,
} from 'naive-ui';

import { onMounted, ref, watch, h } from 'vue';

import {
  useContentScroll,
  usePageLoading,
  usePagination,
} from '@/composables';

import { OrderStatus } from '@/declarations';
import { useOrdersStore } from '@/stores';
import { formatDate, formatPrice } from '@/utils';

import ContentHeader from '@/components/ContentHeader.vue';
import SmartDate from '@/components/SmartDate.vue';
import OrderTypeTag from '@/components/OrderTypeTag.vue';
import PaymentMethodTag from '@/components/PaymentMethodTag.vue';
import EntityNumber from '@/components/EntityNumber.vue';
import HorizontalScroller from '@/components/HorizontalScroller.vue';

import OrderStatusSelect from './OrderStatusSelect.vue';
import OrderDetails from './OrderDetails.vue';

const PAGE_SIZE = 16;

const isSearching = ref(false);
const isDetailsShown = ref(false);
const isOnlyActive = ref(true);
const detailsData = ref<IOrder | null>(null);

const pagination = usePagination({ limit: PAGE_SIZE });
const ordersStore = useOrdersStore();

const { isFullyScrolled } = useContentScroll();
const { pageLoading, setLoading } = usePageLoading();

const createCols = (): DataTableColumns<IOrder> => {
  return [
    {
      title: 'Number',
      key: 'orderNumber',
      render: (row: IOrder) => {
        return h(EntityNumber, { value: row.orderNumber });
      }
    },
    {
      title: 'Status',
      key: 'status',
      render: (row: IOrder) => {
        return h('div', { style: { display: 'flex' } }, [
          h(OrderStatusSelect, {
            consistentMenuWidth: false,
            /**
             * @requires key since otherwise component
             * is not re-rendering with new data
             */
            key: `${row.id}-${row.status}`,
            value: row.status,
            type: row.type,
            style: { width: 'auto' },
            onChangeStatus: (status: OrderStatus) => onStatusChange(row, status),
          })
        ]);
      }
    },
    {
      title: 'Type',
      key: 'type',
      render: (row: IOrder) => {
        return h(OrderTypeTag, { value: row.type });
      }
    },
    {
      title: 'Payment',
      key: 'paymentMethod',
      render: (row: IOrder) => {
        return h(PaymentMethodTag, { value: row.paymentMethod });
      }
    },
    {
      title: 'Total price',
      key: 'price',
      render: (row: IOrder) => {
        return h('div', { style: { fontSize: '1.05rem' } }, [
          formatPrice(row.price),
        ]);
      }
    },
    {
      title: 'Created',
      key: 'createdAt',
      render: (row: IOrder) => {
        const absoluteDateStatuses = [
          OrderStatus.COMPLETED, OrderStatus.CANCELLED
        ];

        return h(NText, { depth: 3 }, () => [
          absoluteDateStatuses.includes(row.status)
            ? formatDate(row.createdAt)
            : h(SmartDate, { value: row.createdAt })
        ]);
      }
    }
  ];
};

const getRowProps = (row: IOrder) => {
  return {
    style: { cursor: 'pointer' },
    onClick: () => onRowClick(row),
  };
};

const fetchData = async () => {
  setLoading(true);

  await ordersStore.fetchData(
    pagination.state.offset,
    PAGE_SIZE,
    isOnlyActive.value,
  );

  setLoading(false);
};

const onPageRefreshClick = async () => {
  isSearching.value = false;

  pagination.resetPage();
  await fetchData();
};

const onSearchTrigger = async (term: string) => {
  isSearching.value = true;

  setLoading(true);
  await ordersStore.searchOrders(term);
  setLoading(false);
};

const onSearchCancel = async () => {
  isSearching.value = false;

  pagination.resetPage();
  await fetchData();
};

const onRowClick = (data: IOrder) => {
  detailsData.value = data;
  isDetailsShown.value = true;
};

const onStatusChange = (order: IOrder, status: OrderStatus) => {
  ordersStore.changeOrderStatus(order, status);
};

watch(isOnlyActive, async () => {
  isSearching.value = false;

  pagination.resetPage();
  await fetchData();
});

watch(isFullyScrolled, async isBottomReached => {
  if (isSearching.value) return;
  if (!isBottomReached) return;

  pagination.setNextPage();
  await fetchData();
});

onMounted(fetchData);
</script>