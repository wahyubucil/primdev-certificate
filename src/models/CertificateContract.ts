import { BigNumber } from 'ethers';

export class CertificateContract {
  #participants: string[] | null = null;

  public constructor(
    public readonly name: string,
    public readonly expiredAt: BigNumber,
    public readonly createdAt: BigNumber,
    public readonly state: State,
    public readonly metadataHash: string,
    public readonly participantsHash: string,
  ) {}

  static fromGetter(
    data: [string, BigNumber, BigNumber, number, string, string],
  ) {
    return new CertificateContract(...data);
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
