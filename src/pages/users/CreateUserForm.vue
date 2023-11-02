<template>
  <n-form
    v-if="shown"
    ref="createForm"
    :model="createFormValues"
    :rules="rules"
    :style="{
      backgroundColor: themeVars.baseColor,
      padding: '1rem',
      marginBottom: '2rem',
      borderRadius: '5px',
    }"
  >
    <n-space>
      <n-form-item
        path="name"
        label="Name"
      >
        <n-input
          v-model:value.trim="createFormValues.name"
          autofocus
          show-count
          placeholder="Enter name"
          :allow-input="restrictInput"
          :minlength="USER_NAME_MIN_LENGTH"
          :maxlength="USER_NAME_MAX_LENGTH"
        />
      </n-form-item>

      <n-form-item
        path="password"
        label="Password"
      >
        <n-input
          v-model:value="createFormValues.password"
          type="password"
          placeholder="Enter password"
          show-password-on="mousedown"
          :allow-input="restrictInput"
          :minlength="PASSWORD_MIN_LENGTH"
        />
      </n-form-item>
    </n-space>

    <n-space :style="{ paddingTop: '1rem' }">
      <n-button
        :focusable="false"
        @click="emit('cancel');"
      >
        Cancel
      </n-button>

      <n-button
        type="primary"
        :focusable="false"
        @click="onCreateUserClick"
      >
        Create user
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import {
  NSpace,
  NForm,
  NFormItem,
  NInput,
  NButton,
  FormInst,
  FormItemRule,
  useThemeVars,
  FormRules,
} from 'naive-ui';

import { reactive, ref, watch } from 'vue';

import { validateForm } from '@/utils';
import { useUsersStore } from '@/stores';

type CreateFormValues = {
  name: string;
  password: string;
}

const props = defineProps<{ shown: boolean }>();
const emit = defineEmits(['cancel']);

const USER_NAME_MIN_LENGTH = 3;
const USER_NAME_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 6;

const themeVars = useThemeVars();
const usersStore = useUsersStore();

const createForm = ref<FormInst | null>(null);
const createFormValues = reactive<CreateFormValues>({
  name: '',
  password: '',
});

const rules: FormRules = {
  name: [
    {
      required: true,
      trigger: ['input', 'blur'],
      validator (_: FormItemRule, value: string) {
        if (!value) {
          return new Error('Name is required');
        }

        if (value.length < USER_NAME_MIN_LENGTH) {
          return new Error(
            `Name can't be less than ${USER_NAME_MIN_LENGTH} symbols`
          );
        }

        return true;
      },
    }
  ],
  password: [
    {
      required: true,
      trigger: ['input', 'blur'],
      validator (_: FormItemRule, value: string) {
        if (!value) {
          return new Error('Password is required');
        }

        if (value.length < PASSWORD_MIN_LENGTH) {
          return new Error(
            `Password can't be less than ${PASSWORD_MIN_LENGTH} symbols`
          );
        }

        return true;
      },
    }
  ],
};

/** @description Restrict spaces on user input */
const restrictInput = (value: string) => {
  const restrictRegex = / /g;
  return !restrictRegex.test(value);
};

const resetCreateForm = () => {
  createFormValues.name = '';
  createFormValues.password = '';
};

const onCreateUserClick = async () => {
  if (!createForm.value) return;

  const isFormValid = await validateForm(createForm.value);
  if (!isFormValid) return;

  await usersStore.createUser(createFormValues);
  resetCreateForm();
};

watch(() => props.shown, (isShown) => {
  if (isShown) return;
  resetCreateForm();
});
</script>