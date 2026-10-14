import { createFileRoute } from "@tanstack/react-router";
import { Intro } from "@/components/intro";
import { Today } from "@/components/today";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const introSeen = useApp((s) => s.introSeen);
  if (!introSeen) return <Intro />;
  return <Today />;
}
