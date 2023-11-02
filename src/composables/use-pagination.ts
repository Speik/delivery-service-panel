import { reactive } from 'vue';

type UsePaginationOptions = {
  limit: number;
}

type PaginationState = {
  currentPage: number;
  offset: number;
  limit: number;
}

const usePagination = ({ limit }: UsePaginationOptions) => {
  const state = reactive<PaginationState>({
    currentPage: 1,
    offset: 0,
    limit,
  });

  const recalculateOffset = () => {
    state.offset = (state.currentPage - 1) * state.limit;
  };

  const setNextPage = () => {
    state.currentPage += 1;
    recalculateOffset();
  };

  const resetPage = () => {
    state.currentPage = 1;
    recalculateOffset();
  };

  return { state, setNextPage, resetPage };
};

export { usePagination };