// components/dashboard/types.ts
export type WorkspaceItem = {
    id: string;  
  name: string;
  color: string;
};

export type TaskDataItem = {
  day: string;
  value1: number;
  value2: number;
};

export type Employee = {
  name: string;
  role: string;
  projects: number;
  team: number;
};

export type CaseData = {
  id: string;
  category: string;
  status: string;
  assignedUnit: string;
  date: string;
};
