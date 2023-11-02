<template>
  <n-card
    embedded
    title="Dishes"
  >
    <template #header-extra>
      <n-h4 :style="{ margin: 0 }">
        {{ formatPrice(data.price) }}
      </n-h4>
    </template>

    <n-list :style="{ backgroundColor: 'transparent' }">
      <n-list-item
        v-for="[id, meta] in Object.entries(formattedDishes)"
        :key="id"
      >
        <template #prefix>
          <n-avatar :src="resolveResourceUrl('avatar', meta.data.image)" />
        </template>

        <div
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }"
        >
          <n-space :size="8">
            <n-text strong>
              {{ formatDishCount(meta.count) }}
            </n-text>

            <n-text strong>
              {{ meta.data.name }}
            </n-text>
          </n-space>

          <n-text
            depth="3"
            :style="{ flex: '0 0 auto', marginLeft: '.5rem' }"
          >
            {{ formatPrice(meta.totalPrice) }}
          </n-text>
        </div>
      </n-list-item>
    </n-list>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NSpace,
  NList,
  NListItem,
  NAvatar,
  NText,
  NH4,
} from 'naive-ui';

import { computed } from 'vue';
import { formatPrice, resolveResourceUrl } from '@/utils';

type DishesMeta = {
  [key: string]: {
    count: number;
    totalPrice: number;
    data: IDish;
  }
}

const props = defineProps<{ data: IOrder }>();

const formatDishCount = (value: number) => {
  return `x${value}`;
};

const formattedDishes = computed(() => {
  return props.data.dishes.reduce<DishesMeta>((result, dish) => {
    if (!Reflect.has(result, dish.id)) {
      result[dish.id] = {
        count: 0,
        totalPrice: 0,
        data: dish,
      };
    }

    result[dish.id].count += 1;
    result[dish.id].totalPrice += Number(dish.price);

    return result;
  }, {});
});
</script>