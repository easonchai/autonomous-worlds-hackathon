// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

interface IMineSystem {
  function mine(uint32 x, uint32 y) external;

  function collectResource(bytes32 position, bytes32 player) external returns (bool);
}