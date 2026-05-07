export type MiniGameType = "turbulence" | "passenger" | "emergency";

export type GamePhase = "start" | "map" | "dialogue" | "minigame" | "ending";

export interface LevelScore {
  levelIndex: number;
  minigameScore: number;
  passed: boolean;
}

export interface GameSave {
  currentLevel: number;
  completedLevels: number[];
  relationshipScore: number;
  scores: LevelScore[];
  lastSaved: number;
}

export interface DialogueChoice {
  id: string;
  text: string;
  relationshipDelta: number;
  nextDialogueId?: string;
}

export interface DialogueLine {
  speaker: "carol" | "joshua" | "narrator" | "system";
  text: string;
  choices?: DialogueChoice[];
}

export interface DialogueScene {
  id: string;
  lines: DialogueLine[];
  nextRoute?: string;
}

export interface Level {
  id: number;
  name: string;
  location: string;
  subtitle: string;
  minigameType: MiniGameType;
  dialogueBeforeId: string;
  dialogueAfterId: string;
  background: string;
  unlockRequirement: number;
}

export interface CharacterSprite {
  id: string;
  name: string;
  color: string;
  pixels: number[][];
}

export interface GameState {
  currentLevel: number;
  completedLevels: number[];
  relationshipScore: number;
  scores: LevelScore[];
  isLoading: boolean;
  phase: GamePhase;
}
