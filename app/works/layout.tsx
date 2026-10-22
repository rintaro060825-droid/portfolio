import WorksNav from "./WorksNav";

export default function WorksLayout({ children }: LayoutProps<"/works">) {
  return (
    <div className="flex flex-1 flex-col px-6 py-16 sm:px-16">
      <WorksNav />
      {children}
    </div>
  );
}
