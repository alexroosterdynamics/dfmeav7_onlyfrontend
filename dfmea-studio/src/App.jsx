import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";

export default function App() {
  return (
    <div className="h-screen bg-[#fbfbfa] text-zinc-900 antialiased">
      {/* mobile lock */}
      <div className="lg:hidden h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-xl font-semibold tracking-tight">Desktop required</div>
          <div className="mt-2 text-sm text-zinc-600">
            This mock UI is designed strictly for desktop layouts.
          </div>
        </div>
      </div>

      {/* desktop */}
      <div className="hidden lg:flex h-full flex-col overflow-hidden">
        <TopNav />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Workspace />
        </div>
      </div>
    </div>
  );
}
