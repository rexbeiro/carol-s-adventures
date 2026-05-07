module {
  /// Score record for a single level's mini-games
  public type LevelScore = {
    levelIndex : Nat;
    minigameScore : Nat;
    passed : Bool;
  };

  /// Full game save data for a player
  public type GameSave = {
    currentLevel : Nat;
    completedLevels : [Nat];
    relationshipScore : Nat;
    scores : [LevelScore];
    lastSaved : Int;
  };
};
