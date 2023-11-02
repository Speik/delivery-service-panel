import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useFetch } from '@/composables';

type CreateCategoryPayload = Omit<ICategory, 'id'>;

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<ICategory[]>([]);

  const fetchData = async (offset: number, limit: number) => {
    const categoriesData = await useFetch<ICategory[]>('/categories', {
      method: 'GET',
      params: { limit, offset },
    });

    categories.value = offset > 0
      ? categories.value.concat(categoriesData)
      : categoriesData;
  };

  const searchCategories = async (term: string) => {
    categories.value = await useFetch<ICategory[]>('/categories/search', {
      method: 'GET',
      params: { term },
    });
  };

  const createCategory = async (category: CreateCategoryPayload) => {
    const createdCategory = await useFetch<ICategory>('/categories', {
      method: 'POST',
      data: category,
    });

    categories.value.unshift(createdCategory);
  };

  const deleteCategory = async (targetCategory: ICategory) => {
    const id = targetCategory.id;

    await useFetch(`/categories/${id}`, {
      method: 'DELETE',
    });

    const targetIndex = categories.value.findIndex(category => {
      return category.id === id;
    });

    if (targetIndex < 0) return;

    categories.value.splice(targetIndex, 1);
  };

  return {
    categories,
    fetchData,
    searchCategories,
    createCategory,
    deleteCategory
  };
});