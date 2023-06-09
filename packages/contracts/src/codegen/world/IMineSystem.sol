// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

import { ResourceType } from "./../Types.sol";

interface IMineSystem {
  function mine(uint32 x, uint32 y) external;

  function collectResource(ResourceType resource, bytes32 player) external returns (bool);
}
