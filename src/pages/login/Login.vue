<template>
  <div :style="{ display: 'flex', justifyContent: 'center' }">
    <n-space
      vertical
      :style="{ width: calc`100% s:75% m:55% l:45% xl:35% 2xl:35%` }"
    >
      <div
        :style="{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '1rem',
        }"
      >
        <n-icon
          :size="64"
          :component="TruckIcon"
          :color="themeVars.primaryColorHover"
          depth="2"
        />
      </div>

      <n-card
        size="large"
        title="Login to your account"
        :style="{ borderRadius: '5px' }"
        :segmented="{ content: true }"
      >
        <n-form
          ref="loginForm"
          :model="formValues"
          :rules="rules"
        >
          <n-form-item
            path="name"
            label="Name"
          >
            <n-input
              v-model:value="formValues.name"
              placeholder="Enter name"
              :allow-input="restrictInput"
            />
          </n-form-item>

          <n-form-item
            path="password"
            label="Password"
          >
            <n-input
              v-model:value="formValues.password"
              type="password"
              placeholder="Enter password"
            />
          </n-form-item>

          <n-space justify="space-between">
            <n-checkbox v-model:checked="formValues.isPersistent">
              Remember me
            </n-checkbox>

            <n-button
              type="primary"
              :loading="isLoading"
              @click="loginUser"
            >
              Log In
            </n-button>
          </n-space>
        </n-form>
      </n-card>

      <Demo />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NIcon,
  NForm,
  NFormItem,
  NInput,
  NCheckbox,
  NButton,
  NSpace,
  FormInst,
  FormRules,
  FormItemRule,
  useThemeVars,
} from 'naive-ui';

import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Delivery as TruckIcon } from '@vicons/carbon';

import { validateForm } from '@/utils';
import { useFetch, useAuth, useResponsive } from '@/composables';

import Demo from './Demo.vue';

type LoginFormValues = {
  name: string;
  password: string;
  isPersistent: boolean;
}

const rules: FormRules = {
  name: [
    {
      required: true,
      validator (_: FormItemRule, value: string) {
        return Boolean(value) || new Error('Name is required');
      },
      trigger: ['input', 'blur'],
    }
  ],
  password: [
    {
      required: true,
      validator (_: FormItemRule, value: string) {
        return Boolean(value) || new Error('Password is required');
      },
      trigger: ['input', 'blur'],
    }
  ],
};

const loginForm = ref<FormInst | null>(null);
const isLoading = ref(false);

const formValues = reactive<LoginFormValues>({
  name: '',
  password: '',
  isPersistent: false,
});

const themeVars = useThemeVars();
const router = useRouter();
const { setAuthorizedUser } = useAuth();
const { calc } = useResponsive();

/** @description Restrict spaces on user input */
const restrictInput = (value: string) => {
  const restrictRegex = / /g;
  return !restrictRegex.test(value);
};

const loginUser = async () => {
  if (!loginForm.value) return;

  const isFormValid = await validateForm(loginForm.value);
  if (!isFormValid) return;

  isLoading.value = true;

  try {
    const user = await useFetch<IAuthorizedUser>('/managers/login', {
      method: 'POST',
      data: formValues,
    });

    setAuthorizedUser(user);
    await router.replace('/dashboard');
  } finally {
    isLoading.value = false;
  }
};
</script>