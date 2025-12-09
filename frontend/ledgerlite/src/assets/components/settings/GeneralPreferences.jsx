import React, { useState, useEffect } from "react";
import { useLedger } from "../../../context/LedgerContext";
import { Save, Check } from "lucide-react";

export default function GeneralPreferences() {
    const { settings, updateSettings } = useLedger();
    const [formData, setFormData] = useState(settings || {});
    const [isSaved, setIsSaved] = useState(false);

    // Sync with context if it changes externally
    useEffect(() => {
        if (settings) setFormData(settings);
    }, [settings]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsSaved(false);
    };

    const handleSave = () => {
        updateSettings(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000); // Reset save checkmark
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configure global application settings.</p>
            </div>

            <div className="max-w-md space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleChange("theme", "light")}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.theme === "light"
                                ? "bg-marine-600 text-white border-marine-600"
                                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                                }`}
                        >
                            Light Mode
                        </button>
                        <button
                            onClick={() => handleChange("theme", "dark")}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.theme === "dark"
                                ? "bg-marine-600 text-white border-marine-600"
                                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                                }`}
                        >
                            Dark Mode
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reporting Currency</label>
                    <select
                        value={formData.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                        <option value="USD">USD - US Dollar ($)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                        <option value="GBP">GBP - British Pound (£)</option>
                        <option value="NGN">NGN - Nigerian Naira (₦)</option>
                        <option value="INR">INR - Indian Rupee (₹)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                    <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Displayed on financial reports.</p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all shadow-sm ${isSaved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-marine-600 hover:bg-marine-700"
                            }`}
                    >
                        {isSaved ? <Check size={18} /> : <Save size={18} />}
                        {isSaved ? "Settings Saved" : "Save Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
}
