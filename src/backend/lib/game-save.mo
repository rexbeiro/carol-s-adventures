import Types "../types/game-save";
import Map "mo:core/Map";

module {
  public type GameSave = Types.GameSave;
  public type LevelScore = Types.LevelScore;

  /// Persist a game save for a given player key.
  /// Validates: relationshipScore <= 2, completedLevels <= 6 entries.
  public func save(store : Map.Map<Text, GameSave>, key : Text, data : GameSave) : Bool {
    if (data.relationshipScore > 2) { return false };
    if (data.completedLevels.size() > 6) { return false };
    store.add(key, data);
    true;
  };

  /// Retrieve a game save for a given player key
  public func load(store : Map.Map<Text, GameSave>, key : Text) : ?GameSave {
    store.get(key);
  };

  /// Remove all save data for a given player key
  public func reset(store : Map.Map<Text, GameSave>, key : Text) : Bool {
    store.remove(key);
    true;
  };
};
