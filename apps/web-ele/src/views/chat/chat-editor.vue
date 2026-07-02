<script lang="ts" setup>
import { ref } from 'vue';

import { Plus } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';

defineProps<{
  senderLoading: boolean;
}>()
const emits = defineEmits<{
  (e: 'sendSubmit', value: string): void;
  (e: 'sendCancel'): void;
}>()

const senderValue = ref('');

// 提交
const handleSubmit = (value: string) => {
  emits('sendSubmit', value);
  // console.log("🚀 ~ handleSubmit ~ senderLoading:", value)
  // senderLoading.value = true;
  // timeValue.value = setTimeout(() => {
  //   // 可以在控制台 查看打印结果
  //   console.log('submit-> value：', value);
  //   console.log('submit-> senderValue', senderValue.value);
  //   senderLoading.value = false;
  // }, 10000000);
}

// 取消
function handleCancel() {
  emits('sendCancel');
}

// 语音识别
function handleRecordingChange(recording: string) {
  console.log('🚀 ~ handleRecordingChange ~ recording:', recording)
}

defineExpose({
  clear: () => {
    senderValue.value = '';
  }
})

</script>
<template>
  <Sender
    v-model="senderValue"
    :loading="senderLoading"
    variant="updown"
    allow-speech
    clearable
    @submit="handleSubmit"
    @cancel="handleCancel"
    @recording-change="handleRecordingChange"
    style="width: 80%"
    :auto-size="{
        maxRows: 9,
        minRows: 3,
      }"
  >
    <template #prefix>
      <ElIcon class="upload-icon" size="18"><Plus /></ElIcon>
    </template>
  </Sender>
</template>
<style scoped>
.chat-editor {
  height: 100%;
}

:deep(.elx-x-sender__loading-button) {
  width: 16px !important;
}

:deep(.el-sender-prefix) {
  display: flex;
  align-items: center;
}

.upload-icon {
  cursor: pointer;
}

.send-btn {
  background-color: hsl(var(--primary));
  border-color: hsl(var(--primary));
}

.send-btn:hover {
  background-color: hsl(var(--primary) / 90%);
  border-color: hsl(var(--primary) / 90%);
}
</style>
