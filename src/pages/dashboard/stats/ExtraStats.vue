<template>
  <n-grid
    cols="1"
    rows="3"
    y-gap="16"
    :style="{ height: '100%' }"
  >
    <n-gi :style="sectionStyle">
      <FavoriteDish />
    </n-gi>

    <n-gi :style="sectionStyle">
      <PlatinumMember />
    </n-gi>

    <n-gi :style="sectionStyle">
      <MostCostlyOrder />
    </n-gi>
  </n-grid>
</template>

<script setup lang=ts>
import { NGrid, NGi } from 'naive-ui';
import { CSSProperties } from 'vue';

import FavoriteDish from '../entities/FavoriteDish.vue';
import PlatinumMember from '../entities/PlatinumMember.vue';
import MostCostlyOrder from '../entities/MostCostlyOrder.vue';

defineProps<{ sectionStyle: CSSProperties }>();
</script>