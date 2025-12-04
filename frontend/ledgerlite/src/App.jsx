import { Routes, Route } from "react-router-dom";
import Layout from "./assets/components/Layout";
import Dashboard from "./assets/pages/Dashboard";
import Transactions from "./assets/pages/Transactions";
import Registers from "./assets/pages/Registers";
import Reports from "./assets/pages/Reports";
import Settings from "./assets/pages/Settings";
import Profile from "./assets/pages/Profile";
import Login from "./assets/pages/Login";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import { LedgerProvider } from "./context/LedgerContext";

function App() {
  return (
    <LedgerProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Layout>
                <Transactions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/registers"
          element={
            <ProtectedRoute>
              <Layout>
                <Registers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </LedgerProvider>
  );
}

export default App;
