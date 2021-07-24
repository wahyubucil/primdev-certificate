import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import type { Contract } from "ethers";
import { ethers } from "hardhat";
import {
  State,
  testExpiredAt,
  testId,
  testMetadataHash,
  testName,
  testParticipants,
  testParticipantsHash,
} from "./helper/data";

describe("CertificateManager", () => {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let certificateManager: Contract;

  before(async () => {
    const [owner, addr1] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const CertificateManager = await ethers.getContractFactory(
      "CertificateManager"
    );
    certificateManager = await CertificateManager.deploy();
    await certificateManager.deployed();
  });

  describe("create()", () => {
    it("Should return an error when run by not the owner", () => {
      const createTx = certificateManager
        .connect(addr1)
        .create(testId, testName, testExpiredAt, testParticipants);

      return expect(createTx).to.be.rejected;
    });

    it("Should return an error when creating on existing certificate", async () => {
      const createTx = await certificateManager.create(
        testId,
        testName,
        testExpiredAt,
        testParticipants
      );
      await createTx.wait();

      const createTx2 = certificateManager.create(
        testId,
        testName,
        testExpiredAt,
        testParticipants
      );

      return expect(createTx2).to.be.rejected;
    });

    it("Should return an error when expiredAt invalid", () => {
      const createTx = certificateManager.create(
        testId,
        testName,
        1,
        testParticipants
      );

      return expect(createTx).to.be.rejected;
    });

    it("Should successfully creating a certificate", async () => {
      const createTx = await certificateManager.create(
        testId,
        testName,
        testExpiredAt,
        testParticipants
      );
      const { blockNumber } = await createTx.wait();

      const { timestamp } = await ethers.provider.getBlock(blockNumber);

      const certificate = await certificateManager.getCertificate(testId);
      const participants = await certificateManager.getParticipants(testId);

      expect(certificate[0]).to.equal(testName);
      expect(certificate[1]).to.be.a.bignumber.that.equal(testExpiredAt);
      expect(certificate[2]).to.be.a.bignumber.that.equal(timestamp);
      expect(certificate[3]).to.equal(State.Created);
      expect(certificate[4]).to.equal(testMetadataHash);
      expect(certificate[5]).to.equal(testParticipantsHash);
      expect(participants).to.eql(testParticipants);
    });
  });
});
