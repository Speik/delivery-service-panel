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
    <n-form-item
      path="name"
      label="Category name"
    >
      <n-input
        v-model:value.trim="createFormValues.name"
        show-count
        autofocus
        placeholder="Enter category name"
        :minlength="CATEGORY_NAME_MIN_LENGTH"
        :style="{ maxWidth: calc`100% s:50% m:50% l:25% xl:25% 2xl:25%` }"
      />
    </n-form-item>

    <n-space :style="{ paddingTop: '1rem' }">
      <n-button
        :focusable="false"
        @click="emit('cancel')"
      >
        Cancel
      </n-button>

      <n-button
        type="primary"
        :focusable="false"
        @click="onCreateCategoryClick"
      >
        Create category
      </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NButton,
  useThemeVars,
  FormInst,
  FormRules,
  FormItemRule,
} from 'naive-ui';

import { reactive, ref, watch } from 'vue';

import { validateForm } from '@/utils';
import { useCategoriesStore } from '@/stores';
import { useResponsive } from '@/composables';

type CreateFormValues = {
  name: string;
}

const CATEGORY_NAME_MIN_LENGTH = 3;

const props = defineProps<{ shown: boolean }>();
const emit = defineEmits(['cancel']);

const themeVars = useThemeVars();
const categoriesStore = useCategoriesStore();
const { calc } = useResponsive();

const createForm = ref<FormInst | null>(null);
const createFormValues = reactive<CreateFormValues>({
  name: '',
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

        if (value.length < CATEGORY_NAME_MIN_LENGTH) {
          return new Error(
            `Name can't be less than ${CATEGORY_NAME_MIN_LENGTH} symbols`
          );
        }

        return true;
      },
    }
  ]
};

const resetCreateForm = () => {
  createFormValues.name = '';
};

const onCreateCategoryClick = async () => {
  if (!createForm.value) return;

  const isFormValid = await validateForm(createForm.value);
  if (!isFormValid) return;

  await categoriesStore.createCategory(createFormValues);
  resetCreateForm();
};

watch(() => props.shown, (isShown) => {
  if (isShown) return;
  resetCreateForm();
});
</script>