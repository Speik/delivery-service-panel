import { Component, h } from 'vue';
import { FormInst, IconProps, NIcon } from 'naive-ui';

type ResourceType = 'image' | 'avatar';

const resolveResourceUrl = (type: ResourceType, partialPath: string | null) => {
  if (partialPath) {
    return import.meta.env.VITE_API_BASE_URL + '/' + partialPath;
  }

  return type === 'image'
    ? '/fallback-image.jpg'
    : '/fallback-avatar.jpg';
};

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const renderIcon = (icon: Component, props?: IconProps) => {
  return () => {
    return h(NIcon, props, {
      default: () => h(icon)
    });
  };
};

const validateForm = (form: FormInst) => {
  return new Promise<boolean>((resolve) => {
    form.validate(errors => {
      return resolve(!errors?.length);
    });
  });
};

const parseLocalDate = (utcDateString: string) => {
  const utcDate = new Date(utcDateString);
  const timeZoneOffset = utcDate.getTimezoneOffset() * 60 * 1000;
  return new Date(utcDate.getTime() - timeZoneOffset);
};

const formatDate = (date: string | Date) => {
  const currentLanguage = window.navigator.language;

  return new Date(date).toLocaleString(currentLanguage, {
    dateStyle: 'medium',
  });
};

const formatPrice = (price: number | string) => {
  return Number(price).toFixed(2) + '$';
};

const getDayRange = (date: Date): DateRange => {
  const start = new Date(date);
  const end = new Date(date);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return [start, end];
};

const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return [start, end];
};

export {
  resolveResourceUrl,
  getRandomInt,
  renderIcon,
  validateForm,
  parseLocalDate,
  formatDate,
  formatPrice,
  getDayRange,
  getMonthRange,
};