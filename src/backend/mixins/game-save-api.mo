import Types "../types/game-save";
import GameSaveLib "../lib/game-save";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

mixin (saves : Map.Map<Text, Types.GameSave>) {
  /// Save game progress for the calling player
  public shared ({ caller }) func saveGame(data : Types.GameSave) : async Bool {
    let key = caller.toText();
    let stamped : Types.GameSave = { data with lastSaved = Time.now() };
    GameSaveLib.save(saves, key, stamped);
  };

  /// Load game progress for the calling player
  public shared query ({ caller }) func loadGame() : async ?Types.GameSave {
    GameSaveLib.load(saves, caller.toText());
  };

  /// Reset all progress for the calling player
  public shared ({ caller }) func resetGame() : async Bool {
    GameSaveLib.reset(saves, caller.toText());
  };
};
