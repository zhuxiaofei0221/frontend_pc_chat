<script lang="ts" setup>
import type {
  ConversationItem,
  ConversationMenuCommand
} from 'vue-element-plus-x/types/Conversations';

import { CirclePlus } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';

defineProps({
  menuList: {
    type: Array,
    default: () => []
  },
  activeMenuKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'update:activeMenuKey', value: string): void;
  (e: 'menuCommand', payload: {command: ConversationMenuCommand, item: ConversationItem}): void;
  (e: 'addConversation'): void;
}>()

// 内置菜单点击方法
function handleMenuCommand(
  command: ConversationMenuCommand,
  item: ConversationItem
) {
  emit('menuCommand', {command, item});
}

const handleActiveChange = (value: string) => {
  emit('update:activeMenuKey', value);
}

const handleAddConversation = () => {
  emit('addConversation');
}
</script>
<template>
  <div class="concerstaion-wrap">
    <div class="add-wrap" @click="handleAddConversation">
      <ElIcon size="18" class="mr-2"><CirclePlus /></ElIcon>
        <span>新建会话</span>
    </div>
    <Conversations
      :active="activeMenuKey"
      @update:active="handleActiveChange"
      :items="menuList"
      :label-max-width="200"
      :show-tooltip="true"
      row-key="id"
      tooltip-placement="right"
      :tooltip-offset="35"
      show-to-top-btn
      show-built-in-menu
      @menu-command="handleMenuCommand"
    />
</div>
</template>

<style lang="scss" scoped>
:deep(.conversations-list) {
  background-color: hsl(var(--sidebar)) !important;
}

:deep(.conversation-item.active) {
  background-color: hsl(var(--foreground) / 5%) !important;
}

:deep(.conversation-item, .conversation-item.active .conversation-label) {
  color: hsl(var(--primary)) !important;
}

:deep(.conversation-content .conversation-label) {
  color: hsl(var(--foreground)) !important;
}

:deep(.conversation-item:hover:not(.conversation-disabled)) {
  background-color: hsl(var(--foreground) / 5%) !important;
}

:deep(.conversation-item.conversations-item--disabled .elx-conversations-item__label) {
  color: hsl(var(--foreground) / 40%) !important;
}

:deep(.conversation-icon) {
  color: hsl(var(--foreground) / 60%) !important;
}

:deep(.conversation-item.conversation.active .conversation-icon) {
  color: hsl(var(--primary)) !important;
}

:deep(.conversation-scrollbar) {
  background-color: transparent !important;
}

:deep(.conversation-scrollbar::-webkit-scrollbar) {
  width: 6px;
}

:deep(.conversation-scrollbar::-webkit-scrollbar-track) {
  background-color: transparent;
}

:deep(.conversation-scrollbar::-webkit-scrollbar-thumb) {
  background-color: hsl(var(--foreground) / 20%);
  border-radius: 3px;
}

:deep(.conversation-scrollbar::-webkit-scrollbar-thumb:hover) {
  background-color: hsl(var(--foreground) / 40%);
}

.concerstaion-wrap {
  display: flex;
  flex-direction: column;
  background-color: hsl(var(--sidebar)) !important;

  .add-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin-bottom: 10px;
    color: hsl(var(--foreground));
    cursor: pointer;
    border: 1px solid hsl(var(--border));
    border-radius: 20px;
    box-shadow: 0 0 10px hsl(var(--foreground) / 10%);
    transition: all 0.2s ease-in-out;

    &:hover {
      color: hsl(var(--primary));
      border-color: hsl(var(--primary));
    }
  }
}
</style>
