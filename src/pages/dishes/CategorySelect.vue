<template>
  <n-select
    v-bind="$attrs"
    placeholder="Select category"
    :options="categories"
    :loading="isLoading"
    :reset-menu-on-options-change="false"
    :consistent-menu-width="false"
    @focus="handleFocus"
    @scroll="handleScroll"
  />
</template>

<script setup lang="ts">
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { NSelect } from 'naive-ui';
import { ref } from 'vue';

import { usePagination, useFetch } from '@/composables';

const LIST_SIZE = 10;

const isLoading = ref(false);
const categories = ref<SelectMixedOption[]>([]);

const pagination = usePagination({ limit: LIST_SIZE });

const getCategories = () => {
  return useFetch<ICategory[]>('/categories', {
    method: 'GET',
    params: { limit: LIST_SIZE, offset: pagination.state.offset },
  });
};

const buildOptions = (categories: ICategory[]) => {
  return categories.map<SelectMixedOption>(category => {
    return {
      key: category.id,
      value: category.id,
      label: category.name,
    };
  });
};

const handleFocus = async () => {
  // Do nothing in case of categories already loaded
  if (categories.value.length) return;

  isLoading.value = true;

  const data = await getCategories();
  categories.value = buildOptions(data);

  isLoading.value = false;
};

const handleScroll = async (e: Event) => {
  if (isLoading.value) return;

  const currentTarget = e.currentTarget as HTMLElement;

  const isFullyScrolled = (
    currentTarget.scrollTop + currentTarget.offsetHeight >=
    currentTarget.scrollHeight
  );

  if (!isFullyScrolled) {
    return;
  }

  isLoading.value = true;
  pagination.setNextPage();

  const data = await getCategories();
  const categoriesOptions = buildOptions(data);

  categories.value.push(...categoriesOptions);
  isLoading.value = false;
};
</script>