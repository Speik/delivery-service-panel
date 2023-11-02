import { ref } from 'vue';

const isFullyScrolled = ref(false);

const useContentScroll = () => {
  const setFullyScrolled = (state: boolean) => {
    isFullyScrolled.value = state;
  };

  return { isFullyScrolled, setFullyScrolled };
};

export { useContentScroll };