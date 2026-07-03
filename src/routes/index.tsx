import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "../mactab/components/Desktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MacTab OS — Premium New Tab Dashboard" },
      { name: "description", content: "A macOS-inspired new tab dashboard with widgets, dock, spotlight search, notes, and more." },
      { property: "og:title", content: "MacTab OS" },
      { property: "og:description", content: "Premium macOS-inspired Chrome New Tab dashboard." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Desktop />;
}
