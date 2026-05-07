import type { backendInterface, GameSave } from "../backend";

const sampleSave: GameSave = {
  scores: [
    { minigameScore: BigInt(850), levelIndex: BigInt(0), passed: true },
  ],
  relationshipScore: BigInt(75),
  currentLevel: BigInt(1),
  lastSaved: BigInt(Date.now()),
  completedLevels: [BigInt(0)],
};

export const mockBackend: backendInterface = {
  loadGame: async () => sampleSave,
  saveGame: async (_data: GameSave) => true,
  resetGame: async () => true,
};
