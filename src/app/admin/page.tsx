import type { Metadata } from "next";
import AdminApp from "./AdminApp";
import { EVENT } from "@/data/event";

export const metadata: Metadata = {
  title: `Admin · ${EVENT.title}`,
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
