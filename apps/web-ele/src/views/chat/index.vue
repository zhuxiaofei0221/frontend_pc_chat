<script lang="ts" setup>
import type { BubbleListItemProps } from 'vue-element-plus-x/types/BubbleList';
import type {
  ConversationItem,
  ConversationMenuCommand,
} from 'vue-element-plus-x/types/Conversations';

import { onMounted, reactive, ref } from 'vue';

import { preferences } from '@vben/preferences';

import { ElMessage } from 'element-plus';

import {
  addChatMessageApi,
  delChatMessageApi,
  getChatMessageApi,
  getChatMessageListApi,
  sendChatMessageStreamApi
} from '#/api';

import ChatConversation from './chat-conversation.vue';
import ChatEditor from './chat-editor.vue';
import ChatRender from './chat-render.vue';
import ChatWelcome from './chat-welcome.vue';

type listType = BubbleListItemProps & {
  role: 'ai' | 'user';
};

const senderLoading = ref(false);
let currentCancel: (() => void) | null = null;

const list = ref<listType[]>([]);

const chatRender = ref<typeof ChatRender>();
const chatEditor = ref<typeof ChatEditor>();

const chatDefaultObj = {
  key: list.value.length + 1,
  shape: 'corner',
  avatarSize: '32px', // 头像占位大小
  avatarGap: '12px', // 头像与气泡之间的距离
};

// 用户气泡
const chatUserObj = {
  ...chatDefaultObj,
  role: 'user',
  placement: 'end',
  loading: false,
  variant: 'outlined',
  isMarkdown: false,
  typing: false,
  isFog: false,
  avatar: preferences.app.defaultAvatar,
};
// 机器人气泡
const chatAiObj = {
  ...chatDefaultObj,
  role: 'ai',
  placement: 'start',
  loading: true,
  variant: 'filled',
  isMarkdown: true,
  isFog: true,
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
};

// 发送消息
const handleSendSubmit = async (val: string) => {
  senderLoading.value = true;
  const userObj: any = {
    ...chatUserObj,
    content: val,
  };
  list.value.push(userObj);

  chatEditor.value?.clear();

  const aiObj: any = reactive({
    ...chatAiObj,
    content: '',
    loading: true,
  });
  list.value.push(aiObj);

  let buffer = '';
  let isTyping = false;
  let cancelTimer: null | ReturnType<typeof setTimeout> = null;
  const typingSpeed = 15;

  const typeWriter = () => {
    if (buffer.length > 0) {
      aiObj.content += buffer[0];
      buffer = buffer.slice(1);
      chatRender.value?.scrollToBottom();
      cancelTimer = setTimeout(typeWriter, typingSpeed);
      aiObj.loading = false;
    } else {
      isTyping = false;
    }
  };

  const appendToBuffer = (text: string) => {
    buffer += text;
    if (!isTyping && buffer.length > 0) {
      isTyping = true;
      typeWriter();
    }
  };

  const cancelResult = sendChatMessageStreamApi(
    { content: val, conversationId: activeMenuKey.value },
    {
      onMessage: (chunk: any) => {
        console.log('收到数据:', chunk);
        let text = '';
        if (typeof chunk === 'string') {
          text = chunk;
        } else if (typeof chunk === 'object' && chunk.type === 'token' && chunk.content) {
          text = chunk.content;
        }
        if (text) {
          appendToBuffer(text);
        }
        if (chunk.type === 'title') {
          const item = menuList.value.find((item: any) => item.id === activeMenuKey.value);
          if (item) {
            item.title = chunk.content;
            item.label = chunk.content;
          }
           console.log("🚀 ~ handleSendSubmit ~ menuList.value:", menuList.value)
        }
      },
      onError: (error) => {
        if (error.name === 'AbortError') {
          return;
        }
        console.error('错误:', error);
        appendToBuffer(`\n\n发送失败: ${error.message}`);
        aiObj.loading = false;
        aiObj.typing = false;
        ElMessage.error('发送失败');
      },
      onComplete: () => {
        console.log('流结束');
        aiObj.loading = false;
        aiObj.typing = false;
        senderLoading.value = false;
        currentCancel = null;
        chatRender.value?.scrollToBottom();
      },
    },
  );

  const handleCancel = () => {
    cancelResult();
    if (cancelTimer) {
      clearTimeout(cancelTimer);
      cancelTimer = null;
    }
    buffer = '';
    isTyping = false;
    const aiIndex = list.value.indexOf(aiObj);
    if (aiIndex > -1) {
      list.value.splice(aiIndex, 1);
    }
    senderLoading.value = false;
    currentCancel = null;
    ElMessage.info('已取消发送');
  };

  currentCancel = handleCancel;
};

// 取消发送
const handleSendCancel = () => {
  if (currentCancel) {
    currentCancel();
  } else {
    senderLoading.value = false;
  }
};

const menuList: any = ref([]);
const activeMenuKey = ref('');
const getChatMessage = async () => {
  menuList.value = await getChatMessageApi();
  if (menuList.value.length > 0) {
    activeMenuKey.value = menuList.value[0].id;
    menuList.value.forEach((item: any) => {
      item.label = item.title;
    });
    console.log('🚀 ~ getChatMessage ~ menuList.value:', menuList.value);
    getChatMessageList(activeMenuKey.value);
  }
};

const delChatMessage = async (id: string) => {
  await delChatMessageApi(id);
  ElMessage.success('删除成功');
  getChatMessage();
};

const handleActiveMenuKeyChange = (value: string) => {
  activeMenuKey.value = value;
  getChatMessageList(activeMenuKey.value);
};

// 内置菜单点击方法
const handleMenuCommand = (payload: {
  command: ConversationMenuCommand;
  item: ConversationItem;
}) => {
  if (payload.command === 'delete') {
    delChatMessage(payload.item.id);
  }
  console.log('内置菜单点击事件：', payload.command, payload.item);
};

// 获取聊天记录
const getChatMessageList = async (id: string) => {
  const res: any = await getChatMessageListApi(id);
  if (res && res.length > 0) {
    list.value = res.map((item: any) => {
      if (item.role === 'user') {
        return {
          ...chatUserObj,
          content: item.content,
          loading: false,
          typing: false,
        };
      } else {
        return {
          ...chatAiObj,
          content: item.content,
          loading: false,
          typing: false,
        };
      }
    });
  } else {
    list.value = [];
  }
};

const handleAddConversation = async () => {
  if (list.value.length === 0) {
    return;
  }
  const res = await addChatMessageApi();
  activeMenuKey.value = res.id;
  list.value = [];
  menuList.value.unshift(res);
}

onMounted(() => {
  getChatMessage();
});
</script>
<template>
  <div class="chat-wrap p-4">
    <ChatConversation
      :menu-list="menuList"
      :active-menu-key="activeMenuKey"
      @update:active-menu-key="handleActiveMenuKeyChange"
      @menu-command="handleMenuCommand"
      @add-conversation="handleAddConversation"
    />
    <div class="chat-content">
      <ChatWelcome class="mb-10" v-if="list.length === 0" />
      <ChatRender ref="chatRender" class="chart-render-wrap" :list="list" v-else />
      <ChatEditor
      ref="chatEditor"
      @send-submit="handleSendSubmit"
      @send-cancel="handleSendCancel"
      :sender-loading="senderLoading"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-wrap {
  box-sizing: border-box;
  display: flex;
  height: 100%;
  background-color: var(--el-fill-color-blank) !important;
}

.chat-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 0;
  margin-left: 10px;

  .chart-render-wrap {
    flex: 1;
    width: 100%;
    min-height: 0;
    margin-bottom: 10px;
  }
}
</style>
