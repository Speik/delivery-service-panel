<template>
  <ContentHeader
    show-create-button
    create-button-label="New user"
    subtitle="Lead your managers"
    @search="onSearchTrigger"
    @search-clear="onSearchCancel"
    @refresh="onPageRefreshClick"
    @create="isCreateFormShown = true"
  />

  <CreateUserForm
    :shown="isCreateFormShown"
    @cancel="isCreateFormShown = false"
  />

  <n-empty
    v-if="!usersStore.users.length"
    description="No users found"
    size="huge"
    :style="{ flex: '1 1 auto' }"
  />

  <n-grid
    v-else
    cols="1 s:2 m:3 l:3 xl:3 2xl:3"
    x-gap="16"
    y-gap="16"
    :style="{ paddingBottom: '2rem' }"
    responsive="screen"
  >
    <n-gi
      v-for="user in usersStore.users"
      :key="user.id"
    >
      <UserEntity :data="user" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi, NEmpty } from 'naive-ui';
import { onMounted, ref, watch } from 'vue';

import {
  usePageLoading,
  useContentScroll,
  usePagination,
} from '@/composables';

import { useUsersStore } from '@/stores';

import ContentHeader from '@/components/ContentHeader.vue';
import CreateUserForm from './CreateUserForm.vue';
import UserEntity from './UserEntity.vue';

const PAGE_SIZE = 24;

const isSearching = ref(false);
const isCreateFormShown = ref(false);

const pagination = usePagination({ limit: PAGE_SIZE });
const usersStore = useUsersStore();

const { isFullyScrolled } = useContentScroll();
const { setLoading } = usePageLoading();

const fetchData = async () => {
  setLoading(true);
  await usersStore.fetchData(pagination.state.offset, PAGE_SIZE);
  setLoading(false);
};

const onPageRefreshClick = async () => {
  isSearching.value = false;

  pagination.resetPage();
  await fetchData();
};

const onSearchTrigger = async (term: string) => {
  isSearching.value = true;

  setLoading(true);
  await usersStore.searchUsers(term);
  setLoading(false);
};

const onSearchCancel = async () => {
  isSearching.value = false;

  pagination.resetPage();
  await fetchData();
};

watch(isFullyScrolled, async isBottomReached => {
  if (isSearching.value) return;
  if (!isBottomReached) return;

  pagination.setNextPage();
  await fetchData();
});

onMounted(async () => {
  await fetchData();
});
</script>