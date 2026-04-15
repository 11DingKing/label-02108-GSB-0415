<script setup lang="ts">
/**
 * TrafficLightButtons.vue
 * macOS 风格红黄绿窗口控制按钮组件
 * Requirements: 4.4, 4.5, 4.6, 4.7
 */

import { ref } from 'vue';

// 定义组件发出的事件
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'minimize'): void;
  (e: 'maximize'): void;
}>();

// 追踪鼠标是否悬停在按钮组上
const isHovered = ref(false);

// 事件处理函数
const handleClose = () => {
  emit('close');
};

const handleMinimize = () => {
  emit('minimize');
};

const handleMaximize = () => {
  emit('maximize');
};
</script>

<template>
  <div 
    class="traffic-light-buttons"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 红色按钮 - 关闭 -->
    <button 
      class="traffic-button close"
      @click="handleClose"
      aria-label="Close window"
    >
      <span v-show="isHovered" class="icon">×</span>
    </button>
    
    <!-- 黄色按钮 - 最小化 -->
    <button 
      class="traffic-button minimize"
      @click="handleMinimize"
      aria-label="Minimize window"
    >
      <span v-show="isHovered" class="icon">−</span>
    </button>
    
    <!-- 绿色按钮 - 最大化 -->
    <button 
      class="traffic-button maximize"
      @click="handleMaximize"
      aria-label="Maximize window"
    >
      <span v-show="isHovered" class="icon">+</span>
    </button>
  </div>
</template>

<style scoped>
.traffic-light-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.traffic-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background-color 0.15s ease;
  position: relative;
}

.traffic-button .icon {
  font-size: 10px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
}

/* 红色按钮 - 关闭 */
.traffic-button.close {
  background-color: var(--traffic-red);
}

.traffic-button.close:hover {
  background-color: var(--traffic-red-hover);
}

/* 黄色按钮 - 最小化 */
.traffic-button.minimize {
  background-color: var(--traffic-yellow);
}

.traffic-button.minimize:hover {
  background-color: var(--traffic-yellow-hover);
}

/* 绿色按钮 - 最大化 */
.traffic-button.maximize {
  background-color: var(--traffic-green);
}

.traffic-button.maximize:hover {
  background-color: var(--traffic-green-hover);
}

/* 焦点样式 - 无障碍访问 */
.traffic-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--focus-ring, rgba(0, 122, 255, 0.5));
}

/* 禁用状态下的按钮样式 */
.traffic-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
