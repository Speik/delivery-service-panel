<template>
  <n-card
    hoverable
    size="small"
    :title="data.name"
    :builtin-theme-overrides="{
      titleFontSizeSmall: '1rem',
      titleFontWeight: '300',
    }"
  >
    <template #header-extra>
      <n-button
        circle
        secondary
        size="small"
        type="error"
        :focusable="false"
        @click="onDeleteClick(data)"
      >
        <template #icon>
          <n-icon
            size="14"
            :component="TrashIcon"
          />
        </template>
      </n-button>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon, NButton, useDialog } from 'naive-ui';
import { TrashCan as TrashIcon } from '@vicons/carbon';

import { useCategoriesStore } from '@/stores';
import { renderIcon } from '@/utils';

defineProps<{ data: ICategory }>();

const dialogController = useDialog();
const categoriesStore = useCategoriesStore();

const onDeleteClick = (category: ICategory) => {
  dialogController.error({
    title: `Delete category '${category.name}'`,
    content: `Are you sure you want to delete category '${category.name}'?`,
    positiveText: 'Delete',
    autoFocus: false,
    positiveButtonProps: {
      secondary: true,
      size: 'medium',
    },
    icon: renderIcon(TrashIcon),
    onPositiveClick: async () => {
      await categoriesStore.deleteCategory(category);
    },
  });
};
</script>