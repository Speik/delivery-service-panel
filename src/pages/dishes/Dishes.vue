<template>
  <ContentHeader
    show-create-button
    create-button-label="New dish"
    subtitle="Present your goodies"
    @refresh="onPageRefreshClick"
    @search="onSearchTrigger"
    @search-clear="onSearchCancel"
    @create="isCreateFormShown = true"
  />

  <DishDetails
    v-model:show="isDetailsShown"
    :data="(detailsData as IDish)"
  />

  <CreateDishForm
    :shown="isCreateFormShown"
    @cancel="isCreateFormShown = false"
  />

  <EditDishForm
    :shown="isEditFormShown"
    :data="(detailsData as IDish)"
    @cancel="isEditFormShown = false"
    @save="isEditFormShown = false"
  />

  <n-empty
    v-if="!dishesStore.dishes.length"
    description="No dishes found"
    size="huge"
    :style="{ flex: '1 1 auto' }"
  />

  <HorizontalScroller
    :breakpoints="['xs', 's', 'm']"
    active-width="800px"
  >
    <n-data-table
      v-if="dishesStore.dishes.length"
      table-layout="fixed"
      :columns="createCols()"
      :data="dishesStore.dishes"
      :pagination="false"
      :bordered="false"
      :style="{ borderRadius: '5px', overflow: 'hidden' }"
      :row-props="getRowProps"
    />
  </HorizontalScroller>
</template>

<script setup lang="ts">
import {
  NEmpty,
  NDataTable,
  NText,
  DataTableColumns,
  NSwitch,
  NTag,
  NIcon,
  NSpace,
  NButton,
  useDialog,
} from 'naive-ui';

import {
  useContentScroll,
  usePageLoading,
  usePagination,
} from '@/composables';

import {
  Tag as CategoryIcon,
  Edit as EditIcon,
  TrashCan as DeleteIcon,
} from '@vicons/carbon';

import { h, onMounted, ref, watch } from 'vue';

import { renderIcon, formatPrice } from '@/utils';
import { useDishesStore } from '@/stores';

import ContentHeader from '@/components/ContentHeader.vue';
import HorizontalScroller from '@/components/HorizontalScroller.vue';

import DishDetails from './DishDetails.vue';
import CreateDishForm from './CreateDishForm.vue';
import EditDishForm from './EditDishForm.vue';

const PAGE_SIZE = 16;

const pagination = usePagination({ limit: PAGE_SIZE });
const dishesStore = useDishesStore();
const dialogController = useDialog();

const { isFullyScrolled } = useContentScroll();
const { setLoading } = usePageLoading();

const isSearching = ref(false);

const isDetailsShown = ref(false);
const detailsData = ref<IDish | null>(null);

const isCreateFormShown = ref(false);
const isEditFormShown = ref(false);

const createCols = (): DataTableColumns<IDish> => {
  return [
    {
      title: 'Dish',
      key: 'name',
      render: (row: IDish) => {
        return h(NText, () => row.name);
      },
    },
    {
      title: 'Category',
      key: 'category.name',
      render: (row: IDish) => {
        return h(NTag, { bordered: false }, {
          default: () => row.category?.name ?? 'Unknown',
          icon: () => h(NIcon, { component: CategoryIcon, size: 16 }),
        });
      },
    },
    {
      title: 'Price',
      key: 'price',
      render: (row: IDish) => {
        return h('div', { style: { fontSize: '1.05rem' } }, [
          formatPrice(row.price),
        ]);
      },
    },
    {
      title: 'Visible',
      key: 'visible',
      render: (row: IDish) => {
        return h(NSwitch, {
          /**
           * @requires key since otherwise component
           * is not re-rendering with new data
           */
          key: `${row.id}-${row.visible}`,
          defaultValue: row.visible,
          onClick: (event: MouseEvent) => event.stopPropagation(),
          onUpdateValue: async (value: boolean) => {
            await setDishVisibility(row, value);
          },
        });
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (row: IDish) => {
        const commonProps = {
          secondary: true,
          circle: true,
          strong: true,
        };

        return h(NSpace, () => [
          h(
            NButton,
            {
              ...commonProps,
              type: 'warning',
              onClick: (event: MouseEvent) => {
                event.stopPropagation();
                onDishEdit(row);
              },
            },
            { icon: () => h(NIcon, { component: EditIcon }) }
          ),
          h(
            NButton,
            {
              ...commonProps,
              type: 'error',
              onClick: (event: MouseEvent) => {
                event.stopPropagation();
                onDishDelete(row);
              },
            },
            { icon: () => h(NIcon, { component: DeleteIcon }) }
          ),
        ]);
      },
    },
  ];
};

const getRowProps = (row: IDish) => {
  return {
    style: { cursor: 'pointer' },
    onClick: () => onRowClick(row),
  };
};

const setDishVisibility = async (dish: IDish, value: boolean) => {
  setLoading(true);
  await dishesStore.setVisibility(dish, value);
  setLoading(false);
};

const fetchData = async () => {
  setLoading(true);
  await dishesStore.fetchData(pagination.state.offset, PAGE_SIZE);
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
  await dishesStore.searchDishes(term);
  setLoading(false);
};

const onSearchCancel = async () => {
  isSearching.value = false;

  pagination.resetPage();
  await fetchData();
};

const onRowClick = (data: IDish) => {
  detailsData.value = data;
  isDetailsShown.value = true;
};

const onDishEdit = (dish: IDish) => {
  detailsData.value = dish;
  isEditFormShown.value = true;
};

const onDishDelete = (dish: IDish) => {
  dialogController.error({
    title: `Delete ${dish.name}`,
    content: (
      `Are you sure you want to delete dish '${dish.name}'?`
    ),
    positiveText: 'Delete',
    autoFocus: false,
    positiveButtonProps: {
      secondary: true,
      size: 'medium',
    },
    icon: renderIcon(DeleteIcon),
    onPositiveClick: async () => {
      await dishesStore.deleteDish(dish);
    },
  });
};

watch(isFullyScrolled, async isBottomReached => {
  if (isSearching.value) return;
  if (!isBottomReached) return;

  pagination.setNextPage();
  await fetchData();
});

onMounted(async () => {
  await fetchData();
});
</script>