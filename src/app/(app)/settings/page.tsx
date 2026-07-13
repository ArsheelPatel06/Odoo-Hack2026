"use client";

import { useState } from "react";
import { SettingsLayout, ProfileSettings } from "@/modules/settings/components";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { PageHeader } from "@/shared/components/ui/PageHeader";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isDirty, setIsDirty] = useState(true); // Mocking unsaved changes for demonstration

  return (
    <div className="flex h-[calc(100vh-32px)] flex-col gap-6 pt-4 pb-4 overflow-hidden">
      
      {/* Scrollable Main Area */}
      <div className="flex flex-col gap-6 overflow-y-auto px-4 scrollbar-hide pb-12">
        <PageHeader 
          title="Settings" 
          description="Manage your account, workspace preferences, and team." 
        />
        
        <SettingsLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDirty={isDirty}
          onSave={() => setIsDirty(false)}
        >
          {activeTab === "profile" ? (
            <ProfileSettings />
          ) : (
            <div className="flex h-[400px] items-center justify-center p-6">
              <EmptyState 
                title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings`}
                description={`Configuration options for ${activeTab} will be available soon.`}
              />
            </div>
          )}
        </SettingsLayout>
      </div>

    </div>
  );
}
