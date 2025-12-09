import React, { useState } from "react";
import SettingsLayout from "../components/settings/SettingsLayout";
import GeneralPreferences from "../components/settings/GeneralPreferences";
import COAManager from "../components/settings/COAManager";
import DataAdmin from "../components/settings/DataAdmin";
import SecurityLogs from "../components/settings/SecurityLogs";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general": return <GeneralPreferences />;
      case "coa": return <COAManager />;
      case "data": return <DataAdmin />;
      case "security": return <SecurityLogs />;
      default: return <GeneralPreferences />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your company profile, chart of accounts, and system data.
        </p>
      </div>

      <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </SettingsLayout>
    </div>
  );
}
