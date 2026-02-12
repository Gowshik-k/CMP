import { useState } from 'react';
import { Settings, Shield, Bell, Database, Globe, Save, RefreshCw, Cpu, HardDrive, Activity } from 'lucide-react';

const SiteSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'University Conference Portal',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        maxFileSize: '10',
        contactEmail: 'admin@university.edu'
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully (simulated)');
        }, 1000);
    };

    const SettingRow = ({ icon: Icon, title, description, control }) => (
        <div className="flex items-center justify-between py-6 border-b border-zinc-50 last:border-0 group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-zinc-900 mb-0.5">{title}</h4>
                    <p className="text-xs text-zinc-500 max-w-sm">{description}</p>
                </div>
            </div>
            {control}
        </div>
    );

    const Toggle = ({ enabled, onClick }) => (
        <button 
            onClick={onClick}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${enabled ? 'bg-blue-600' : 'bg-zinc-200'}`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
        </button>
    );

    return (
        <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-4 -mr-4 animate-fade-in pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900">General Configurations</h3>
                                    <p className="text-xs text-zinc-500">Core portal settings and visibility controls.</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg shadow-zinc-900/10"
                            >
                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <SettingRow 
                                icon={Globe}
                                title="Site Name"
                                description="The primary title displayed across the platform and browser tabs."
                                control={
                                    <input 
                                        type="text" 
                                        value={settings.siteName}
                                        onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                                        className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold w-48 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                }
                            />
                            <SettingRow 
                                icon={Shield}
                                title="Maintenance Mode"
                                description="Temporarily disable public access to the portal for updates."
                                control={<Toggle enabled={settings.maintenanceMode} onClick={() => handleToggle('maintenanceMode')} />}
                            />
                            <SettingRow 
                                icon={Database}
                                title="Allow New Registrations"
                                description="Enable or disable the creation of new attendee accounts."
                                control={<Toggle enabled={settings.allowRegistration} onClick={() => handleToggle('allowRegistration')} />}
                            />
                            <SettingRow 
                                icon={Bell}
                                title="System Notifications"
                                description="Trigger automatic email alerts for submissions and deadlines."
                                control={<Toggle enabled={settings.emailNotifications} onClick={() => handleToggle('emailNotifications')} />}
                            />
                        </div>
                    </section>

                    <section className="bg-white rounded-[1.5rem] border border-zinc-200 border-dashed p-8 text-center">
                        <p className="text-zinc-400 text-sm font-medium">Advanced Security & API settings coming in V2</p>
                    </section>
                </div>

                {/* System Status Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Performance</span>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <div className="flex items-center gap-2 text-zinc-400"><Cpu className="w-3.5 h-3.5" /> CPU Usage</div>
                                        <span>12%</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 w-[12%]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <div className="flex items-center gap-2 text-zinc-400"><Database className="w-3.5 h-3.5" /> Database</div>
                                        <span>Healthy</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[95%]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <div className="flex items-center gap-2 text-zinc-400"><HardDrive className="w-3.5 h-3.5" /> Storage</div>
                                        <span>2.4 GB / 10 GB</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 w-[24%]" />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                Run Diagnostics
                            </button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-zinc-200 p-6">
                        <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-4">Version Info</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Portal Version</span>
                                <span className="font-bold">1.0.4-stable</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Build ID</span>
                                <span className="font-mono text-[10px] bg-zinc-50 px-1.5 py-0.5 rounded">bc87a21</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Last Update</span>
                                <span className="font-bold">2 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteSettings;
