export default function CommonPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 py-8 px-5 w-full flex-1 flex flex-col bg-white bg-opacity-8 rounded-3xl">
      {children}
    </div>
  );
}
