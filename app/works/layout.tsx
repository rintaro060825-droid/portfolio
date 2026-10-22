import WorksNav from "./WorksNav";

export default function WorksLayout({ children }: LayoutProps<"/works">) {
  return (
    <div className="flex flex-1 flex-col px-6 py-16 sm:px-16">
      <h1 className="text-4xl font-semibold tracking-tight">Works</h1>
      <WorksNav />
      {children}
    </div>
  );
}
