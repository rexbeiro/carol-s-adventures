import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { LoadingScreen } from "./components/LoadingScreen";

const StartPage = lazy(() => import("./pages/StartPage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const LevelPage = lazy(() => import("./pages/LevelPage"));
const MinigamePage = lazy(() => import("./pages/MinigamePage"));
const DialoguePage = lazy(() => import("./pages/DialoguePage"));
const EndingPage = lazy(() => import("./pages/EndingPage"));

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: StartPage,
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  component: MapPage,
});

const levelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/level/$id",
  component: LevelPage,
});

const minigameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/minigame/$type",
  component: MinigamePage,
});

const dialogueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dialogue/$id",
  component: DialoguePage,
});

const endingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ending",
  component: EndingPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  mapRoute,
  levelRoute,
  minigameRoute,
  dialogueRoute,
  endingRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
