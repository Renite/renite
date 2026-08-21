// src/config/deviceRegistry.js
// Replace DEVICE_REGISTRY_ADDRESS with your deployed contract address after running:
//   npx hardhat run scripts/deploy.ts --network <yourNetwork>

export const DEVICE_REGISTRY_ADDRESS = "0xYourDeployedContractAddressHere";

export const DEVICE_REGISTRY_ABI = [
  "function registerDevice(bytes32 deviceHash) external returns (uint256 deviceId)",
  "function getDevice(uint256 deviceId) external view returns (bytes32 deviceHash, address owner, uint256 registeredAt)",
  "function totalDevices() external view returns (uint256)",
  "event DeviceRegistered(uint256 indexed deviceId, address indexed owner, bytes32 deviceHash, uint256 registeredAt)"
];
