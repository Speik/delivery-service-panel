<template>
  <div :style="{ display: 'flex', alignItems: 'center' }">
    <n-skeleton
      v-if="loading"
      :style="{ marginRight: '1rem' }"
      width="40px"
      height="40px"
      round
    />

    <n-avatar
      v-if="!loading && icon"
      round
      size="large"
      :style="{
        marginRight: '1rem',
        backgroundColor: iconBackground,
        color: iconColor
      }"
    >
      <n-icon
        :component="icon"
        size="22"
      />
    </n-avatar>

    <div>
      <n-skeleton
        v-if="loading"
        :style="{ marginTop: '.75rem' }"
        width="128px"
        height="12px"
        round
      />

      <n-text
        v-if="!loading"
        depth="3"
      >
        {{ title }}
      </n-text>

      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'light',
          fontSize: '1.5rem',
        }"
      >
        <div v-if="loading">
          <n-skeleton
            :style="{ marginTop: '.75rem' }"
            width="64px"
            height="24px"
            round
          />
        </div>

        <div v-if="!loading">
          {{ value }}
        </div>

        <div
          v-if="suffix && !loading"
          :style="{ marginLeft: '.25rem' }"
        >
          {{ suffix }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAvatar, NIcon, NText, NSkeleton } from 'naive-ui';
import { Component } from 'vue';

type FancyStatisticProps = {
  title: string;
  value: string | number;
  loading?: boolean;
  icon?: Component;
  iconBackground?: string;
  iconColor?: string;
  suffix?: string;
}

defineProps<FancyStatisticProps>();
</script>