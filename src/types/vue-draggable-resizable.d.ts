/**
 * Type declarations for vue-draggable-resizable
 * This module doesn't have official TypeScript types
 */
declare module 'vue-draggable-resizable' {
  import { DefineComponent } from 'vue';
  
  interface VueDraggableResizableProps {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    z?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    resizable?: boolean;
    draggable?: boolean;
    parent?: boolean;
    dragHandle?: string;
    dragCancel?: string;
    lockAspectRatio?: boolean;
    active?: boolean;
    preventDeactivation?: boolean;
    disableUserSelect?: boolean;
    enableNativeDrag?: boolean;
    handles?: string[];
    axis?: 'x' | 'y' | 'both';
    grid?: [number, number];
    onDragStart?: (x: number, y: number) => void | boolean;
    onDrag?: (x: number, y: number) => void;
    onDragStop?: (x: number, y: number) => void;
    onResizeStart?: (handle: string, x: number, y: number) => void | boolean;
    onResize?: (handle: string, x: number, y: number, width: number, height: number) => void;
    onResizeStop?: (handle: string, x: number, y: number, width: number, height: number) => void;
  }

  const VueDraggableResizable: DefineComponent<VueDraggableResizableProps>;
  export default VueDraggableResizable;
}

declare module 'vue-draggable-resizable/style.css';
