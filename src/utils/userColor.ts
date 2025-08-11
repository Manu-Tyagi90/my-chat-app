// src/utils/userColor.ts
export function getUserColor(username: string): string {
  const colors = [
    "#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8",
    "#4db6ac", "#ffb74d", "#a1887f", "#90a4ae", "#f06292"
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}