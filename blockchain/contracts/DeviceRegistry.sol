// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title DeviceRegistry
/// @notice Stores a verifiable, privacy-preserving record of registered devices,
///         their ownership, and their recovery-case lifecycle status.
/// @dev BC-002: adds ownership transfer and recovery status anchoring on top
///      of the BC-001 registration scaffold.
contract DeviceRegistry {
    /// @dev Transitions must move strictly forward. CaseClosed is terminal.
    enum RecoveryStatus {
        Registered,
        Verified,
        ReportedLost,
        RecoveryStarted,
        Found,
        OwnershipConfirmed,
        CaseClosed
    }

    struct Device {
        bytes32 deviceHash;
        address owner;
        uint256 registeredAt;
        RecoveryStatus status;
        bool exists;
    }

    mapping(uint256 => Device) private devices;
    uint256 private nextDeviceId;

    event DeviceRegistered(
        uint256 indexed deviceId,
        address indexed owner,
        bytes32 deviceHash,
        uint256 registeredAt
    );

    event OwnershipTransferred(
        uint256 indexed deviceId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 transferredAt
    );

    event RecoveryStatusUpdated(
        uint256 indexed deviceId,
        RecoveryStatus previousStatus,
        RecoveryStatus newStatus,
        uint256 updatedAt
    );

    modifier onlyDeviceOwner(uint256 deviceId) {
        require(devices[deviceId].exists, "DeviceRegistry: device does not exist");
        require(devices[deviceId].owner == msg.sender, "DeviceRegistry: caller is not the device owner");
        _;
    }

    function registerDevice(bytes32 deviceHash) external returns (uint256 deviceId) {
        require(deviceHash != bytes32(0), "DeviceRegistry: deviceHash cannot be empty");

        deviceId = nextDeviceId;
        devices[deviceId] = Device({
            deviceHash: deviceHash,
            owner: msg.sender,
            registeredAt: block.timestamp,
            status: RecoveryStatus.Registered,
            exists: true
        });

        nextDeviceId++;

        emit DeviceRegistered(deviceId, msg.sender, deviceHash, block.timestamp);
    }

    function transferOwnership(uint256 deviceId, address newOwner)
        external
        onlyDeviceOwner(deviceId)
    {
        require(newOwner != address(0), "DeviceRegistry: newOwner cannot be the zero address");
        require(newOwner != msg.sender, "DeviceRegistry: newOwner must differ from current owner");

        address previousOwner = devices[deviceId].owner;
        devices[deviceId].owner = newOwner;

        emit OwnershipTransferred(deviceId, previousOwner, newOwner, block.timestamp);
    }

    function updateRecoveryStatus(uint256 deviceId, RecoveryStatus newStatus)
        external
        onlyDeviceOwner(deviceId)
    {
        RecoveryStatus currentStatus = devices[deviceId].status;

        require(currentStatus != RecoveryStatus.CaseClosed, "DeviceRegistry: case is already closed");
        require(newStatus > currentStatus, "DeviceRegistry: status must move forward");

        devices[deviceId].status = newStatus;

        emit RecoveryStatusUpdated(deviceId, currentStatus, newStatus, block.timestamp);
    }

    function getDevice(uint256 deviceId)
        external
        view
        returns (bytes32 deviceHash, address owner, uint256 registeredAt, RecoveryStatus status)
    {
        require(devices[deviceId].exists, "DeviceRegistry: device does not exist");
        Device storage d = devices[deviceId];
        return (d.deviceHash, d.owner, d.registeredAt, d.status);
    }

    function totalDevices() external view returns (uint256) {
        return nextDeviceId;
    }
}