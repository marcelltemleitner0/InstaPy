export type Row = {
  id: number;
  username: string;
  follows_viewer: boolean;
};

export type Filter = "all" | "mutual" | "ghost";

export type Toast = {
  id: string;
  username: string;
  success: boolean;
  show: boolean;
};
