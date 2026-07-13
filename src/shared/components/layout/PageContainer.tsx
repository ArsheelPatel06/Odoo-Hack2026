import { cn } from "@/shared/lib";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className={cn("mx-auto w-full max-w-[1600px] animate-fade-in px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-9", className)}>
          {children}
        </div>
      </div>
    </main>
  );
}
