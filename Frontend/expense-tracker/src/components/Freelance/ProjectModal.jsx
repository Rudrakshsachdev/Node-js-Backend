import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Code2 } from 'lucide-react';

export default function ProjectModal({ isOpen, onClose, onSave, project = null }) {
  const [title, setTitle] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [status, setStatus] = useState('Active');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionDate, setCompletionDate] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setReceivedDate(project.receivedDate || '');
      setDescription(project.description || '');
      setTechnologies(project.technologies || []);
      setStatus(project.status || 'Active');
      setIsCompleted(!!project.isCompleted || project.status === 'Completed');
      setCompletionDate(project.completionDate || '');
    } else {
      setTitle('');
      setReceivedDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setTechnologies([]);
      setStatus('Active');
      setIsCompleted(false);
      setCompletionDate('');
    }
    setTechInput('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleAddTech = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = techInput.trim().replace(/,/g, '');
      if (val && !technologies.includes(val)) {
        setTechnologies([...technologies, val]);
        setTechInput('');
      }
    }
  };

  const removeTech = (techToRemove) => {
    setTechnologies(technologies.filter((t) => t !== techToRemove));
  };

  const handleCompletedToggle = (checked) => {
    setIsCompleted(checked);
    if (checked) {
      setStatus('Completed');
      if (!completionDate) {
        setCompletionDate(new Date().toISOString().split('T')[0]);
      }
    } else {
      setStatus('Active');
      setCompletionDate('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      receivedDate,
      description: description.trim(),
      technologies,
      status: isCompleted ? 'Completed' : status,
      isCompleted,
      completionDate: isCompleted ? completionDate : '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {project ? 'Edit Freelance Project' : 'Add New Freelance Project'}
            </h3>
            <p className="text-xs text-slate-500">Capture core project information and technical scope.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mobile Banking App UI Redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Received Date *
              </label>
              <input
                type="date"
                required
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                disabled={isCompleted}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800 bg-white disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe deliverables, client requirements, or project scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800"
            />
          </div>

          {/* Programming Languages / Technologies Used */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Technologies / Stack (Press Enter or comma to add)
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-xl min-h-[46px] items-center bg-white">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100"
                >
                  <Code2 className="w-3 h-3" />
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-violet-400 hover:text-violet-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={technologies.length === 0 ? "e.g. React, Node.js, Python..." : "Add tech..."}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                className="flex-1 min-w-[120px] outline-none text-sm text-slate-800 px-1"
              />
            </div>
          </div>

          {/* Completion Checkbox & Date reveal */}
          <div className="pt-2 border-t border-slate-100">
            <label className="relative flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => handleCompletedToggle(e.target.checked)}
                className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 border-slate-300"
              />
              <span className="text-sm font-semibold text-slate-800">
                This project is completed.
              </span>
            </label>

            {isCompleted && (
              <div className="mt-3 pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Completion Date *
                </label>
                <input
                  type="date"
                  required={isCompleted}
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-violet-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800 bg-violet-50/20"
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 transition-all"
            >
              {project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
