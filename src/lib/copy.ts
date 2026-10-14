export const TAGS = [
  { id: "focus", label: "Focus" },
  { id: "people", label: "People" },
  { id: "body", label: "Body" },
] as const;

export type TagId = (typeof TAGS)[number]["id"];

export const DAWN_NOTE = "The day is given. What is it for?";
export const DUSK_NOTE = "You can close the day. Or not. It refills at dawn.";

export function tagLabel(id: TagId): string {
  return TAGS.find((tag) => tag.id === id)?.label ?? "";
}

export function closeLine(moments: { name: string }[]): string {
  const names = moments.map((moment) => moment.name.trim()).filter(Boolean).slice(0, 3);
  if (names.length === 0) {
    return "You left the day unnamed. It was still lived. It refills at dawn.";
  }
  const list =
    names.length === 1
      ? names[0]
      : names.length === 2
        ? `${names[0]} and ${names[1]}`
        : `${names[0]}, ${names[1]}, and ${names[2]}`;
  return `You kept ${list}. It refills at dawn.`;
}
