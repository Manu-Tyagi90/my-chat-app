export interface Message {
  username: string;
  content: string;
  timestamp: string;
  seenBy?: string[];
}