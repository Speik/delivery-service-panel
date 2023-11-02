import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useFetch, useSleep } from '@/composables';

type CreateDishPayload = {
  name: string;
  price: number;
  description: string;
  categoryId: string | null;
  image?: File | null;
};

type EditDishPayload = CreateDishPayload;

export const useDishesStore = defineStore('dishes', () => {
  const dishes = ref<IDish[]>([]);
  const { sleep } = useSleep();

  const fetchData = async (offset: number, limit: number) => {
    const dishesData = await useFetch<IDish[]>('/dishes', {
      method: 'GET',
      params: { limit, offset },
    });

    dishes.value = offset > 0
      ? dishes.value.concat(dishesData)
      : dishesData;
  };

  const searchDishes = async (term: string) => {
    dishes.value = await useFetch('/dishes/search', {
      method: 'GET',
      params: { term },
    });
  };

  const createDish = async (dish: CreateDishPayload) => {
    const newDish = new FormData();

    newDish.append('name', dish.name);
    newDish.append('price', String(dish.price));

    if (dish.description) newDish.append('description', dish.description);
    if (dish.categoryId) newDish.append('categoryId', dish.categoryId);
    if (dish.image) newDish.append('image', dish.image);

    const createdDish = await useFetch<IDish>('/dishes', {
      method: 'POST',
      data: newDish,
    });

    dishes.value.unshift(createdDish);
  };

  const editDish = async (id: string, dish: EditDishPayload) => {
    const targetDish = dishes.value.find(dish => dish.id === id);
    if (!targetDish) return;

    const updatedData = new FormData();

    if (dish.name) updatedData.append('name', dish.name);
    if (dish.price) updatedData.append('price', String(dish.price));
    if (dish.description) updatedData.append('description', dish.description);
    if (dish.categoryId) updatedData.append('categoryId', dish.categoryId);
    if (dish.image) updatedData.append('image', dish.image);

    const updatedDish = await useFetch<IDish>(`/dishes/${id}`, {
      method: 'PUT',
      data: updatedData,
    });

    Object.assign(targetDish, updatedDish);
  };

  const deleteDish = async (targetDish: IDish) => {
    const id = targetDish.id;

    await useFetch(`/dishes/${id}`, {
      method: 'DELETE',
    });

    const targetIndex = dishes.value.findIndex(dish => dish.id === id);
    if (targetIndex < 0) return;

    dishes.value.splice(targetIndex, 1);
  };

  const setVisibility = async (targetDish: IDish, isVisible: boolean) => {
    const id = targetDish.id;

    await useFetch(`/dishes/visibility/${id}`, {
      method: 'PUT',
      data: { visible: isVisible },
    });

    // Animation fix
    await sleep(200);

    const dish = dishes.value.find(dish => dish.id === id);
    if (!dish) return;

    dish.visible = isVisible;
  };

  return {
    dishes,
    fetchData,
    searchDishes,
    createDish,
    editDish,
    deleteDish,
    setVisibility,
  };
});