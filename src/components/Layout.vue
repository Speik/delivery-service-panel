<template>
  <n-layout
    id="layout-container"
    :style="{
      ...(isLoginPage ? loginLayoutMixin : { height: '100vh' }),
    }"
  >
    <n-layout-header
      v-if="!isLoginPage"
      :style="{ flex: '0 1 auto' }"
      bordered
    >
      <AppHeader />
    </n-layout-header>

    <n-layout
      :has-sider="!isLoginPage"
      :style="{ flex: '1 1 auto' }"
    >
      <n-layout-sider
        v-if="!isLoginPage && !checkMobileScreen()"
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed="isSiderCollapsed"
        :collapsed-width="64"
        :width="256"
        :native-scrollbar="false"
        :style="{ height: '100%' }"
        @collapse="setSiderCollapsed(true)"
        @expand="setSiderCollapsed(false)"
      >
        <NavigationMenu :is-collapsed="isSiderCollapsed" />
      </n-layout-sider>

      <n-layout-content @scroll="onContentScroll">
        <!--
          Additional container is used here because native
          scrollbar is being overlapped sometimes by particular
          Naive UI elements such as DataTable, for instance
        -->
        <div
          :style="{
            paddingLeft: calc`1rem s:1rem m:1.5rem l:2rem xl:2rem 2xl:2rem`,
            paddingRight: calc`1rem s:1rem m:1.5rem l:2rem xl:2rem 2xl:2rem`,
          }"
        >
          <router-view />
        </div>
      </n-layout-content>
    </n-layout>

    <n-layout-footer
      v-if="isLoginPage"
      :style="{
        padding: '1rem',
        flex: '0 1 auto',
        textAlign: 'center',
        background: 'transparent',
      }"
    >
      <n-text depth="3">
        &copy; Delivery Service,
        {{ new Date().getFullYear() }}.
      </n-text>
    </n-layout-footer>
  </n-layout>
</template>

<script setup lang="ts">
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NLayoutSider,
  NText,
  useLoadingBar,
} from 'naive-ui';

import { computed, onBeforeMount, ref, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';

import { useContentScroll, usePageLoading, useResponsive } from '@/composables';

import AppHeader from './AppHeader.vue';
import NavigationMenu from './NavigationMenu.vue';

const router = useRouter();
const loadingBarController = useLoadingBar();
const { pageLoading } = usePageLoading();
const { setFullyScrolled } = useContentScroll();
const { calc, checkMobileScreen } = useResponsive();

const isSiderCollapsed = ref(false);
const isLoginPage = computed(() => {
  return router.currentRoute.value.path === '/login';
});

const loginLayoutMixin = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '100vh',
};

const setSiderCollapsed = (state: boolean) => {
  isSiderCollapsed.value = state;

  localStorage.setItem(
    'isSiderCollapsed',
    JSON.stringify({ state })
  );
};

const onContentScroll = (event: Event) => {
  const CONTENT_SCROLL_RATIO = 192;

  const { clientHeight, scrollTop, scrollHeight } = (
    event.target as HTMLElement
  );

  const isFullyScrolled = (
    (scrollTop + clientHeight) >=
    (scrollHeight - CONTENT_SCROLL_RATIO)
  );

  setFullyScrolled(isFullyScrolled);
};

onBeforeMount(() => {
  const siderStorageState = (
    localStorage.getItem('isSiderCollapsed')
  );

  const { state } = siderStorageState
    ? JSON.parse(siderStorageState) as { state: boolean }
    : { state: false };

  isSiderCollapsed.value = state;
});

watch(pageLoading, ({ state: isPageLoading, hasError }) => {
  if (isPageLoading) loadingBarController.start();
  if (hasError) loadingBarController.error();
  if (!isPageLoading) loadingBarController.finish();
});
</script>

<style>
#layout-container > .n-layout-scroll-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>