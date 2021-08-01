import type { Dayjs } from 'dayjs';

export interface Certificate {
  code: number;
  name: string;
  expiredAt: Dayjs | null;
  participants: string[];
}
