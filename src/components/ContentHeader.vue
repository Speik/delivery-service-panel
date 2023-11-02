<template>
  <n-page-header
    id="page-header"
    :subtitle="subtitle"
    :style="{
      backgroundColor: themeVars.baseColor,
      padding: '1rem',
      margin: '2rem 0',
      borderRadius: '5px',
    }"
  >
    <template
      v-if="routeMeta.icon"
      #avatar
    >
      <n-icon
        :component="routeMeta.icon"
        :color="themeVars.primaryColorHover"
        size="28"
      />
    </template>

    <template #title>
      {{ routeMeta.title ?? '<unknown>' }}
    </template>

    <template #extra>
      <n-space>
        <n-input
          v-if="!hideSearch"
          ref="searchInput"
          v-model:value="searchModel"
          clearable
          placeholder="Search"
          :minlength="MIN_SEARCH_TERM_LENGTH"
          @change="onSearchChange"
        >
          <template #suffix>
            <n-button text>
              <n-icon
                :component="SearchIcon"
                :color="themeVars.primaryColorHover"
              />
            </n-button>
          </template>
        </n-input>

        <n-button
          secondary
          type="primary"
          :focusable="false"
          @click="onRefreshClick"
        >
          Refresh
        </n-button>

        <n-button
          v-if="showCreateButton"
          type="primary"
          :focusable="false"
          @click="emit('create')"
        >
          {{ createButtonLabel ?? 'Create' }}
        </n-button>
      </n-space>
    </template>
  </n-page-header>
</template>

<script setup lang="ts">
import {
  NPageHeader,
  NSpace,
  NButton,
  NInput,
  NIcon,
  useThemeVars,
  InputInst,
} from 'naive-ui';

import { Search as SearchIcon } from '@vicons/carbon';

import { useRouter } from 'vue-router';
import { ref } from 'vue';

type ContentHeaderProps = {
  subtitle: string;
  hideSearch?: boolean;
  showCreateButton?: boolean;
  createButtonLabel?: string;
}

const MIN_SEARCH_TERM_LENGTH = 3;

defineProps<ContentHeaderProps>();
const emit = defineEmits([
  'refresh', 'create', 'search', 'searchClear'
]);

const themeVars = useThemeVars();
const router = useRouter();

/**
 * `searchModel` used as v-model source only to reset
 * search input value since different approach doesn't work
 */
const searchModel = ref('');
const searchInput = ref<InputInst | null>(null);

const routeMeta = router.currentRoute.value.meta;

const onRefreshClick = () => {
  searchInput.value?.blur();
  searchModel.value = '';

  emit('refresh');
};

/**
 * v-model is not used here instead since n-input
 * doesn't work correctly with v-model.lazy modifier
 */
const onSearchChange = (term: string) => {
  const trimmedTerm = term.trim();

  if (!trimmedTerm) emit('searchClear');
  if (trimmedTerm.length < MIN_SEARCH_TERM_LENGTH) return;

  emit('search', trimmedTerm);
};
</script>

<style>
@media screen and (max-width: 992px) {
  #page-header .n-page-header {
    display: block;
  }

  #page-header .n-page-header__main {
    margin-bottom: 1rem;
  }
}

@media screen and (max-width: 576px) {
  #page-header .n-page-header__main {
    flex-wrap: wrap;
  }

  #page-header .n-page-header__subtitle {
    flex: 1 1 100%;
    width: 100%;
    margin-top: .6rem;
  }
}
</style>