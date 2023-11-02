<template>
  <div :style="{ width: '100%', overflowX: currentOverflow }">
    <div :style="{ overflow: 'none', minWidth: contentWidth }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, computed } from 'vue';
import { useResponsive } from '@/composables';

type HorizontalScrollerProps = {
  breakpoints: ScreenSize[],
  activeWidth: CSSProperties['width'],
}

const props = defineProps<HorizontalScrollerProps>();
const { screenSize } = useResponsive();

const isEnabled = computed(() => {
  return props.breakpoints.includes(screenSize.value);
});

const currentOverflow = computed(() => {
  return isEnabled.value ? 'scroll' : 'unset';
});

const contentWidth = computed(() => {
  return isEnabled.value ? props.activeWidth : 'auto';
});
</script>