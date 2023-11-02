<template>
  <n-drawer
    :show="shown"
    :width="calc`100% s:100% m:384px l:384px xl:384px 2xl:384px`"
    @mask-click="emit('cancel')"
    @update-show="emit('cancel')"
  >
    <n-drawer-content
      :native-scrollbar="false"
      closable
    >
      <template #header>
        Editing dish
      </template>

      <n-image
        preview-disabled
        :src="imagePreviewSrc"
        alt="Preview image"
        :img-props="{ style: { width: '100%' } }"
      />

      <n-form
        ref="editForm"
        :model="editFormValues"
        :rules="rules"
        :style="{ paddingTop: '1rem' }"
      >
        <n-form-item
          path="image"
          label="Image"
        >
          <n-upload
            v-model:file-list="editFormValues.image"
            :max="1"
            :default-upload="false"
            accept=".jpg,.jpeg,.png"
            @update-file-list="onImageChange"
          >
            <n-button>Select File</n-button>
          </n-upload>
        </n-form-item>

        <n-form-item
          path="name"
          label="Name"
        >
          <n-input
            v-model:value.trim="editFormValues.name"
            autofocus
            show-count
            :style="{ width: '100%' }"
            placeholder="Enter name"
          />
        </n-form-item>

        <n-form-item
          path="price"
          label="Price"
        >
          <n-input-number
            v-model:value="editFormValues.price"
            placeholder="Enter price"
            :style="{ width: '100%' }"
            :precision="2"
          />
        </n-form-item>

        <n-form-item
          path="categoryId"
          label="Category"
        >
          <CategorySelect
            v-model:value="editFormValues.categoryId"
            clearable
            :style="{ width: '100%' }"
            :fallback-option="() => {
              return {
                value: data.category?.id ?? null,
                label: data.category?.name
              };
            }"
          />
        </n-form-item>

        <n-form-item
          path="description"
          label="Description"
        >
          <n-input
            v-model:value.trim="editFormValues.description"
            clearable
            show-count
            type="textarea"
            placeholder="Description"
            :autosize="{ minRows: 3 }"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space :style="{ width: '100%' }">
          <n-button
            :focusable="false"
            @click="emit('cancel');"
          >
            Cancel
          </n-button>

          <n-button
            type="primary"
            :focusable="false"
            :loading="isLoading"
            @click="onSaveDishClick(data.id)"
          >
            Save
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NDrawer,
  NDrawerContent,
  NSpace,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NUpload,
  NButton,
  NImage,
  FormInst,
  FormItemRule,
  FormRules,
} from 'naive-ui';

import { FileInfo } from 'naive-ui/es/upload/src/interface';
import { reactive, ref, watch } from 'vue';

import { validateForm, resolveResourceUrl } from '@/utils';
import { useDishesStore } from '@/stores';
import { useResponsive } from '@/composables';

import CategorySelect from './CategorySelect.vue';

type EditFormValues = {
  name: string;
  price: number;
  categoryId: string | null;
  description: string;
  image: FileInfo[];
}

const props = defineProps<{ shown: boolean, data: IDish }>();
const emit = defineEmits(['cancel', 'save']);

const dishesStore = useDishesStore();
const { calc } = useResponsive();

const isLoading = ref(false);
const imagePreviewSrc = ref('');

const editForm = ref<FormInst | null>(null);
const editFormValues = reactive<EditFormValues>({
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

const onSaveDishClick = async (id: string) => {
  if (!editForm.value) return;

  const isFormValid = await validateForm(editForm.value);
  if (!isFormValid) return;

  isLoading.value = true;

  const [fileInfo] = editFormValues.image;
  const image = fileInfo?.file;

  try {
    await dishesStore.editDish(id, {
      name: editFormValues.name,
      price: editFormValues.price,
      categoryId: editFormValues.categoryId,
      description: editFormValues.description,
      image,
    });

    emit('save');
  } finally {
    isLoading.value = false;
  }
};

const onImageChange = () => {
  const [fileInfo] = editFormValues.image;
  const image = fileInfo?.file;

  if (!image) return;
  imagePreviewSrc.value = URL.createObjectURL(image);
};

watch(() => props.shown, isShown => {
  // Update default values only when drawer is shown
  if (!isShown) return;

  editFormValues.image = [];
  editFormValues.name = props.data.name;
  editFormValues.price = Number(props.data.price);
  editFormValues.categoryId = props.data.category?.id ?? null;
  editFormValues.description = props.data.description ?? '';

  imagePreviewSrc.value = resolveResourceUrl('image', props.data.image);
});
</script>