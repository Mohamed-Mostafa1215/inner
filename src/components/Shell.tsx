import { Nav } from "./Nav";
import { Onboarding } from "./Onboarding";
import { exportData, importData } from "@/lib/data-export";
import React, { useRef } from "react";

export function Shell({ children }: { children: React.ReactNode }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const count = await importData(file);
      alert(`تم استرداد ${count} من حقول البيانات بنجاح! سيتم تحديث الصفحة الآن.`);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء استيراد الملف.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Nav />
        {/* Onboarding modal triggers internally if key not set */}
        <Onboarding />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">{children}</main>
      </div>

      <footer className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-10 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground mt-12">
        <div>
          السيادة ليست في وفرة العناصر، بل في إحكام السيطرة على تفاعلاتها.
        </div>
        
        {/* Export / Import Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={exportData}
            className="px-3 py-1.5 rounded-lg gold-border hover:text-foreground transition-all cursor-pointer"
          >
            تصدير البيانات 📥
          </button>
          
          <button
            onClick={handleImportClick}
            className="px-3 py-1.5 rounded-lg gold-border hover:text-foreground transition-all cursor-pointer"
          >
            استيراد البيانات 📤
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </footer>
    </div>
  );
}
