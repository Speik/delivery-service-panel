<template>
  <n-card
    embedded
    title="Customer"
  >
    <template #header-extra>
      <n-tooltip>
        <template #trigger>
          <a
            :href="`tel:${data.customer.phone}`"
            :style="{ textDecoration: 'none' }"
          >
            <n-tag
              :bordered="false"
              :style="{ cursor: 'pointer' }"
            >
              <template #icon>
                <n-icon :component="PhoneIcon" />
              </template>
              +{{ data.customer.phone }}
            </n-tag>
          </a>
        </template>

        Click to call number
      </n-tooltip>
    </template>

    <n-space vertical>
      <div :style="{ display: 'flex', alignItems: 'flex-start' }">
        <n-icon
          :component="CustomerIcon"
          :size="20"
        />

        <span :style="{ marginLeft: '.5rem' }">
          {{ data.customer.name }}
        </span>
      </div>

      <div
        v-if="data.type === OrderType.DELIVERY"
        :style="{ display: 'flex', alignItems: 'flex-start' }"
      >
        <n-icon
          :component="AddressIcon"
          :size="20"
        />

        <span :style="{ marginLeft: '.5rem' }">
          {{ data.customer.address }}
        </span>
      </div>

      <div
        v-if="data.comment"
        :style="{ display: 'flex', alignItems: 'flex-start' }"
      >
        <n-icon
          class="bounce"
          :component="CommentIcon"
          :size="20"
          :color="themeVars.warningColorPressed"
        />

        <span :style="{ marginLeft: '.5rem' }">
          {{ data.comment }}
        </span>
      </div>
    </n-space>

    <template #footer>
      <n-space>
        <OrderTypeTag :value="data.type" />
        <PaymentMethodTag :value="data.paymentMethod" />
      </n-space>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NSpace,
  NIcon,
  NTag,
  NTooltip,
  useThemeVars,
} from 'naive-ui';

import {
  User as CustomerIcon,
  Phone as PhoneIcon,
  Location as AddressIcon,
  Chat as CommentIcon,
} from '@vicons/carbon';

import OrderTypeTag from '@/components/OrderTypeTag.vue';
import PaymentMethodTag from '@/components/PaymentMethodTag.vue';

import { OrderType } from '@/declarations';

defineProps<{ data: IOrder }>();
const themeVars = useThemeVars();
</script>

<style scoped>
@keyframes bounce {
  0% { scale: 1 }
  100% { scale: 1.15 }
}

.bounce {
  scale: 1;
  animation: bounce 1s alternate infinite ease;
}
</style>