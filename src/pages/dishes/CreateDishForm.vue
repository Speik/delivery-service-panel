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
          :style="{ minWidth: '256px' }"
          placeholder="Enter name"
        />
      </n-form-item>

      <n-form-item
        path="price"
        label="Price"
      >
        <n-input-number
          v-model:value="createFormValues.price"
          placeholder="Enter price"
          :style="{ minWidth: '256px' }"
          :precision="2"
          :step="0.25"
          :min="0.01"
        />
      </n-form-item>

      <n-form-item
        path="categoryId"
        label="Category"
      >
        <CategorySelect
          v-model:value="createFormValues.categoryId"
          clearable
          :style="{ minWidth: '256px' }"
        />
      </n-form-item>
    </n-space>

    <n-space>
      <n-form-item
        path="description"
        label="Description"
      >
        <n-input
          v-model:value.trim="createFormValues.description"
          clearable
          show-count
          type="textarea"
          placeholder="Description"
          :autosize="{ minRows: 3 }"
          :style="{ minWidth: calc`256px s:256px m:524px l:524px xl:524px 2xl:524px` }"
        />
      </n-form-item>

      <n-form-item
        path="image"
        label="Image"
      >
        <n-upload
          v-model:file-list="createFormValues.image"
          :max="1"
          :default-upload="false"
          accept=".jpg,.jpeg,.png"
        >
          <n-button>Select File</n-button>
        </n-upload>
      </n-form-item>
    </n-space>

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
        @click="onCreateDishClick"
      >
        Create dish
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
  NInputNumber,
  NUpload,
  NButton,
  FormInst,
  FormItemRule,
  useThemeVars,
  FormRules,
} from 'naive-ui';

import { FileInfo } from 'naive-ui/es/upload/src/interface';
import { reactive, ref, watch } from 'vue';

import { validateForm } from '@/utils';
import { useDishesStore } from '@/stores';
import { useResponsive } from '@/composables';

import CategorySelect from './CategorySelect.vue';

type CreateFormValues = {
  name: string;
  price: number;
  categoryId: string | null;
  description: string;
  image: FileInfo[];
}

const props = defineProps<{ shown: boolean }>();
const emit = defineEmits(['cancel']);

const themeVars = useThemeVars();
const dishesStore = useDishesStore();
const { calc } = useResponsive();

const createForm = ref<FormInst | null>(null);
const createFormValues = reactive<CreateFormValues>({
  name: '',
  price: 1,
  categoryId: null,
  description: '',
  image: [],
});

const rules: FormRules = {
  name: [
    {
      required: true,
      trigger: ['input', 'blur'],
      validator (_: FormItemRule, value: string) {
        return Boolean(value) || new Error('Name is required');
      },
    }
  ],
  price: [
    {
      required: true,
      trigger: ['input', 'blur'],
      validator (_: FormItemRule, value: string) {
        return Boolean(value) || new Error('Price is required');
      },
    }
  ],
};

const resetCreateForm = () => {
  createFormValues.name = '';
  createFormValues.categoryId = null;
  createFormValues.price = 1;
  createFormValues.image = [];
  createFormValues.description = '';
};

const onCreateDishClick = async () => {
  if (!createForm.value) return;

  const isFormValid = await validateForm(createForm.value);
  if (!isFormValid) return;

  const [fileInfo] = createFormValues.image;
  const image = fileInfo?.file;

  await dishesStore.createDish({
    name: createFormValues.name,
    price: createFormValues.price,
    categoryId: createFormValues.categoryId,
    description: createFormValues.description,
    image,
  });

  resetCreateForm();
};

watch(() => props.shown, (isShown) => {
  if (isShown) return;
  resetCreateForm();
});
</script>