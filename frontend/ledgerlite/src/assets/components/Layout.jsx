import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Topbar />
        <main className="pt-20 px-6 pb-12">{children}</main>
      </div>
    </div>
  );
}
