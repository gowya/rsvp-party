"use client";

import { useEffect } from "react";
import { startLiveSync } from "@/lib/live";

export default function LiveSync() {
  useEffect(() => startLiveSync(), []);
  return null;
}
