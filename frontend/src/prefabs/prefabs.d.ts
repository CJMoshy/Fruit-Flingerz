// this file is used to make any prefab types globally available to the compiler without explicitly converting the index.t.ds or game.t.ds into modules
import Opponent from "./Opponent";
import Entity from "./Entity";
import Player from "./Player";

declare global {
  type EntityType = Entity;
  type OpponentType = Opponent;
  type PlayerType = Player;
}
