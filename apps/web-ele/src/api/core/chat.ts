import { useAccessStore } from '@vben/stores';

import { requestClient } from '#/api/request';

function formatToken(token: null | string) {
  return token ? `Bearer ${token}` : null;
}


/**
 * 获取会话的消息列表
 */
export async function addChatMessageApi() {
  return requestClient.post<any>('/chat');
}

/**
 * 获取会话消息
 */
export async function getChatMessageApi() {
  return requestClient.get<any>('/chat');
}

/**
 * 获取单个会话消息
 */
export async function getChatMessageDetailApi(id: string) {
  return requestClient.get<any>(`/chat/${id}`);
}

/**
 * 删除会话消息
 */
export async function delChatMessageApi(id: string) {
  return requestClient.delete<any>(`/chat/${id}`);
}

/**
 * 新增会话
 */
export async function getChatMessageListApi(id: string) {
  return requestClient.get<any>(`/message/${id}`);
}



/**
 * 发送消息 - SSE 流式版本
 */
export async function sendChatMessageApi(data: {content: string, conversationId: string}) {
  return requestClient.post<any>(`/message/streamChat`, data);
}

/**
 * SSE 流式发送消息
 */
export function sendChatMessageStreamApi(
  data: {content: string, conversationId: string},
  callbacks: {
    onComplete?: () => void;
    onError: (error: Error) => void;
    onMessage: (chunk: string) => void;
  }
): () => void {
  const accessStore = useAccessStore();
  const token = formatToken(accessStore.accessToken);

  const url = `${import.meta.env.VITE_GLOB_API_URL}/message/streamChat`;

  const abortController = new AbortController();

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token || '',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify(data),
    signal: abortController.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          callbacks.onComplete?.();
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            try {
              const parsed = JSON.parse(data);
              callbacks.onMessage(parsed);
            } catch {
              callbacks.onMessage(data);
            }
          }
        }
      }
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        callbacks.onError(error);
      }
    });

  return () => {
    abortController.abort();
  };
}
