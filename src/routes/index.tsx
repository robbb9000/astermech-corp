import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/cinematic/Experience";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Experience />;
}
