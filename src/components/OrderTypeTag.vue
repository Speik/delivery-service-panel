<template>
  <n-tag
    v-bind="$attrs"
    :bordered="false"
  >
    <template #icon>
      <n-icon
        :size="18"
        :component="displayOptions.icon"
      />
    </template>
    {{ displayOptions.label }}
  </n-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NIcon, NTag } from 'naive-ui';

import {
  Building as TakeawayIcon,
  DeliveryParcel as DeliveryIcon,
  Query as UnknownIcon,
} from '@vicons/carbon';

import { OrderType } from '@/declarations';

const props = defineProps<{ value: OrderType }>();

const displayOptions = computed(() => {
  if (props.value === OrderType.TAKEAWAY) {
    return {
      icon: TakeawayIcon,
      label: 'Takeaway',
    };
  }

  if (props.value === OrderType.DELIVERY) {
    return {
      icon: DeliveryIcon,
      label: 'Delivery',
    };
  }

  return {
    icon: UnknownIcon,
    label: 'Unknown',
  };
});
</script>