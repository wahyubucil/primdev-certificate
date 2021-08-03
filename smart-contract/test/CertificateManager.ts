import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import type {
  CertificateManager,
  CertificateManager__factory,
} from '../../src/contract-types';
import {
  defineTestData,
  oneYearFromNow,
  State,
  testId,
  Validity,
} from './helper/data';

const create = defineTestData('Workshop HTML', 0);
const update = defineTestData('Workshop CSS', oneYearFromNow, [
  '0x3f9ce16dfc1858f7356f63c4ddf27900b00b5f61a86ae33e6dbb4a8c7c33b1b7',
]);

describe('CertificateManager', function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let certificateManager: CertificateManager;

  before(async function () {
    [owner, addr1] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const CertificateManager = (await ethers.getContractFactory(
      'CertificateManager',
      owner,
    )) as CertificateManager__factory;
    certificateManager = await CertificateManager.deploy();
    await certificateManager.deployed();
  });

  describe('create()', function () {
    it('Should return an error when run by not the owner', function () {
      const createTx = certificateManager
        .connect(addr1)
        .create(testId, create.name, create.expiredAt, create.participants);

      return expect(createTx).to.be.rejected;
    });

    it('Should return an error when creating on existing certificate', async function () {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants,
      );
      await createTx.wait();

      const createTx2 = certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants,
      );

      return expect(createTx2).to.be.rejected;
    });

    it('Should return an error when expiredAt invalid', async function () {
      const recentBlock = await ethers.provider.getBlockNumber();
      const { timestamp } = await ethers.provider.getBlock(recentBlock);

      const createTx = certificateManager.create(
        testId,
        create.name,
        timestamp - 1,
        create.participants,
      );

      return expect(createTx).to.be.rejected;
    });

    it('Should successfully creating a certificate', async function () {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants,
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

  describe('revoke()', function () {
    beforeEach(async function () {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants,
      );
      await createTx.wait();
    });

    it('Should return an error when run by not the owner', function () {
      const revokeTx = certificateManager.connect(addr1).revoke(testId);

      return expect(revokeTx).to.be.rejected;
    });

    it('Should return an error when certificate not found', function () {
      const revokeTx = certificateManager.revoke(testId + 1);

      return expect(revokeTx).to.be.rejected;
    });

    it('Should successfully revoke a certificate', async function () {
      const revokeTx = await certificateManager.revoke(testId);
      await revokeTx.wait();

      const [, , , state] = await certificateManager.getCertificate(testId);
      expect(state).to.be.equal(State.Revoked);
    });
  });

  describe('update()', function () {
    beforeEach(async function () {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants,
      );
      await createTx.wait();
    });

    it('Should return an error when run by not the owner', function () {
      const updateTx = certificateManager
        .connect(addr1)
        .update(testId, update.name, update.expiredAt, update.participants);

      return expect(updateTx).to.be.rejected;
    });

    it('Should return an error when certificate not found', function () {
      const updateTx = certificateManager.update(
        testId + 1,
        update.name,
        update.expiredAt,
        update.participants,
      );

      return expect(updateTx).to.be.rejected;
    });

    it('Should return an error when certificate revoked', async function () {
      const revokeTx = await certificateManager.revoke(testId);
      await revokeTx.wait();

      const updateTx = certificateManager.update(
        testId,
        update.name,
        update.expiredAt,
        update.participants,
      );

      return expect(updateTx).to.be.rejected;
    });

    it('Should return an error when expiredAt invalid', async function () {
      const [, , createdAt] = await certificateManager.getCertificate(testId);

      const updateTx = certificateManager.update(
        testId,
        update.name,
        createdAt.sub(1),
        update.participants,
      );

      return expect(updateTx).to.be.rejected;
    });

    it('Should successfully updating a certificate', async function () {
      const updateTx = await certificateManager.update(
        testId,
        update.name,
        update.expiredAt,
        update.participants,
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

  describe('updateMetadata()', function () {
    beforeEach(async function () {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants,
      );
      await createTx.wait();
    });

    it('Should return an error when run by not the owner', function () {
      const updateMetadataTx = certificateManager
        .connect(addr1)
        .updateMetadata(testId, update.name, update.expiredAt);

      return expect(updateMetadataTx).to.be.rejected;
    });

    it('Should return an error when certificate not found', function () {
      const updateMetadataTx = certificateManager.updateMetadata(
        testId + 1,
        update.name,
        update.expiredAt,
      );

      return expect(updateMetadataTx).to.be.rejected;
    });

    it('Should return an error when certificate revoked', async function () {
      const revokeTx = await certificateManager.revoke(testId);
      await revokeTx.wait();

      const updateMetadataTx = certificateManager.updateMetadata(
        testId,
        update.name,
        update.expiredAt,
      );

      return expect(updateMetadataTx).to.be.rejected;
    });

    it('Should return an error when expiredAt invalid', async function () {
      const [, , createdAt] = await certificateManager.getCertificate(testId);

      const updateMetadataTx = certificateManager.updateMetadata(
        testId,
        update.name,
        createdAt.sub(1),
      );

      return expect(updateMetadataTx).to.be.rejected;
    });

    it('Should successfully updating a certificate', async function () {
      const updateMetadataTx = await certificateManager.updateMetadata(
        testId,
        update.name,
        update.expiredAt,
      );
      await updateMetadataTx.wait();

      const certificate = await certificateManager.getCertificate(testId);

      expect(certificate[0]).to.equal(update.name);
      expect(certificate[1]).to.be.a.bignumber.that.equal(update.expiredAt);
      expect(certificate[3]).to.equal(State.Updated);
      expect(certificate[4]).to.equal(update.metadataHash);
    });
  });

  describe('updateParticipants()', function () {
    beforeEach(async function () {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants,
      );
      await createTx.wait();
    });

    it('Should return an error when run by not the owner', function () {
      const updateParticipantsTx = certificateManager
        .connect(addr1)
        .updateParticipants(testId, update.participants);

      return expect(updateParticipantsTx).to.be.rejected;
    });

    it('Should return an error when certificate not found', function () {
      const updateParticipantsTx = certificateManager.updateParticipants(
        testId + 1,
        update.participants,
      );

      return expect(updateParticipantsTx).to.be.rejected;
    });

    it('Should return an error when certificate revoked', async function () {
      const revokeTx = await certificateManager.revoke(testId);
      await revokeTx.wait();

      const updateParticipantsTx = certificateManager.updateParticipants(
        testId,
        update.participants,
      );

      return expect(updateParticipantsTx).to.be.rejected;
    });

    it('Should successfully updating a certificate', async function () {
      const updateParticipantsTx = await certificateManager.updateParticipants(
        testId,
        update.participants,
      );
      await updateParticipantsTx.wait();

      const participants = await certificateManager.getParticipants(testId);

      expect(participants).to.eql(update.participants);
    });
  });

  describe('remove()', function () {
    beforeEach(async function () {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        create.participants,
      );
      await createTx.wait();
    });

    it('Should return an error when run by not the owner', function () {
      const removeTx = certificateManager.connect(addr1).remove(testId);

      return expect(removeTx).to.be.rejected;
    });

    it('Should return an error when certificate not found', function () {
      const removeTx = certificateManager.remove(testId + 1);

      return expect(removeTx).to.be.rejected;
    });

    it('Should successfully remove a certificate', async function () {
      const removeTx = await certificateManager.remove(testId);
      await removeTx.wait();

      const getData = certificateManager.getCertificate(testId);
      return expect(getData).to.be.rejected;
    });
  });

  describe('checkValidity()', function () {
    beforeEach(async function () {
      const createTx = await certificateManager.create(
        testId,
        create.name,
        create.expiredAt,
        update.participants,
      );
      await createTx.wait();
    });

    it('Should return an error when certificate not found', function () {
      const checkValidity = certificateManager.checkValidity(
        testId + 1,
        'i gede wahyu budi saputra',
      );

      return expect(checkValidity).to.be.rejected;
    });

    it('Should return Invalid when the inputted name does not have the certificate', async function () {
      const validity = await certificateManager.checkValidity(
        testId,
        'wahyu budi saputra',
      );

      expect(validity).to.equal(Validity.Invalid);
    });

    it('Should return Revoked when certificate state revoked', async function () {
      const revokeTx = await certificateManager.revoke(testId);
      await revokeTx.wait();

      const validity = await certificateManager.checkValidity(
        testId,
        'i gede wahyu budi saputra',
      );

      expect(validity).to.equal(Validity.Revoked);
    });

    it('Should return Expired when certificate already expired', async function () {
      const [, , createdAt] = await certificateManager.getCertificate(testId);

      const updateMetadataTx = await certificateManager.updateMetadata(
        testId,
        create.name,
        createdAt.add(1),
      );
      await updateMetadataTx.wait();

      // Create dummy transaction to trigger new block
      const sendMoneyTx = await owner.sendTransaction({
        from: owner.address,
        to: addr1.address,
        value: ethers.utils.parseEther('1.0'),
        nonce: owner.getTransactionCount(),
        gasLimit: ethers.utils.hexlify(100000),
        gasPrice: ethers.provider.getGasPrice(),
      });
      await sendMoneyTx.wait();

      const validity = await certificateManager.checkValidity(
        testId,
        'i gede wahyu budi saputra',
      );

      expect(validity).to.equal(Validity.Expired);
    });

    it('Should return Valid when the inputted name is one of the certificate participants', async function () {
      const validity = await certificateManager.checkValidity(
        testId,
        'i gede wahyu budi saputra',
      );

      expect(validity).to.equal(Validity.Valid);
    });
  });
});
