import React from 'react';
import { X, Plus, Edit2, Trash2, CheckCircle2, Clock, IndianRupee, CreditCard, Tag, Calendar, Code2 } from 'lucide-react';
import { calculateProjectFinancials } from '../../services/freelanceStorage';

export default function ProjectDetailsDrawer({
  isOpen,
  onClose,
  project,
  onEditProject,
  onAddPayment,
  onEditPayment,
  onDeletePayment
}) {
  if (!isOpen || !project) return null;

  const { totalValue, totalReceived, totalPending } = calculateProjectFinancials(project);
  const progressPercent = totalValue > 0 ? Math.min(100, Math.round((totalReceived / totalValue) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1 max-w-[80%]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{project.title}</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  project.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : project.status === 'Inactive'
                    ? 'bg-slate-100 text-slate-600 border border-slate-200'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Received: {project.receivedDate || 'N/A'}
              </span>
              {project.isCompleted && project.completionDate && (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed: {project.completionDate}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditProject(project)}
              className="p-2 rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 border border-slate-200 transition-colors"
              title="Edit Project Details"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Description */}
          {project.description && (
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description & Scope</h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>
          )}

          {/* Tech Stack Tags */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technologies / Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100/80"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Financial Summary Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Project Value</p>
                <h3 className="text-2xl font-black tracking-tight text-white mt-0.5">
                  ₹{totalValue.toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {progressPercent}% Cleared
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <p className="text-xs text-slate-400">Total Received</p>
                <p className="text-lg font-bold text-emerald-400">₹{totalReceived.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Pending Amount</p>
                <p className="text-lg font-bold text-amber-400">₹{totalPending.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Payments Section Header */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Payment History</h3>
              <p className="text-xs text-slate-500">Track all installment records and incoming transactions.</p>
            </div>
            <button
              onClick={() => onAddPayment(project.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Payment (+)
            </button>
          </div>

          {/* Payments List */}
          {(!project.payments || project.payments.length === 0) ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
              <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No payment records logged yet</p>
              <p className="text-xs text-slate-400 mt-1">Click "Add Payment (+)" to record the first payment installment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {project.payments.map((pay) => (
                <div
                  key={pay.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">{pay.title}</h4>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          pay.status === 'Received'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {pay.status === 'Received' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        {pay.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>Date: {pay.date}</span>
                      <span>•</span>
                      <span>Method: <strong className="text-slate-700">{pay.method}</strong></span>
                      {pay.transactionId && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {pay.transactionId}
                          </span>
                        </>
                      )}
                    </div>

                    {pay.notes && (
                      <p className="text-xs text-slate-500 italic pt-1">{pay.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      <p className="text-base font-extrabold text-slate-900">
                        ₹{(parseFloat(pay.amount) || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditPayment(project.id, pay)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Edit Payment"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePayment(project.id, pay.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Payment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
