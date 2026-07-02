<script lang="ts" setup>
import type { BubbleListItemProps } from 'vue-element-plus-x/types/BubbleList';

import { ref } from 'vue';
import { BubbleList } from 'vue-element-plus-x';

type listType = BubbleListItemProps & {
  role: 'ai' | 'user';
};

defineProps<{
  list: listType[];
}>()

const bubbleListRef = ref<null | {
  scrollToBottom: (smooth?: boolean) => void;
}>(null);

defineExpose({
  scrollToBottom: (smooth?: boolean) => {
    bubbleListRef.value?.scrollToBottom?.(smooth);
  },
})

</script>

<template>
  <BubbleList
    :list="list"
    class="bubble-list-full"
    :auto-scroll="true"
    :smooth-scroll="true"
    :show-back-button="true"
    ref="bubbleListRef"
  />
</template>

<style scoped>
.bubble-list-full {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

:deep(.el-bubble-list) {
  flex: 1;
  width: 80% !important;
  overflow: auto;
}

:deep(.markdown-content h1) {
  padding-bottom: 0.3em;
  margin: 0.8em 0 0.4em;
  font-size: 2em;
  font-weight: 700;
  border-bottom: 1px solid hsl(var(--border));
}

:deep(.markdown-content h2) {
  padding-bottom: 0.3em;
  margin: 0.8em 0 0.4em;
  font-size: 1.5em;
  font-weight: 600;
  border-bottom: 1px solid hsl(var(--border));
}

:deep(.markdown-content h3) {
  margin: 0.8em 0 0.4em;
  font-size: 1.25em;
  font-weight: 600;
}

:deep(.markdown-content h4) {
  margin: 0.8em 0 0.4em;
  font-size: 1em;
  font-weight: 600;
}

:deep(.markdown-content h5) {
  margin: 0.8em 0 0.4em;
  font-size: 0.875em;
  font-weight: 600;
}

:deep(.markdown-content h6) {
  margin: 0.8em 0 0.4em;
  font-size: 0.85em;
  font-weight: 600;
}

:deep(.markdown-content p) {
  margin: 0.6em 0;
}

:deep(.markdown-content blockquote) {
  padding: 0.5em 1em;
  margin: 1em 0;
  background-color: hsl(var(--foreground) / 5%);
  border-left: 4px solid hsl(var(--primary));
  border-radius: 0 4px 4px 0;
}

:deep(.markdown-content ul) {
  padding-left: 1.5em;
  margin: 0.6em 0;
}

:deep(.markdown-content ol) {
  padding-left: 1.5em;
  margin: 0.6em 0;
}

:deep(.markdown-content li) {
  margin: 0.3em 0;
}

:deep(.markdown-content a) {
  color: hsl(var(--primary));
}

:deep(.markdown-content hr) {
  margin: 1.5em 0;
  border: none;
  border-top: 1px solid hsl(var(--border));
}

:deep(.markdown-content strong) {
  font-weight: 600;
}
</style>
