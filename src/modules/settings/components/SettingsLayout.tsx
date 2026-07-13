"use client";

import { useState } from "react";
import { User, Building, Users, CreditCard, Bell, Shield, Save } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/lib";

const SETTINGS_TABS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "workspace", label: "Workspace", icon: Building },
  { id: "team", label: "Team Members", icon: Users },
  { id: "billing", label: "Billing & Plans", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

type SettingsLayoutProps = {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onSave: () => void;
  isDirty?: boolean;
};

export function SettingsLayout({ children, activeTab, onTabChange, onSave, isDirty = true }: SettingsLayoutProps) {
  return (
    <div className="flex h-full flex-col lg:flex-row gap-8 pb-12 relative">
      
      {/* Settings Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-1">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-[12px] text-sm font-medium transition-all duration-200 text-left",
              activeTab === tab.id 
                ? "bg-indigo-50 text-indigo-700" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <tab.icon className={cn("size-4", activeTab === tab.id ? "text-indigo-600" : "text-slate-400")} />
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main Settings Content */}
      <div className="flex-1 flex flex-col min-w-0 max-w-3xl">
        <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-6 rounded-full bg-slate-900 px-6 py-4 text-white shadow-xl transition-all duration-300",
        isDirty ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      )}>
        <span className="text-sm font-medium">You have unsaved changes</span>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-4">
            Discard
          </Button>
          <Button onClick={onSave} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 shadow-sm">
            <Save className="size-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

    </div>
  );
}
