"use client";

import { useState } from "react";

export default function AdminConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-ink/30 flex items-center justify-center z-50">
      <div className="bg-ricepaper p-6 rounded-sm shadow-lg max-w-sm w-full mx-4">
        <h3 className="font-serif text-ink text-lg mb-3">{title}</h3>
        <p className="text-inkGray text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-ink/20 text-inkGray rounded-sm hover:bg-ink/5 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-ochre text-ricepaper rounded-sm hover:bg-ochre/90 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}
