import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GameSave {
    scores: Array<LevelScore>;
    relationshipScore: bigint;
    currentLevel: bigint;
    lastSaved: bigint;
    completedLevels: Array<bigint>;
}
export interface LevelScore {
    minigameScore: bigint;
    levelIndex: bigint;
    passed: boolean;
}
export interface backendInterface {
    loadGame(): Promise<GameSave | null>;
    resetGame(): Promise<boolean>;
    saveGame(data: GameSave): Promise<boolean>;
}
