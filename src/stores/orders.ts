import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useFetch } from '@/composables';

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<IOrder[]>([]);

  const fetchData = async (offset: number, limit: number, onlyActive: boolean) => {
    const ordersData = await useFetch<IOrder[]>('/orders', {
      method: 'GET',
      params: { limit, offset, onlyActive }
    });

    orders.value = offset > 0
      ? orders.value.concat(ordersData)
      : ordersData;
  };

  const searchOrders = async (term: string) => {
    orders.value = await useFetch<IOrder[]>('/orders/search', {
      method: 'GET',
      params: { term },
    });
  };

  const changeOrderStatus = async (targetOrder: IOrder, status: OrderStatus) => {
    const id = targetOrder.id;
    const order = orders.value.find(order => {
      return order.id === id;
    });

    if (!order) return;
    if (order.status === status) return;

    await useFetch(`/orders/status/${id}`, {
      method: 'PUT',
      data: { status },
    });

    order.status = status;
  };

  return {
    orders,
    fetchData,
    searchOrders,
    changeOrderStatus,
  };
});