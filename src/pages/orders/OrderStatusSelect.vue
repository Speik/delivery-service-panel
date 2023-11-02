<template>
  <n-select
    v-if="editable"
    v-model:value="currentStatus"
    :options="selectOptions"
    :consistent-menu-width="false"
    :disabled="!editable"
    :render-label="renderOptionLabel"
  />

  <n-tag
    v-else
    v-bind="$attrs"
    :bordered="false"
    :color="{
      color: toRgba(currentStatusMeta.color, 0.15),
      textColor: currentStatusMeta.color,
    }"
  >
    {{ currentStatusMeta.label }}
  </n-tag>
</template>

<script setup lang="ts">
import { NIcon, NSelect, NTag, useThemeVars } from 'naive-ui';
import { SelectMixedOption, SelectOption } from 'naive-ui/es/select/src/interface';

import { computed, onBeforeMount, ref, h, watch } from 'vue';
import { DotMark as DotIcon } from '@vicons/carbon';

import { useColorConverter } from '@/composables';
import { OrderStatus, OrderType } from '@/declarations';

type StatusMeta = {
  label: string;
  color: string;
  hidden?: boolean;
}

type OrderStatusProps = {
  value: OrderStatus;
  type: OrderType;
  editable?: boolean;
}

const emit = defineEmits(['changeStatus']);
const props = defineProps<OrderStatusProps>();

const { toRgba } = useColorConverter();
const themeVars = useThemeVars();

const statuses = new Map<OrderStatus, StatusMeta>([
  [OrderStatus.CREATED, {
    label: 'Created',
    color: themeVars.value.textColor3,
  }],
  [OrderStatus.CONFIRMED, {
    label: 'Confirmed',
    color: themeVars.value.infoColor,
  }],
  [OrderStatus.COOKING, {
    label: 'Cooking',
    color: themeVars.value.successColorSuppl,
  }],
  [OrderStatus.DELIVERING, {
    label: 'Delivering',
    color: themeVars.value.successColorPressed,
    hidden: props.type === OrderType.TAKEAWAY,
  }],
  [OrderStatus.WAITING, {
    label: 'Waiting',
    color: themeVars.value.successColorPressed,
    hidden: props.type === OrderType.DELIVERY,
  }],
  [OrderStatus.COMPLETED, {
    label: 'Completed',
    color: themeVars.value.primaryColor,
  }],
  [OrderStatus.CANCELLED, {
    label: 'Cancelled',
    color: themeVars.value.errorColor,
  }],
]);

const currentStatus = ref<OrderStatus>(OrderStatus.CREATED);

const currentStatusMeta = computed(() => {
  const meta = statuses.get(currentStatus.value);

  if (!meta) {
    return {
      label: 'Unknown',
      color: themeVars.value.textColor1,
    };
  }

  return meta;
});

const selectOptions = computed(() => {
  const result: SelectMixedOption[] = [];

  statuses.forEach((meta, key) => {
    if (meta.hidden) return;

    result.push({
      value: key,
      label: meta.label,
      meta,
    });
  });

  return result;
});

const renderOptionLabel = (option: SelectOption) => {
  const extendedOption = option as SelectOption & { meta: StatusMeta };

  const iconProps = {
    style: { verticalAlign: 'middle' },
    color: extendedOption.meta.color,
    size: 32,
  };

  return [
    h(NIcon, iconProps, { default: () => h(DotIcon) }),
    option.label as string,
  ];
};

watch(currentStatus, (status) => {
  emit('changeStatus', status);
});

onBeforeMount(() => {
  currentStatus.value = props.value;
});
</script>