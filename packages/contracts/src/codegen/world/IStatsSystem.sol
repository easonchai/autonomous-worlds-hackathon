// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

interface IStatsSystem {
  function getHungerTimestamp() external view returns (uint256);

  function getThirstTimestamp() external view returns (uint256);

  function getHungerTimestamp(bytes32 player) external view returns (uint256);

  function getThirstTimestamp(bytes32 player) external view returns (uint256);

  function timeTillHungry() external view returns (uint256);

  function timeTillThirsty() external view returns (uint256);

  function hungrySince(bytes32 player) external view returns (uint256);

  function thirstySince(bytes32 player) external view returns (uint256);

  function getDamage() external view returns (uint32);

  function getHealth() external view returns (uint32);
}
