const EXPORT_KEYS = [
  "protocol-progress",
  "assessment-answers",
  "journal-entries",
  "assessment-history",
  "decision-records",
  "exercise-log",
  "weekly-log",
  "onboarding-done",
] as const;

type ExportKey = (typeof EXPORT_KEYS)[number];

interface ExportPayload {
  version: 1;
  exportedAt: string;
  data: Partial<Record<ExportKey, string>>;
}

/**
 * تصدير بيانات التطبيق كملف JSON للتحميل
 */
export function exportData(): void {
  const payload: ExportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {},
  };

  for (const key of EXPORT_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      payload.data[key] = value;
    }
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sovereignty-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * استيراد بيانات التطبيق من ملف JSON واستعادتها في localStorage
 * يعيد عدد المفاتيح التي تم استعادتها
 */
export function importData(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = reader.result as string;
        const payload: ExportPayload = JSON.parse(text);

        if (!payload.version || !payload.data) {
          reject(new Error("ملف غير صالح: البنية غير مطابقة"));
          return;
        }

        let restoredCount = 0;
        for (const key of EXPORT_KEYS) {
          const value = payload.data[key];
          if (value !== undefined) {
            localStorage.setItem(key, value);
            restoredCount++;
          }
        }

        resolve(restoredCount);
      } catch {
        reject(new Error("فشل قراءة الملف: تأكد من أن الملف بصيغة JSON صالحة"));
      }
    };

    reader.onerror = () => {
      reject(new Error("حدث خطأ أثناء قراءة الملف"));
    };

    reader.readAsText(file);
  });
}
