import { Nav } from "./Nav";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-center text-xs text-muted-foreground">
        السيادة ليست في وفرة العناصر، بل في إحكام السيطرة على تفاعلاتها.
      </footer>
    </div>
  );
}
