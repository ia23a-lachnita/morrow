import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Boot } from "@/components/boot";
import { Intro } from "@/components/intro";
import { Today } from "@/components/today";
import { Notices } from "@/routes/notices";
import { useApp } from "@/lib/store";
import "@/styles.css";
import "../public/fonts/fonts.css";

function Home() {
  const introSeen = useApp((s) => s.introSeen);
  if (!introSeen) return <Intro />;
  return <Today />;
}

const rootRoute = createRootRoute({
  component: () => (
    <Boot>
      <Outlet />
    </Boot>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const noticesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notices",
  component: Notices,
});

const routeTree = rootRoute.addChildren([indexRoute, noticesRoute]);

const router = createRouter({
  routeTree,
  history: createHashHistory(),
});

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
