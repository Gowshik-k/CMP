import React from 'react';
import { Award, Download, Calendar, CheckCircle2 } from 'lucide-react';

const Certificates = () => {
    const certificates = [
        {
            id: 1,
            conference: 'International Conference on Computer Science 2026',
            type: 'Participation Certificate',
            issueDate: '2026-03-20',
            certificateId: 'ICCS2026-PART-001234',
            status: 'available'
        },
        {
            id: 2,
            conference: 'IEEE Conference on Cybersecurity',
            type: 'Best Paper Award',
            issueDate: '2026-04-15',
            certificateId: 'IEEE-CS-2026-BP-005678',
            status: 'available'
        },
        {
            id: 3,
            conference: 'National Symposium on Data Science',
            type: 'Participation Certificate',
            issueDate: 'Pending',
            certificateId: 'NSDS2026-PART-009876',
            status: 'pending'
        }
    ];

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 mb-2">My Certificates</h1>
                <p className="text-zinc-500 font-medium">Download and manage your conference certificates</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                    <div key={cert.id} className="bg-white rounded-[32px] border border-zinc-200 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                        <div className="h-3 bg-gradient-to-r from-amber-600 to-amber-400"></div>
                        <div className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Award className="w-8 h-8 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-zinc-900 mb-1">{cert.type}</h3>
                                    <p className="text-sm text-zinc-600 font-medium">{cert.conference}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Certificate ID</span>
                                    <span className="text-sm font-bold text-zinc-900 font-mono">{cert.certificateId}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Issue Date</span>
                                    <span className="text-sm font-bold text-zinc-900">
                                        {cert.issueDate !== 'Pending'
                                            ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                            : 'Pending'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Status</span>
                                    {cert.status === 'available' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Available
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold">
                                            <Calendar className="w-3 h-3" />
                                            Pending
                                        </span>
                                    )}
                                </div>
                            </div>

                            {cert.status === 'available' ? (
                                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                                    <Download className="w-4 h-4" />
                                    Download Certificate
                                </button>
                            ) : (
                                <button disabled className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-400 rounded-2xl font-bold text-sm cursor-not-allowed">
                                    Certificate Not Ready
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Certificates;
