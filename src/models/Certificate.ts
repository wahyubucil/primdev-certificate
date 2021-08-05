import dayjs, { Dayjs } from 'dayjs';
import { ethers } from 'ethers';
import type { DocumentData, Timestamp } from 'firebase/firestore';

type Status = 'Available' | 'Expired' | 'Revoked';

export class Certificate {
  private constructor(
    public readonly code: number,
    public readonly name: string,
    public readonly expiredAt: Dayjs | null,
    public readonly participants: string[],
    public readonly status: Status,
  ) {}

  static fromFirestore(id: string, data: DocumentData) {
    const expiredAt = data.expiredAt
      ? dayjs((data.expiredAt as Timestamp).toDate())
      : null;

    let status: Status = 'Available';
    if (data.revoked) status = 'Revoked';
    else if (expiredAt && dayjs().isAfter(expiredAt)) status = 'Expired';

    const certificate = new Certificate(
      Number(id),
      data.name,
      expiredAt,
      data.participants,
      status,
    );
    return certificate;
  }

  public get participantsWithHash() {
    return this.participants.map((e) => ethers.utils.id(e.toLowerCase()));
  }
}
