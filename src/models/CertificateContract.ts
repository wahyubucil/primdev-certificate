import dayjs, { Dayjs } from 'dayjs';
import { BigNumber } from 'ethers';

export class CertificateContract {
  #participants: string[] | null = null;

  public constructor(
    public readonly name: string,
    public readonly expiredAt: Dayjs,
    public readonly createdAt: Dayjs,
    public readonly state: State,
    public readonly metadataHash: string,
    public readonly participantsHash: string,
  ) {}

  static fromGetter([
    name,
    expiredAt,
    createdAt,
    state,
    metadataHash,
    participantsHash,
  ]: [string, BigNumber, BigNumber, number, string, string]) {
    return new CertificateContract(
      name,
      dayjs.unix(expiredAt.toNumber()),
      dayjs.unix(createdAt.toNumber()),
      state,
      metadataHash.toLowerCase(),
      participantsHash.toLowerCase(),
    );
  }

  public get participants() {
    return this.#participants;
  }

  public setParticipants(newParticipants: string[]) {
    this.#participants = newParticipants;
  }
}

export enum State {
  None,
  Created,
  Updated,
  Revoked,
}

export enum Validity {
  Valid,
  Revoked,
  Expired,
  Invalid,
}
