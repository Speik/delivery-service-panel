import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useFetch } from '@/composables';

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<ICustomer[]>([]);

  const fetchData = async (offset: number, limit: number) => {
    const customersData = await useFetch<ICustomer[]>('/customers', {
      method: 'GET',
      params: { offset, limit },
    });

    customers.value = offset > 0
      ? customers.value.concat(customersData)
      : customersData;
  };

  const searchCustomers = async (term: string) => {
    customers.value = await useFetch<ICustomer[]>('/customers/search', {
      method: 'GET',
      params: { term },
    });
  };

  return {
    customers,
    fetchData,
    searchCustomers,
  };
});