// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title DeviceRegistry
/// @notice Stores a verifiable, privacy-preserving record of registered devices.
/// @dev BC-001: initial scaffold only. Ownership transfer and recovery events
///      are intentionally NOT implemented here - see future issues.
contract DeviceRegistry {
    /// @notice Core record for a registered device.
    /// @dev Do NOT store raw serial numbers, MAC addresses, or IMEI here.
    ///      `deviceHash` should be a hash (e.g. keccak256) computed off-chain
    ///      from the device's real identifiers, so the chain only ever holds
    ///      a verifiable fingerprint, never the sensitive data itself.
    struct Device {
        bytes32 deviceHash;   // hash of serial/MAC/IMEI, computed off-chain
        address owner;        // wallet address of the registering owner
        uint256 registeredAt; // block timestamp of registration
        bool exists;          // guards against unregistered lookups
    }

    /// @dev deviceId => Device record. deviceId is assigned sequentially.
    mapping(uint256 => Device) private devices;

    /// @dev Tracks the next deviceId to assign.
    uint256 private nextDeviceId;

    /// @notice Emitted when a new device is registered.
    event DeviceRegistered(
        uint256 indexed deviceId,
        address indexed owner,
        bytes32 deviceHash,
        uint256 registeredAt
    );

    /// @notice Registers a new device on-chain.
    /// @param deviceHash A hash representing the device's real-world identifiers.
    ///        Must be computed off-chain (e.g. keccak256(serial + mac + salt))
    ///        so no sensitive raw data ever touches the chain.
    /// @return deviceId The ID assigned to this newly registered device.
    function registerDevice(bytes32 deviceHash) external returns (uint256 deviceId) {
        require(deviceHash != bytes32(0), "DeviceRegistry: deviceHash cannot be empty");

        deviceId = nextDeviceId;
        devices[deviceId] = Device({
            deviceHash: deviceHash,
            owner: msg.sender,
            registeredAt: block.timestamp,
            exists: true
        });

        nextDeviceId++;

        emit DeviceRegistered(deviceId, msg.sender, deviceHash, block.timestamp);
    }

    /// @notice Reads back a registered device's record.
    /// @param deviceId The ID of the device to look up.
    function getDevice(uint256 deviceId)
        external
        view
        returns (bytes32 deviceHash, address owner, uint256 registeredAt)
    {
        require(devices[deviceId].exists, "DeviceRegistry: device does not exist");
        Device storage d = devices[deviceId];
        return (d.deviceHash, d.owner, d.registeredAt);
    }

    /// @notice Total number of devices registered so far.
    function totalDevices() external view returns (uint256) {
        return nextDeviceId;
    }
}
