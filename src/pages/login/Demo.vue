<template>
  <n-space
    v-if="isDemoBannerShown"
    :style="{
      padding: '1.5rem 2rem',
      borderRadius: '5px',
      backgroundColor: themeVars.baseColor,
    }"
  >
    <n-space>
      <n-icon
        :component="WarnIcon"
        :color="themeVars.warningColorHover"
        :size="24"
      />
      <n-text :depth="3">
        This application is running in demo mode
      </n-text>
    </n-space>

    <n-space>
      <n-tag :bordered="false">
        <template #icon>
          <n-icon :component="UserIcon" />
        </template>

        <span :style="{ marginLeft: '.25rem' }">
          {{ demoName }}
        </span>
      </n-tag>

      <n-tag :bordered="false">
        <template #icon>
          <n-icon :component="PasswordIcon" />
        </template>

        <span :style="{ marginLeft: '.25rem' }">
          {{ demoPassword }}
        </span>
      </n-tag>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { NSpace, NText, NIcon, NTag, useThemeVars } from 'naive-ui';
import { ref, computed, onBeforeMount } from 'vue';

import {
  WarningHex as WarnIcon,
  User as UserIcon,
  Password as PasswordIcon,
} from '@vicons/carbon';

const themeVars = useThemeVars();

const demoName = ref('');
const demoPassword = ref('');

const isDemoBannerShown = computed(() => {
  return demoName.value && demoPassword.value;
});

onBeforeMount(() => {
  demoName.value = import.meta.env.VITE_DEMO_ACCOUNT_NAME ?? '';
  demoPassword.value = import.meta.env.VITE_DEMO_ACCOUNT_PASSWORD ?? '';
});
</script>