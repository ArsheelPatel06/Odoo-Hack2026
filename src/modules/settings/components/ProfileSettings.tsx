import { Button } from "@/shared/components/ui";

export function ProfileSettings() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900">My Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your personal information and preferences.</p>
      </div>
      
      <div className="p-6 space-y-8">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="flex size-20 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-600 ring-4 ring-slate-50">
            AP
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button variant="outline" className="text-sm rounded-full">Change Photo</Button>
              <Button variant="ghost" className="text-sm text-rose-500 rounded-full hover:bg-rose-50 hover:text-rose-600">Remove</Button>
            </div>
            <p className="text-xs text-slate-400">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <div className="h-px w-full bg-slate-100" />

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">First Name</label>
            <input 
              type="text" 
              defaultValue="Arsheel"
              className="w-full rounded-[12px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Last Name</label>
            <input 
              type="text" 
              defaultValue="Patel"
              className="w-full rounded-[12px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input 
              type="email" 
              defaultValue="arsheel.patel@transitops.com"
              className="w-full rounded-[12px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <input 
              type="text" 
              disabled
              defaultValue="Fleet Manager (Admin)"
              className="w-full rounded-[12px] border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
