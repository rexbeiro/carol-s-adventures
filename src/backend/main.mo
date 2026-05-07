import Types "types/game-save";
import GameSaveMixin "mixins/game-save-api";
import Map "mo:core/Map";

actor {
  let saves = Map.empty<Text, Types.GameSave>();

  include GameSaveMixin(saves);
};
