<template>
  <n-config-provider
    abstract
    :theme-overrides="lightThemeOverrides"
  >
    <n-loading-bar-provider
      :loading-bar-style="{
        loading: loadingBarCss,
        error: loadingBarCss,
      }"
      :container-style="{
        top: '100%',
        marginTop: '-.5rem',
      }"
    >
      <n-message-provider placement="top-right">
        <n-dialog-provider>
          <ErrorBoundary>
            <div id="layout">
              <n-theme-editor v-if="isDevelopment">
                <Layout />
              </n-theme-editor>

              <Layout v-else />
            </div>
          </ErrorBoundary>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NThemeEditor,
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
} from 'naive-ui';

import { CSSProperties, inject, onBeforeMount } from 'vue';

import { lightThemeOverrides } from '@/themes';
import { useResponsive } from '@/composables';

import Layout from '@/components/Layout.vue';
import ErrorBoundary from '@/components/ErrorBoundary.vue';

const isDevelopment = inject('isDevelopment');
const { defineCurrentScreenSize } = useResponsive();

const loadingBarCss: CSSProperties = {
  height: '.5rem',
  borderRadius: '1.25rem',
};

onBeforeMount(defineCurrentScreenSize);
</script>
