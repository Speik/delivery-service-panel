<template>
  <n-space
    :size="1"
    :style="{
      display: 'flex',
      alignItems: 'center',
    }"
  >
    <n-icon
      :component="IdIcon"
      :size="16"
      :style="{
        display: 'flex',
        alignItems: 'center',
      }"
    />

    {{ formatOrderNumber(value) }}
  </n-space>
</template>

<script setup lang="ts">
import { Hashtag as IdIcon } from '@vicons/carbon';
import { NIcon, NSpace } from 'naive-ui';

defineProps<{ value: number }>();

const formatOrderNumber = (value: number) => {
  return String(value).padStart(4, '0');
};
</script>