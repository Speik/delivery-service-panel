import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useFetch } from '@/composables';

type CreateUserPayload = Pick<IUser, 'name'> & {
  password: string;
};

export const useUsersStore = defineStore('users', () => {
  const users = ref<IUser[]>([]);

  const fetchData = async (offset: number, limit: number) => {
    const usersData = await useFetch<IUser[]>('/managers', {
      method: 'GET',
      params: { limit, offset },
    });

    users.value = offset > 0
      ? users.value.concat(usersData)
      : usersData;
  };

  const searchUsers = async (term: string) => {
    users.value = await useFetch<IUser[]>('/managers/search', {
      method: 'GET',
      params: { term },
    });
  };

  const createUser = async (user: CreateUserPayload) => {
    const createdUser = await useFetch<IUser>('/managers', {
      method: 'POST',
      data: user,
    });

    users.value.unshift(createdUser);
  };

  const deleteUser = async (targetUser: IUser) => {
    const id = targetUser.id;

    await useFetch(`/managers/${id}`, {
      method: 'DELETE',
    });

    const targetIndex = users.value.findIndex(user => user.id === id);
    if (targetIndex < 0) return;

    users.value.splice(targetIndex, 1);
  };


  return { users, fetchData, searchUsers, createUser, deleteUser };
});