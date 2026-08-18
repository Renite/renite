import { expect } from "chai";
import hre from "hardhat";

const { ethers } = await hre.network.create();

describe("DeviceRegistry", function () {
  async function deployDeviceRegistryFixture() {
    const registry = await ethers.deployContract("DeviceRegistry");
    return { registry };
  }

  it("Should register a device and emit DeviceRegistered", async function () {
    const { registry } = await deployDeviceRegistryFixture();

    const deviceHash = ethers.keccak256(ethers.toUtf8Bytes("test-device-serial-123"));

    await expect(registry.registerDevice(deviceHash))
      .to.emit(registry, "DeviceRegistered");
  });

  it("Should assign sequential device IDs starting at 0", async function () {
    const { registry } = await deployDeviceRegistryFixture();

    const hash1 = ethers.keccak256(ethers.toUtf8Bytes("device-1"));
    const hash2 = ethers.keccak256(ethers.toUtf8Bytes("device-2"));

    await registry.registerDevice(hash1);
    await registry.registerDevice(hash2);

    expect(await registry.totalDevices()).to.equal(2n);
  });

  it("Should store the correct owner and hash for a registered device", async function () {
    const { registry } = await deployDeviceRegistryFixture();
    const [signer] = await ethers.getSigners();

    const deviceHash = ethers.keccak256(ethers.toUtf8Bytes("device-owner-check"));
    await registry.registerDevice(deviceHash);

    const [storedHash, storedOwner] = await registry.getDevice(0);
    expect(storedHash).to.equal(deviceHash);
    expect(storedOwner).to.equal(signer.address);
  });

  it("Should revert when registering with an empty deviceHash", async function () {
    const { registry } = await deployDeviceRegistryFixture();

    await expect(
      registry.registerDevice(ethers.ZeroHash)
    ).to.be.revertedWith("DeviceRegistry: deviceHash cannot be empty");
  });

  it("Should revert when looking up a device that does not exist", async function () {
    const { registry } = await deployDeviceRegistryFixture();

    await expect(registry.getDevice(999)).to.be.revertedWith(
      "DeviceRegistry: device does not exist"
    );
  });

  describe("Ownership transfer", function () {
    it("Should transfer ownership to a new address", async function () {
      const { registry } = await deployDeviceRegistryFixture();
      const [, newOwner] = await ethers.getSigners();
      const deviceHash = ethers.keccak256(ethers.toUtf8Bytes("device-transfer-1"));

      await registry.registerDevice(deviceHash);
      await expect(registry.transferOwnership(0, newOwner.address))
        .to.emit(registry, "OwnershipTransferred");

      const [, storedOwner] = await registry.getDevice(0);
      expect(storedOwner).to.equal(newOwner.address);
    });

    it("Should revert when a non-owner attempts to transfer ownership", async function () {
      const { registry } = await deployDeviceRegistryFixture();
      const [, attacker] = await ethers.getSigners();
      const deviceHash = ethers.keccak256(ethers.toUtf8Bytes("device-transfer-2"));

      await registry.registerDevice(deviceHash);

      await expect(
        registry.connect(attacker).transferOwnership(0, attacker.address)
      ).to.be.revertedWith("DeviceRegistry: caller is not the device owner");
    });

    it("Should revert when transferring to the zero address", async function () {
      const { registry } = await deployDeviceRegistryFixture();
      const deviceHash = ethers.keccak256(ethers.toUtf8Bytes("device-transfer-3"));

      await registry.registerDevice(deviceHash);

      await expect(
        registry.transferOwnership(0, ethers.ZeroAddress)
      ).to.be.revertedWith("DeviceRegistry: newOwner cannot be the zero address");
    });
  });

  describe("Recovery status transitions", function () {
    it("Should advance status forward and emit RecoveryStatusUpdated", async function () {
      const { registry } = await deployDeviceRegistryFixture();
      const deviceHash = ethers.keccak256(ethers.toUtf8Bytes("device-status-1"));

      await registry.registerDevice(deviceHash);

      await expect(registry.updateRecoveryStatus(0, 1))
        .to.emit(registry, "RecoveryStatusUpdated");

      const [, , , status] = await registry.getDevice(0);
      expect(status).to.equal(1n);
    });

    it("Should revert when moving status backward", async function () {
      const { registry } = await deployDeviceRegistryFixture();
      const deviceHash = ethers.keccak256(ethers.toUtf8Bytes("device-status-2"));

      await registry.registerDevice(deviceHash);
      await registry.updateRecoveryStatus(0, 2);

      await expect(
        registry.updateRecoveryStatus(0, 1)
      ).to.be.revertedWith("DeviceRegistry: status must move forward");
    });

    it("Should revert when updating status after case is closed", async function () {
      const { registry } = await deployDeviceRegistryFixture();
      const deviceHash = ethers.keccak256(ethers.toUtf8Bytes("device-status-3"));

      await registry.registerDevice(deviceHash);
      await registry.updateRecoveryStatus(0, 6);

      await expect(
        registry.updateRecoveryStatus(0, 6)
      ).to.be.revertedWith("DeviceRegistry: case is already closed");
    });

    it("Should revert when a non-owner attempts to update status", async function () {
      const { registry } = await deployDeviceRegistryFixture();
      const [, attacker] = await ethers.getSigners();
      const deviceHash = ethers.keccak256(ethers.toUtf8Bytes("device-status-4"));

      await registry.registerDevice(deviceHash);

      await expect(
        registry.connect(attacker).updateRecoveryStatus(0, 1)
      ).to.be.revertedWith("DeviceRegistry: caller is not the device owner");
    });
  });
});