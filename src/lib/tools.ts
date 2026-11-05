import { Mail, NotebookPen, ListChecks, Search, MessagesSquare, LayoutDashboard } from "lucide-react";

export const tools = [
  { title: "Email Generator", url: "/email", icon: Mail, desc: "Draft polished professional emails in seconds." },
  { title: "Meeting Summarizer", url: "/meetings", icon: NotebookPen, desc: "Turn raw notes into decisions and action items." },
  { title: "Task Planner", url: "/planner", icon: ListChecks, desc: "Break goals into a prioritized, scheduled plan." },
  { title: "Research Assistant", url: "/research", icon: Search, desc: "Get structured briefings on any topic." },
  { title: "AI Chat", url: "/chat", icon: MessagesSquare, desc: "Ask anything about your work, conversationally." },
] as const;

export const nav = [{ title: "Dashboard", url: "/", icon: LayoutDashboard, desc: "" }, ...tools];
