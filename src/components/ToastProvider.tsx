"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontSize: "14px" } }} />;
}
