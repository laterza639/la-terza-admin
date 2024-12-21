export interface Schedule {
  id: string;
  morningOpenTime: string | null;
  morningCloseTime: string | null;
  eveningOpenTime: string | null;
  eveningCloseTime: string | null;
  isOpen: boolean;
  branch: string;
}
