// src/services/blockchain.js
// Handles MetaMask connection, off-chain hash computation, on-chain registration,
// and on-chain verification against DeviceRegistry.sol.

import { ethers } from 'ethers';
import { DEVICE_REGISTRY_ADDRESS, DEVICE_REGISTRY_ABI } from '../config/deviceRegistry';

/**
 * Computes an off-chain keccak256 hash from raw device identifiers.
 * The salt prevents rainbow-table attacks on serial numbers.
 *
 * @param {string} serialNumber - Device serial number (required)
 * @param {string} macAddress   - MAC address (optional, pass '' if absent)
 * @param {string} salt         - Application-level salt (default: 'renite-safety')
 * @returns {string} 0x-prefixed bytes32 hex string
 */
export function computeDeviceHash(serialNumber, macAddress = '', salt = 'renite-safety') {
  const combined = `${serialNumber.trim()}-${macAddress.trim()}-${salt}`;
  return ethers.keccak256(ethers.toUtf8Bytes(combined));
}

/**
 * Registers a device on-chain via MetaMask.
 * Waits for 1 block confirmation, then parses the DeviceRegistered event
 * to extract the assigned on-chain deviceId.
 *
 * @param {string} deviceHash - bytes32 hex string from computeDeviceHash()
 * @returns {{ txHash: string, ownerWallet: string, onChainId: string, blockNumber: number }}
 * @throws {Error} If MetaMask is absent, user rejects the tx, or log parsing fails
 */
export async function registerDeviceOnChain(deviceHash) {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install it at metamask.io.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const ownerWallet = await signer.getAddress();

  const contract = new ethers.Contract(
    DEVICE_REGISTRY_ADDRESS,
    DEVICE_REGISTRY_ABI,
    signer
  );

  // Submit the transaction — MetaMask will prompt the user to sign
  const tx = await contract.registerDevice(deviceHash);

  // Wait for the transaction to be mined (1 confirmation)
  const receipt = await tx.wait();

  // Parse the DeviceRegistered event to get the assigned on-chain ID
  let onChainId = null;
  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed && parsed.name === 'DeviceRegistered') {
        onChainId = parsed.args.deviceId.toString();
        break;
      }
    } catch {
      // Skip logs emitted by other contracts in the same block
    }
  }

  if (!onChainId) {
    throw new Error('Transaction mined but DeviceRegistered event not found in logs.');
  }

  return {
    txHash: receipt.hash,
    ownerWallet,
    onChainId,
    blockNumber: receipt.blockNumber,
  };
}

/**
 * Verifies that a Supabase device record matches what is stored on-chain.
 * Useful for tamper-detection: if the hashes differ, the off-chain record was altered.
 *
 * @param {string|number} onChainId   - The on_chain_id stored in Supabase
 * @param {string}        expectedHash - The device_hash stored in Supabase
 * @returns {{ isVerified: boolean, onChainOwner: string, registeredAt: string }}
 */
export async function verifyDeviceOnChain(onChainId, expectedHash) {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    DEVICE_REGISTRY_ADDRESS,
    DEVICE_REGISTRY_ABI,
    provider
  );

  const [deviceHash, owner, registeredAt] = await contract.getDevice(onChainId);

  return {
    isVerified: deviceHash.toLowerCase() === expectedHash.toLowerCase(),
    onChainOwner: owner,
    registeredAt: new Date(Number(registeredAt) * 1000).toLocaleString(),
  };
}
