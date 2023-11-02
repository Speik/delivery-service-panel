<template>
  <n-layout>
    <n-layout-content
      id="layout-container"
      :style="{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100vh',
        zIndex: 999,
      }"
    >
      <div
        class="animated"
        :class="{ shown: errorStatusShown }"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem',
        }"
      >
        <n-text
          type="error"
          :style="{
            textAlign: 'center',
            fontSize: '6rem',
            fontWeight: 'bold',
            lineHeight: 1,
          }"
        >
          404
        </n-text>
      </div>

      <div
        class="animated"
        :class="{ shown: errorContentShown }"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }"
      >
        <div :style="{ textAlign: 'center' }">
          <n-h1
            :style="{
              color: themeVars.textColor2,
              textAlign: 'center',
              margin: 0,
            }"
          >
            Page not found
          </n-h1>
          <n-text
            :style="{ textAlign: 'center' }"
          >
            <n-text code>
              Could not find route
              {{ router.currentRoute.value.path }}
            </n-text>
          </n-text>
        </div>
      </div>

      <div
        class="animated"
        :class="{ shown: returnButtonShown }"
        :style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1.5rem',
        }"
      >
        <n-button
          tertiary
          @click="router.push('/dashboard')"
        >
          <template #icon>
            <n-icon :component="ReturnIcon" />
          </template>
          Go back
        </n-button>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import {
  NLayout,
  NLayoutContent,
  NH1,
  NText,
  NButton,
  NIcon,
  useThemeVars,
} from 'naive-ui';

import { Dashboard as ReturnIcon } from '@vicons/carbon';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

import { useSleep } from '@/composables';

const themeVars = useThemeVars();
const router = useRouter();
const { sleep } = useSleep();

const errorStatusShown = ref(false);
const errorContentShown = ref(false);
const returnButtonShown = ref(false);

onMounted(async () => {
  await sleep(300);

  errorStatusShown.value = true;
  await sleep(150);

  errorContentShown.value = true;
  await sleep(150);

  returnButtonShown.value = true;
});
</script>

<style scoped>
#layout-container > .n-layout-scroll-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.animated {
  opacity: 0;
  translate: 0 -50%;
  scale: 1.2;
  transition: .3s ease;
}

.shown {
  opacity: 1;
  translate: 0 0;
  scale: 1;
}
</style>