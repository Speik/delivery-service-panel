<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-tag
        :type="(tagMeta.severity as TagType)"
        :bordered="false"
        strong
      >
        <template #icon>
          <n-icon :component="tagMeta.icon" />
        </template>

        {{ tagMeta.label }}
      </n-tag>
    </template>

    {{ tagMeta.tooltipText }}
  </n-tooltip>
</template>

<script setup lang="ts">
import {
  NTag,
  NTooltip,
  NIcon,
} from 'naive-ui';

import {
  AccessibilityColor as VisibleIcon,
  WarningAlt as HiddenIcon,
} from '@vicons/carbon';

import { computed } from 'vue';

type TagType = 'warning' | 'success';
const props = defineProps<{ visible: boolean }>();

const tagMeta = computed(() => {
  if (!props.visible) {
    return {
      icon: HiddenIcon,
      severity: 'warning',
      label: 'Hidden',
      tooltipText: (
        'This dish will not appear in your catalog'
      ),
    };
  }

  return {
    icon: VisibleIcon,
    severity: 'success',
    label: 'Visible',
    tooltipText: (
      'Users can see and interact with this dish'
    ),
  };
});
</script>