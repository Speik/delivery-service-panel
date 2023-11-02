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
  Money as CashIcon,
  Purchase as BankCardIcon,
  Query as UnknownIcon,
} from '@vicons/carbon';

import { PaymentMethod } from '@/declarations';

const props = defineProps<{ value: PaymentMethod }>();

const displayOptions = computed(() => {
  if (props.value === PaymentMethod.CASH) {
    return {
      icon: CashIcon,
      label: 'Cash',
    };
  }

  if (props.value === PaymentMethod.BANK_CARD) {
    return {
      icon: BankCardIcon,
      label: 'Bank card',
    };
  }

  return {
    icon: UnknownIcon,
    label: 'Unknown',
  };
});
</script>