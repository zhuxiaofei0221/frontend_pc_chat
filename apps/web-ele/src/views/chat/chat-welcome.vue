<script lang="ts" setup>
import { computed } from 'vue';
import { Welcome } from 'vue-element-plus-x';

const welcomeTitle = computed(() => {
  return `欢迎使用 ${import.meta.env.VITE_APP_TITLE}  💖`;
});
</script>
<template>
  <Welcome
    :title="welcomeTitle"
    description="选择左侧会话列表开始对话，或新建会话开启新的交流"
    variant="borderless"
    :style="{
      backgroundColor: 'hsl(var(--sidebar))',
      color: 'hsl(var(--foreground))',
      width: '80%'
    }"
  />
</template>

<style scoped>
:deep(.elx-welcome) {
  border: 1px solid hsl(var(--primary)) !important;

}

:deep(.elx-welcome__header) {
  display: flex !important;
  justify-content: center !important;
}

:deep(.elx-welcome__title), :deep(.elx-welcome__description) {
  color: hsl(var(--foreground)) !important;
  text-align: center;
}
</style>
