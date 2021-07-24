import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import type { Contract } from "ethers";
import { ethers } from "hardhat";
import { defineTestData, oneYearFromNow, State, testId } from "./helper/data";

const create = defineTestData("Workshop HTML", 0);
const update = defineTestData("Workshop CSS", oneYearFromNow, [
  "0x3f9ce16dfc1858f7356f63c4ddf27900b00b5f61a86ae33e6dbb4a8c7c33b1b7",
]);

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
        .create(testId, create.name, create.expiredAt, create.participants);

      return expect(createTx).to.be.rejected;
    });

    it("Should return an error when creating on existing certificate", async () => {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants
      );
      await createTx.wait();

      const createTx2 = certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants
      );

      return expect(createTx2).to.be.rejected;
    });

    it("Should return an error when expiredAt invalid", async () => {
      const recentBlock = await ethers.provider.getBlockNumber();
      const { timestamp } = await ethers.provider.getBlock(recentBlock);

      const createTx = certificateManager.create(
        testId,
        create.name,
        timestamp - 1,
        create.participants
      );

      return expect(createTx).to.be.rejected;
    });

    it("Should successfully creating a certificate", async () => {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants
      );
      const { blockNumber } = await createTx.wait();

      const { timestamp } = await ethers.provider.getBlock(blockNumber);

      const certificate = await certificateManager.getCertificate(testId);
      const participants = await certificateManager.getParticipants(testId);

      expect(certificate[0]).to.equal(create.name);
      expect(certificate[1]).to.be.a.bignumber.that.equal(create.expiredAt);
      expect(certificate[2]).to.be.a.bignumber.that.equal(timestamp);
      expect(certificate[3]).to.equal(State.Created);
      expect(certificate[4]).to.equal(create.metadataHash);
      expect(certificate[5]).to.equal(create.participantsHash);
      expect(participants).to.eql(create.participants);
    });
  });

  describe("revoke()", () => {
    beforeEach(async () => {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants
      );
      await createTx.wait();
    });

    it("Should return an error when run by not the owner", () => {
      const revokeTx = certificateManager.connect(addr1).revoke(testId);

      return expect(revokeTx).to.be.rejected;
    });

    it("Should return an error when certificate not found", () => {
      const revokeTx = certificateManager.revoke(2);

      return expect(revokeTx).to.be.rejected;
    });

    it("Should successfully revoke a certificate", async () => {
      const revokeTx = await certificateManager.revoke(testId);
      await revokeTx.wait();

      const [, , , state] = await certificateManager.getCertificate(testId);
      expect(state).to.be.equal(State.Revoked);
    });
  });

  describe("update()", () => {
    beforeEach(async () => {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants
      );
      await createTx.wait();
    });

    it("Should return an error when run by not the owner", () => {
      const updateTx = certificateManager
        .connect(addr1)
        .update(testId, update.name, update.expiredAt, update.participants);

      return expect(updateTx).to.be.rejected;
    });

    it("Should return an error when certificate not found", () => {
      const updateTx = certificateManager.update(
        2,
        update.name,
        update.expiredAt,
        update.participants
      );

      return expect(updateTx).to.be.rejected;
    });

    it("Should return an error when certificate revoked", async () => {
      const revokeTx = await certificateManager.revoke(testId);
      await revokeTx.wait();

      const updateTx = certificateManager.update(
        testId,
        update.name,
        update.expiredAt,
        update.participants
      );

      return expect(updateTx).to.be.rejected;
    });

    it("Should return an error when expiredAt invalid", async () => {
      const [, , createdAt] = await certificateManager.getCertificate(testId);

      const updateTx = certificateManager.update(
        testId,
        update.name,
        createdAt - 1,
        update.participants
      );

      return expect(updateTx).to.be.rejected;
    });

    it("Should successfully updating a certificate", async () => {
      const updateTx = await certificateManager.update(
        testId,
        update.name,
        update.expiredAt,
        update.participants
      );
      await updateTx.wait();

      const certificate = await certificateManager.getCertificate(testId);
      const participants = await certificateManager.getParticipants(testId);

      expect(certificate[0]).to.equal(update.name);
      expect(certificate[1]).to.be.a.bignumber.that.equal(update.expiredAt);
      expect(certificate[3]).to.equal(State.Updated);
      expect(certificate[4]).to.equal(update.metadataHash);
      expect(certificate[5]).to.equal(update.participantsHash);
      expect(participants).to.eql(update.participants);
    });
  });
});
