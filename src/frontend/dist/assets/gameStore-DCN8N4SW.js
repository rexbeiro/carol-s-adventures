import { r as reactExports, j as jsxRuntimeExports, R as React } from "./index-B39rMSy_.js";
const variantStyles = {
  pink: "border-primary text-primary hover:bg-primary/10 active:bg-primary/20",
  blue: "border-secondary text-secondary hover:bg-secondary/10 active:bg-secondary/20",
  yellow: "border-accent text-accent hover:bg-accent/10 active:bg-accent/20",
  ghost: "border-muted text-muted-foreground hover:border-primary hover:text-primary"
};
const glowStyles = {
  pink: "0 0 12px oklch(0.56 0.26 330 / 0.7), 0 0 24px oklch(0.56 0.26 330 / 0.3)",
  blue: "0 0 12px oklch(0.91 0.26 200 / 0.7), 0 0 24px oklch(0.91 0.26 200 / 0.3)",
  yellow: "0 0 12px oklch(0.97 0.31 100 / 0.7), 0 0 24px oklch(0.97 0.31 100 / 0.3)",
  ghost: "none"
};
const sizeStyles = {
  sm: "px-4 py-2 text-xs min-h-[36px]",
  md: "px-6 py-3 text-sm min-h-[44px]",
  lg: "px-8 py-4 text-base min-h-[52px]"
};
const NeonButton = reactExports.forwardRef(
  ({
    variant = "pink",
    size = "md",
    fullWidth = false,
    glow = true,
    className = "",
    children,
    style,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        ref,
        type: "button",
        className: [
          "tap-feedback",
          "inline-flex items-center justify-center",
          "border-2 rounded font-mono font-bold uppercase tracking-widest",
          "transition-smooth cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          className
        ].filter(Boolean).join(" "),
        style: {
          boxShadow: glow ? glowStyles[variant] : void 0,
          ...style
        },
        ...props,
        children
      }
    );
  }
);
NeonButton.displayName = "NeonButton";
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState2;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState2 = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React.useSyncExternalStore(
    api.subscribe,
    React.useCallback(() => selector(api.getState()), [api, selector]),
    React.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
function createJSONStorage(getStorage, options) {
  let storage;
  try {
    storage = getStorage();
  } catch (e) {
    return;
  }
  const persistStorage = {
    getItem: (name) => {
      var _a;
      const parse = (str2) => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, void 0);
      };
      const str = (_a = storage.getItem(name)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, void 0)),
    removeItem: (name) => storage.removeItem(name)
  };
  return persistStorage;
}
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const persistImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    storage: createJSONStorage(() => window.localStorage),
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  let hydrationVersion = 0;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage = options.storage;
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const setItem = () => {
    const state = options.partialize({ ...get() });
    return storage.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    return setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      return setItem();
    },
    get,
    api
  );
  api.getInitialState = () => configResult;
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage) return;
    const currentVersion = ++hydrationVersion;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => {
      var _a2;
      return cb((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            const migration = options.migrate(
              deserializedStorageValue.state,
              deserializedStorageValue.version
            );
            if (migration instanceof Promise) {
              return migration.then((result) => [true, result]);
            }
            return [true, migration];
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return [false, deserializedStorageValue.state];
        }
      }
      return [false, void 0];
    }).then((migrationResult) => {
      var _a2;
      if (currentVersion !== hydrationVersion) {
        return;
      }
      const [migrated, migratedState] = migrationResult;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      if (migrated) {
        return setItem();
      }
    }).then(() => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(get(), void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb) => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: (cb) => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persist = persistImpl;
const initialState = {
  currentLevel: 0,
  completedLevels: [],
  relationshipScore: 50,
  scores: [],
  isLoading: false,
  phase: "start"
};
const useGameStore = create()(
  persist(
    (set) => ({
      ...initialState,
      setLevel: (level) => set({ currentLevel: level }),
      completeLevel: (levelIndex, score) => set((state) => {
        const newScore = {
          levelIndex,
          minigameScore: score,
          passed: score >= 50
        };
        const filteredScores = state.scores.filter(
          (s) => s.levelIndex !== levelIndex
        );
        const completedLevels = state.completedLevels.includes(levelIndex) ? state.completedLevels : [...state.completedLevels, levelIndex];
        return {
          scores: [...filteredScores, newScore],
          completedLevels,
          currentLevel: Math.max(state.currentLevel, levelIndex + 1)
        };
      }),
      addRelationshipPoint: (delta) => set((state) => ({
        relationshipScore: Math.max(
          0,
          Math.min(100, state.relationshipScore + delta)
        )
      })),
      addScore: (score) => set((state) => ({
        scores: [
          ...state.scores.filter((s) => s.levelIndex !== score.levelIndex),
          score
        ]
      })),
      setLoading: (loading) => set({ isLoading: loading }),
      resetGame: () => set({ ...initialState })
    }),
    {
      name: "carols-adventures-save",
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        completedLevels: state.completedLevels,
        relationshipScore: state.relationshipScore,
        scores: state.scores
      })
    }
  )
);
export {
  NeonButton as N,
  useGameStore as u
};
