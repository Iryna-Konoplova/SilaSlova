"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useEnrollStore } from "@/lib/enroll-store";

// Тяжёлую модалку (framer-motion + react-hook-form + zod + маска телефона)
// держим в отдельном чанке и подгружаем ТОЛЬКО при первом открытии формы,
// чтобы её зависимости не попадали в стартовый JS лендинга.
const EnrollModal = dynamic(
  () => import("./EnrollModal").then((m) => m.EnrollModal),
  { ssr: false }
);

export function EnrollModalMount() {
  const isOpen = useEnrollStore((s) => s.isOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // После первого открытия оставляем модалку смонтированной: она сама
    // управляет видимостью (AnimatePresence по isOpen), повторный fetch не нужен.
    if (isOpen) setMounted(true);
  }, [isOpen]);

  return mounted ? <EnrollModal /> : null;
}
