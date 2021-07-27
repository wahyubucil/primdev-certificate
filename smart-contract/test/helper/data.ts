import { ethers } from "ethers";

const sampleParticipants = [
  "0x38723d65564e735ff2e39a979cc2d67195bad524e99ce51664d0cba01e83fd23",
  "0x43278b4cbdd34ecb4b5de3bc1e59b360140dd9730c7fb3a99e893685077ac50c",
  "0x2394727f2e3d29ce33db4d01a3429e025c1d15a89f5d82d23e13dbdc7ce87fdf",
  "0x9a7ec11f6cdb2b40c849987384d3c0e2ffa8901c40bfb45b795e504ee407ea5e",
  "0x58fe34057072aea5b33a6417e91237c474539370d4d1707986496a8b84978db2",
  "0x4d777cd760244c3370b85501895b96665193bc5479b154d041510c26e845b43c",
  "0x961d6fcef7bfa00cd12150f1860758d1897320fe2918dca5455036eb0b40a3f3",
  "0xf5bd7a37bb41fc3a18439f69e2a80d07d601f56f47a0c46863bffd5d7b3a86f2",
  "0x95a9b56d0df3aa16293117853115dbd7ad736d62b392ea75c00f736ccbc7e6f0",
  "0x821298f41fbbc52cfe7b9587867e58191b3f63b95b26358b9ca521b6a4fc7cb5",
  "0xbf1e1b922d46a7f6fc782f4ddc531eab563ec17080352123311bd7bdcf7881c7",
  "0x4454b5be8d5a96946c7a314921c6536de495a1523d82a1305966f2ab2a39fe5b",
  "0x2f9ea666769d9f9cabac7abb162e9e74cacc1d4ac5efbce3345a746b0df1de46",
  "0x5fef98b216de2f0e4906bf695b20445be5632955dcc148991a413794e7b5aeb4",
  "0xa4bb46013785bd158ed7f298fe7e394a69c97292a50a7024b96eb1a21c7e965e",
  "0x49d8eaf35eae401d527d84c52b78bb00116d9dc88769a99d115c767a5da0cb84",
  "0x73e00c735be5cc8217ed0de7cbb66c6602864f6b1c57382cac28bb5140b1f1c3",
  "0xd034f724e9340ef039309408651382461fbedba29e93671582c94d9f07385b17",
  "0x0e68cf91997659e57fcb2e21bfd536f14de47cb3039eb4fc10892f411aa4586b",
  "0xf03ee3044b8c1c41c8860b053308d848d8aa4c9f3aa467b181a28b9e8ed53ffb",
  "0xb0c48d407370fe06958d47b5a06a401b309e30db20cff42e084760e787b755e5",
  "0xf31102885c20999d9cc53710b9dc70672930fe6a272da972bf77f24953558b14",
  "0xf2b965a3d484c1b234cf2b7e479b37e1f01a7f9a02799e9c25dd5fc0ca9d7034",
  "0x8c604c03cd7ac89b9ade80c573401e8f05a6d83e9fd0f76a9815a6a98ea6aa22",
];

export const testId = 1;

export function defineTestData(
  name: string,
  expiredAt: number,
  additionalParticipants?: string[]
) {
  const participants = additionalParticipants
    ? [...sampleParticipants, ...additionalParticipants]
    : sampleParticipants;

  const metadataHash = ethers.utils.keccak256(
    ethers.utils.solidityPack(["string", "uint256"], [name, expiredAt])
  );

  const participantsHash = ethers.utils.keccak256(
    ethers.utils.solidityPack(
      Array(participants.length).fill("bytes32"),
      participants
    )
  );

  return {
    name,
    expiredAt,
    participants,
    metadataHash,
    participantsHash,
  };
}

export const enum State {
  None,
  Created,
  Updated,
  Revoked,
}

export const enum Validity {
  Valid,
  Revoked,
  Expired,
  Invalid,
}

export const oneYearFromNow = Math.floor(Date.now() / 1000) + 31556926;
