import { reactive } from 'vue';

type LoadingState = { state: boolean; hasError: boolean; };
type SetLoadingOptions = { error: boolean };

const pageLoading = reactive<LoadingState>({
  state: false,
  hasError: false,
});

const usePageLoading = () => {
  const setLoading = (state: boolean, options?: SetLoadingOptions) => {
    pageLoading.state = state;
    pageLoading.hasError = options?.error ?? false;
  };

  return { pageLoading, setLoading };
};

export { usePageLoading };