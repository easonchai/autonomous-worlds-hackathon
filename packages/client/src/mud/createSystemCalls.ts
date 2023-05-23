import { Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { uuid, awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Direction } from "../layers/phaser/constants";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { playerEntity, singletonEntity, worldSend, txReduced$ }: SetupNetworkResult,
  { MapConfig, Obstruction, Player, Position, Mineable }: ClientComponents
) {
  const wrapPosition = (x: number, y: number) => {
    // const mapConfig = getComponentValue(MapConfig, singletonEntity);
    // if (!mapConfig) {
    //   throw new Error("mapConfig no yet loaded or initialized");
    // }
    // return [
    //   (x + mapConfig.width) % mapConfig.width,
    //   (y + mapConfig.height) % mapConfig.height,
    // ];

    return [x, y];
  };

  const isObstructed = (x: number, y: number) => {
    return runQuery([Has(Obstruction), HasValue(Position, { x, y })]).size > 0;
  };

  const isMineable = (x: number, y: number) => {
    return runQuery([Has(Mineable), HasValue(Position, { x, y })]).size > 0;
  };

  const move = async (direction: Direction) => {
    worldSend("move", [direction]);
  }

  const moveTo = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const [x, y] = wrapPosition(inputX, inputY);
    if (isObstructed(x, y)) {
      console.warn("cannot move to obstructed space");
      return;
    }
    const tx = await worldSend("move", [x, y]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const moveBy = async (deltaX: number, deltaY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const playerPosition = getComponentValue(Position, playerEntity);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }

    await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
  };

  const spawn = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const canSpawn = getComponentValue(Player, playerEntity)?.value !== true;
    if (!canSpawn) {
      throw new Error("already spawned");
    }

    const [x, y] = wrapPosition(inputX, inputY);
    if (isObstructed(x, y)) {
      console.warn("cannot spawn on obstructed space");
      return;
    }

    const tx = await worldSend("spawn", [x, y]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const mine = async (deltaX: number, deltaY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const playerPosition = getComponentValue(Position, playerEntity);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }

    if (!playerEntity) {
      throw new Error("no player");
    }

    const [x, y] = wrapPosition(
      playerPosition.x + deltaX,
      playerPosition.y + deltaY
    );

    if (!isMineable(x, y)) {
      console.warn("cannot mine non resource");
      return;
    }

    // const positionId = uuid();
    // Position.addOverride(positionId, {
    //   entity: playerEntity,
    //   value: { x, y },
    // });

    try {
      const tx = await worldSend("mine", [x, y]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
      // Position.removeOverride(positionId);
    }
  };

  const craftAxe = async () => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const tx = await worldSend("craftAxe", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const craftPickaxe = async () => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const tx = await worldSend("craftPickaxe", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const craftBucket = async () => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const tx = await worldSend("craftBucket", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const getAxe = async () => {
    const tx = await worldSend("getAxe", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const getPickaxe = async () => {
    const tx = await worldSend("getPickaxe", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const getBucket = async () => {
    const tx = await worldSend("getBucket", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  return {
    move,
    moveTo,
    moveBy,
    spawn,
    mine,
    craftAxe,
    craftPickaxe,
    craftBucket,
    getAxe,
    getPickaxe,
    getBucket,
  };
}
