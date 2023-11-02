import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

import { useFetch } from '@/composables';

type DashboardDateRange = {
  daily: DateRange,
  monthly: DateRange,
}

type DashboardData = {
  generalStats: IGeneralStats;
  detailedStats: IDetailedStats;
  platinumMember: IPlatinumMember | null;
  favoriteDish: IDish | null;
  costlyOrder: IOrder | null;
  dailyStats: IDailyStats;
}

export const useDashboardStore = defineStore('dashboard', () => {
  const isLoading = ref(false);

  const dateRange = reactive<DashboardDateRange>({
    daily: [new Date(), new Date()],
    monthly: [new Date(), new Date()],
  });

  const data = reactive<DashboardData>({
    generalStats: {
      totalOrders: 0,
      uniqueCustomers: 0,
      totalIncome: 0,
      averageBill: 0,
    },
    detailedStats: {
      delivery: {
        totalOrders: 0,
        totalIncome: 0,
        averageTime: 0,
      },
      takeaway: {
        totalOrders: 0,
        totalIncome: 0,
        averageTime: 0,
      },
    },
    platinumMember: null,
    favoriteDish: null,
    costlyOrder: null,
    dailyStats: {
      orders: [],
      totalIncome: 0,
    },
  });

  const getDateRangeParams = (type: 'daily' | 'monthly') => {
    const [start, end] = type === 'daily'
      ? dateRange.daily
      : dateRange.monthly;

    return {
      start: start.getTime(),
      end: end.getTime(),
    };
  };

  const setDailyDateRange = (start: Date, end: Date) => {
    dateRange.daily = [start, end];
  };

  const setMonthlyDateRange = (start: Date, end: Date) => {
    dateRange.monthly = [start, end];
  };

  const setLoading = (state: boolean) => {
    isLoading.value = state;
  };

  const getGeneralStats = async () => {
    data.generalStats = await useFetch('/dashboard/stats/general', {
      method: 'GET',
      params: getDateRangeParams('monthly'),
    });
  };

  const getDetailedStats = async () => {
    data.detailedStats = await useFetch('/dashboard/stats/detailed', {
      method: 'GET',
      params: getDateRangeParams('monthly'),
    });
  };

  const getPlatinumMember = async () => {
    data.platinumMember = await useFetch('/dashboard/customers/platinum', {
      method: 'GET',
      params: getDateRangeParams('monthly'),
    });
  };

  const getFavoriteDish = async () => {
    data.favoriteDish = await useFetch('/dashboard/dishes/favorite', {
      method: 'GET',
      params: getDateRangeParams('monthly'),
    });
  };

  const getCostlyOrder = async () => {
    data.costlyOrder = await useFetch('/dashboard/orders/costly', {
      method: 'GET',
      params: getDateRangeParams('monthly'),
    });
  };

  const fetchData = async () => {
    setLoading(true);

    await Promise.allSettled([
      getGeneralStats(),
      getDetailedStats(),
      getPlatinumMember(),
      getFavoriteDish(),
      getCostlyOrder(),
    ]);

    setLoading(false);
  };

  const fetchDailyStats = async () => {
    data.dailyStats = {
      orders: [],
      totalIncome: 0,
    };

    data.dailyStats = await useFetch('/dashboard/stats/daily', {
      method: 'GET',
      params: getDateRangeParams('daily'),
    });
  };

  return {
    data,
    isLoading,
    setLoading,
    fetchData,
    fetchDailyStats,
    setDailyDateRange,
    setMonthlyDateRange,
  };
});