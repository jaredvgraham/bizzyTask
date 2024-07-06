export interface Task {
  id: string;
  name: string;
  descriptions: { text: string; createdAt: Date; completed: boolean }[];
  completed: boolean;

  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  tasks: Task[];
  completed: boolean;
  createdAt: Date;
}

// export interface BusinessType {
//   id: string;
//   name: string;
//   categories: Category[];
//   createdAt: Date;
//   type: string;
//   description: string;
// }
export interface Business {
  id: string;
  name: string;
  description: string;
  type: string;
  progress: number;
  teamMembers: string[];
  createdAt: Date;
}

export interface Description {
  text: string;
  createdAt: Date;
  completed: boolean;
}
