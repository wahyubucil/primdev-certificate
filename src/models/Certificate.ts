import dayjs, { Dayjs } from 'dayjs';
import type { DocumentData, Timestamp } from 'firebase/firestore';

export class Certificate {
  private constructor(
    public readonly code: number,
    public readonly name: string,
    public readonly expiredAt: Dayjs | null,
    public readonly participants: string[],
  ) {}

  static fromFirestore(data: DocumentData) {
    const certificate = new Certificate(
      data.code,
      data.name,
      data.expiredAt ? dayjs((data.expiredAt as Timestamp).toDate()) : null,
      data.participants,
    );
    return certificate;
  }
}
