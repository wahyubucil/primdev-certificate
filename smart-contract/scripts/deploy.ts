import { run, ethers, network } from 'hardhat';

async function main() {
  await run('compile');

  const [deployer] = await ethers.getSigners();
  console.log('\nStart Deploy----------------------------------------');
  console.log('Network:', network.name);
  console.log('Deploying contracts with the account:', deployer.address);
  const startingBalance = await deployer.getBalance();
  console.log(
    'Account starting balance:',
    ethers.utils.formatEther(startingBalance).toString() + ' ETH',
  );

  // We get the contract to deploy
  console.log('\n----------------------------------------------------');
  console.log('CertificateManager');
  const CertificateManager = await ethers.getContractFactory(
    'CertificateManager',
  );
  const certificateManager = await CertificateManager.deploy();
  await certificateManager.deployed();
  console.log('Deployed to:', certificateManager.address);
  console.log('----------------------------------------------------');

  const endingBalance = await deployer.getBalance();
  console.log(
    '\nAccount ending balance:',
    ethers.utils.formatEther(endingBalance).toString() + ' ETH',
  );
  console.log('End Deploy------------------------------------------');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
