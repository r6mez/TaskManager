import type { Task } from '@/types/task';

export type TaskSection = {
  title: string;
  data: Task[];
  clearable?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
};
