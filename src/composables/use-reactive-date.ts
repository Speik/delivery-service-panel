import { ref } from 'vue';

const DATE_TIMER_TICK = 1000;
const reactiveDate = ref<Date>(new Date());

/**
 * @description
 * Returns current date wrapped with reactive container,
 * which is continiously updating every second
 */
const useReactiveDate = () => ({ reactiveDate });

(function updateCurrentDate() {
  reactiveDate.value = new Date();
  setTimeout(updateCurrentDate, DATE_TIMER_TICK);
})();

export { useReactiveDate };