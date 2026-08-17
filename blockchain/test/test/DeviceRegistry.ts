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
});