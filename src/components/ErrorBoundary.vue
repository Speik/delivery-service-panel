<!--
  Service component wrapper that catches and
  handles application errors
-->
<template>
  <slot />
</template>

<script setup lang="ts">
import {
  MessageRenderMessage,
  NAlert,
  NText,
  useMessage,
  useThemeVars
} from 'naive-ui';

import { useRouter } from 'vue-router';
import { ref, watch, h, onErrorCaptured, onBeforeMount } from 'vue';

import { usePageLoading, useAuth } from '@/composables';
import { UnauthorizedError } from '@/utils';

const asyncError = ref<Error | null>(null);

const router = useRouter();
const messageController = useMessage();
const themeVars = useThemeVars();
const { pageLoading, setLoading } = usePageLoading();
const { setAuthorizedUser } = useAuth();

const handleUnauthorizedError = (error: Error) => {
  // If authentication failed - logout and redirect to login
  if (error instanceof UnauthorizedError) {
    setAuthorizedUser(null);
    router.replace('/login');
  }
};

/**
 * Note that this message render function using Alert
 * as display component instead of native NaiveUI message
 *
 * Read more:
 * https://www.naiveui.com/en-US/os-theme/components/message#customize-message.vue
 */
const getMessageRenderer = (currentError: Error): MessageRenderMessage => {
  const { name: errorName, message: errorMessage } = currentError;

  return (props) => {
    const customProps = {
      /**
       * @throws TypeScriptError when type is
       * 'error' despite it is correct value
       */
      type: 'error' as any,
      title: `${errorName} has occurred`,
      closable: props.closable,
      bordered: false,
      style: {
        backgroundColor: themeVars.value.baseColor,
        boxShadow: themeVars.value.boxShadow3,
        borderRadius: '5px',
        width: '480px',
      },
      themeOverrides: {
        titleTextColorError: themeVars.value.errorColorHover,
      },
    };

    return h(NAlert, customProps, {
      default: () => {
        return h(NText, { code: true }, { default: () => errorMessage });
      }
    });
  };
};

const handleError = (error: Error) => {
  /**
   * Empty string as content here since message
   * is building in renderer function
   */
  messageController.error('', {
    render: getMessageRenderer(error),
    keepAliveOnHover: true,
    closable: true,
  });

  /**
   * Disable loading only if it's actually running to avoid
   * NaiveUI loading bar error effect
   */
  if (pageLoading.state) {
    setLoading(false, { error: true });
  }

  handleUnauthorizedError(error);
  console.warn(error.message);

  // Stop error propagation
  return false;
};

const handlePromiseRejection = (event: PromiseRejectionEvent) => {
  event.preventDefault();
  event.promise.catch(handleUnauthorizedError);

  // It could be an array due to NaiveUI form validation
  if (!Array.isArray(event.reason)) {
    asyncError.value = new Error(event.reason);
    return;
  }

  const errorMessage = event.reason.flat(Infinity)
    .map(({ message }) => message).join(', ');

  asyncError.value = new Error(errorMessage);
};

onBeforeMount(() => {
  window.addEventListener('unhandledrejection', handlePromiseRejection);
});

watch(asyncError, (error: Error | null) => {
  if (error) return handleError(error);
});

onErrorCaptured(handleError);
</script>