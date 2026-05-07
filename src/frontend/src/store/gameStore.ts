import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, LevelScore as LS, LevelScore } from "../types/game";

interface GameStore extends GameState {
  setLevel: (level: number) => void;
  completeLevel: (levelIndex: number, score: number) => void;
  addRelationshipPoint: (delta: number) => void;
  addScore: (score: LS) => void;
  setLoading: (loading: boolean) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  currentLevel: 0,
  completedLevels: [],
  relationshipScore: 50,
  scores: [],
  isLoading: false,
  phase: "start",
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,

      setLevel: (level) => set({ currentLevel: level }),

      completeLevel: (levelIndex, score) =>
        set((state) => {
          const newScore: LevelScore = {
            levelIndex,
            minigameScore: score,
            passed: score >= 50,
          };
          const filteredScores = state.scores.filter(
            (s) => s.levelIndex !== levelIndex,
          );
          const completedLevels = state.completedLevels.includes(levelIndex)
            ? state.completedLevels
            : [...state.completedLevels, levelIndex];
          return {
            scores: [...filteredScores, newScore],
            completedLevels,
            currentLevel: Math.max(state.currentLevel, levelIndex + 1),
          };
        }),

      addRelationshipPoint: (delta) =>
        set((state) => ({
          relationshipScore: Math.max(
            0,
            Math.min(100, state.relationshipScore + delta),
          ),
        })),

      addScore: (score) =>
        set((state) => ({
          scores: [
            ...state.scores.filter((s) => s.levelIndex !== score.levelIndex),
            score,
          ],
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      resetGame: () => set({ ...initialState }),
    }),
    {
      name: "carols-adventures-save",
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        completedLevels: state.completedLevels,
        relationshipScore: state.relationshipScore,
        scores: state.scores,
      }),
    },
  ),
);
