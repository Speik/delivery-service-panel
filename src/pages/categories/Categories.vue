<template>
  <ContentHeader
    show-create-button
    create-button-label="New category"
    subtitle="Help organize your dishes"
    @refresh="onPageRefreshClick"
    @search="onSearchTrigger"
    @search-clear="onSearchCancel"
    @create="isCreateFormShown = true"
  />

  <CreateCategoryForm
    :shown="isCreateFormShown"
    @cancel="isCreateFormShown = false"
  />

  <n-empty
    v-if="!categoriesStore.categories.length"
    description="No categories found"
    size="huge"
    :style="{ flex: '1 1 auto' }"
  />

  <n-grid
    v-else
    cols="1 s:2 m:3 l:4 xl:4 2xl:4"
    x-gap="16"
    y-gap="16"
    :style="{ paddingBottom: '2rem' }"
    responsive="screen"
  >
    <n-gi
      v-for="category in categoriesStore.categories"
      :key="category.id"
    >
      <CategoryEntity :data="category" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NEmpty, NGrid, NGi } from 'naive-ui';
import { onMounted, ref, watch } from 'vue';

import {
  useContentScroll,
  usePageLoading,
  usePagination,
} from '@/composables';

import { useCategoriesStore } from '@/stores';
import ContentHeader from '@/components/ContentHeader.vue';

import CreateCategoryForm from './CreateCategoryForm.vue';
import CategoryEntity from './CategoryEntity.vue';

const PAGE_SIZE = 36;

const isSearching = ref(false);
const isCreateFormShown = ref(false);

const pagination = usePagination({ limit: PAGE_SIZE });
const categoriesStore = useCategoriesStore();

const { isFullyScrolled } = useContentScroll();
const { setLoading } = usePageLoading();

const fetchData = async () => {
  setLoading(true);
  await categoriesStore.fetchData(pagination.state.offset, PAGE_SIZE);
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
  await categoriesStore.searchCategories(term);
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

onMounted(async () => {
  await fetchData();
});
</script>