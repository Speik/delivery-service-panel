<template>
  <span>{{ formattedValue }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useReactiveDate } from '@/composables';

type SmartDateProps = {
  value: Date;
  short?: boolean;
}

const props = defineProps<SmartDateProps>();
const { reactiveDate } = useReactiveDate();

const formattedValue = computed(() => {
  const rawValue = new Date(props.value);

  const secondsSinceNow = Math.floor(
    (reactiveDate.value.getTime() - rawValue.getTime()) / 1000
  );

  // Show this when less than 1 minute was passed
  if (secondsSinceNow <= 60) {
    return props.short ? 'Now' : 'Just now';
  }

  // Literal function to get time units in suitable format
  const cut = ([unit]: TemplateStringsArray) => {
    if (!props.short) return unit;
    // In case of `minute` return 'min' instead of 'm'
    if (unit === 'minute') return unit.slice(0, 3);
    return unit.slice(0, 1);
  };

  const labelsMap = new Map<[string, number], boolean>([
    [[cut`year`, 31536000], secondsSinceNow / 31536000 > 1],
    [[cut`month`, 2592000], secondsSinceNow / 2592000 > 1],
    [[cut`day`, 86400], secondsSinceNow / 86400 > 1],
    [[cut`hour`, 3600], secondsSinceNow / 3600 > 1],
    [[cut`minute`, 60], secondsSinceNow / 60 > 1],
  ]);

  for (const [[label, divider], isMatchUnit] of labelsMap.entries()) {
    if (!isMatchUnit) continue;

    const value = Math.floor(secondsSinceNow / divider);
    const formattedLabel = value > 1 ? `${label}s` : label;

    return `${value} ${formattedLabel} ago`;
  }

  // Just fallback
  return props.value.toLocaleString();
});
</script>