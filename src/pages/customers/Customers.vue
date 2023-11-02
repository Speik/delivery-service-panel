<template>
  <ContentHeader
    subtitle="People that you love"
    @search="onSearchTrigger"
    @search-clear="onSearchCancel"
    @refresh="onPageRefreshClick"
  />

  <n-empty
    v-if="!customersStore.customers.length"
    description="No customers found"
    size="huge"
    :style="{ flex: '1 1 auto' }"
  />

  <HorizontalScroller
    :breakpoints="['xs', 's', 'm', 'l']"
    active-width="1300px"
  >
    <n-data-table
      v-if="customersStore.customers.length"
      striped
      table-layout="fixed"
      :columns="createCols()"
      :data="customersStore.customers"
      :pagination="false"
      :bordered="false"
      :style="{ borderRadius: '5px', overflow: 'hidden' }"
    />
  </HorizontalScroller>
</template>

<script setup lang="ts">
import {
  NEmpty,
  NDataTable,
  NText,
  DataTableColumns,
} from 'naive-ui';

import { onMounted, ref, watch, h } from 'vue';

import {
  usePageLoading,
  useContentScroll,
  usePagination,
} from '@/composables';

import { useCustomersStore } from '@/stores';
import { formatDate } from '@/utils';

import PaymentMethodTag from '@/components/PaymentMethodTag.vue';
import OrderTypeTag from '@/components/OrderTypeTag.vue';
import ContentHeader from '@/components/ContentHeader.vue';
import EntityNumber from '@/components/EntityNumber.vue';
import HorizontalScroller from '@/components/HorizontalScroller.vue';

const PAGE_SIZE = 16;
const isSearching = ref(false);

const pagination = usePagination({ limit: PAGE_SIZE });
const customersStore = useCustomersStore();

const { isFullyScrolled } = useContentScroll();
const { setLoading } = usePageLoading();

const createCols = (): DataTableColumns<ICustomer> => {
  return [
    {
      title: 'Number',
      key: 'customerNumber',
      render: (row: ICustomer) => {
        return h(EntityNumber, { value: row.customerNumber });
      }
    },
    {
      title: 'Phone',
      key: 'phone',
      render: (row: ICustomer) => {
        return `+${row.phone}`;
      }
    },
    {
      title: 'Name',
      key: 'name',
      ellipsis: { tooltip: true },
    },
    {
      title: 'Address',
      key: 'address',
      ellipsis: { tooltip: true },
      render: (row: ICustomer) => {
        return row.address ?? h(
          NText,
          { depth: 3 },
          { default: () => 'No address' }
        );
      }
    },
    {
      title: 'Preferred payment',
      key: 'preferredPayment',
      render: (row: ICustomer) => {
        return h(PaymentMethodTag, { value: row.preferredPayment });
      }
    },
    {
      title: 'Preferred order',
      key: 'preferredOrder',
      render: (row: ICustomer) => {
        return h(OrderTypeTag, { value: row.preferredOrder });
      }
    },
    {
      title: 'First Order',
      key: 'createdAt',
      render: (row: ICustomer) => {
        return h(NText, { depth: 3 }, () => [
          formatDate(row.createdAt)
        ]);
      }
    },
    {
      title: 'Last Order',
      key: 'updatedAt',
      render: (row: ICustomer) => {
        return h(NText, { depth: 3 }, () => [
          formatDate(row.updatedAt)
        ]);
      }
    }
  ];
};

const fetchData = async () => {
  setLoading(true);
  await customersStore.fetchData(pagination.state.offset, PAGE_SIZE);
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
  await customersStore.searchCustomers(term);
  setLoading(false);
};

const onSearchCancel = async () => {
  isSearching.value = false;

  pagination.resetPage();
  await fetchData();
};

watch(isFullyScrolled, async isBottomReached => {
  if (isSearching.value) return;
  if (!isBottomReached) return;

  pagination.setNextPage();
  await fetchData();
});

onMounted(fetchData);
</script>