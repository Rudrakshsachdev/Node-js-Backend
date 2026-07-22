import React, { useState, useEffect } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Footer from '../Dashboard/Footer';
import ProjectModal from './ProjectModal';
import PaymentModal from './PaymentModal';
import ProjectDetailsDrawer from './ProjectDetailsDrawer';
import {
  getFreelanceProjects,
  addFreelanceProject,
  updateFreelanceProject,
  deleteFreelanceProject,
  addPaymentToProject,
  updatePaymentInProject,
  deletePaymentFromProject,
  calculateProjectFinancials
} from '../../services/freelanceStorage';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  IndianRupee,
  CheckCircle2,
  Clock,
  Code2,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  ExternalLink,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function FreelancePage() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals & Drawers state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [targetProjectIdForPayment, setTargetProjectIdForPayment] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  const [drawerProject, setDrawerProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await getFreelanceProjects();
    setProjects(data);

    if (drawerProject) {
      const refreshed = data.find((p) => (p.id || p._id) === (drawerProject.id || drawerProject._id));
      setDrawerProject(refreshed || null);
    }
  };

  // KPI calculations
  const totalProjectsCount = projects.length;
  const activeProjectsCount = projects.filter((p) => p.status === 'Active').length;
  const completedProjectsCount = projects.filter((p) => p.status === 'Completed').length;

  let grandTotalValue = 0;
  let grandTotalReceived = 0;
  let grandTotalPending = 0;

  projects.forEach((p) => {
    const fin = calculateProjectFinancials(p);
    grandTotalValue += fin.totalValue;
    grandTotalReceived += fin.totalReceived;
    grandTotalPending += fin.totalPending;
  });

  // Extract unique tech tags across all projects
  const allTechs = Array.from(
    new Set(projects.flatMap((p) => p.technologies || []))
  ).sort();

  // Handlers for Project CRUD
  const handleOpenNewProjectModal = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProjectModal = (proj) => {
    setEditingProject(proj);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (projectData) => {
    let updated;
    if (editingProject) {
      updated = await updateFreelanceProject(editingProject.id || editingProject._id, projectData);
    } else {
      updated = await addFreelanceProject(projectData);
    }
    setProjects(updated);
    if (drawerProject && editingProject && (drawerProject.id || drawerProject._id) === (editingProject.id || editingProject._id)) {
      const refreshed = updated.find((p) => (p.id || p._id) === (editingProject.id || editingProject._id));
      setDrawerProject(refreshed || null);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this freelance project?')) return;
    const updated = await deleteFreelanceProject(projectId);
    setProjects(updated);
    if (drawerProject && (drawerProject.id || drawerProject._id) === projectId) {
      setIsDrawerOpen(false);
      setDrawerProject(null);
    }
  };

  // Handlers for Payment CRUD
  const handleOpenAddPayment = (projectId) => {
    setTargetProjectIdForPayment(projectId);
    setEditingPayment(null);
    setIsPaymentModalOpen(true);
  };

  const handleOpenEditPayment = (projectId, payment) => {
    setTargetProjectIdForPayment(projectId);
    setEditingPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = async (paymentData) => {
    if (!targetProjectIdForPayment) return;
    let updated;
    if (editingPayment) {
      updated = await updatePaymentInProject(targetProjectIdForPayment, editingPayment.id || editingPayment._id, paymentData);
    } else {
      updated = await addPaymentToProject(targetProjectIdForPayment, paymentData);
    }
    setProjects(updated);
    if (drawerProject && (drawerProject.id || drawerProject._id) === targetProjectIdForPayment) {
      const refreshed = updated.find((p) => (p.id || p._id) === targetProjectIdForPayment);
      setDrawerProject(refreshed || null);
    }
  };

  const handleDeletePayment = async (projectId, paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment entry?')) return;
    const updated = await deletePaymentFromProject(projectId, paymentId);
    setProjects(updated);
    if (drawerProject && (drawerProject.id || drawerProject._id) === projectId) {
      const refreshed = updated.find((p) => (p.id || p._id) === projectId);
      setDrawerProject(refreshed || null);
    }
  };

  const handleOpenDrawer = (proj) => {
    setDrawerProject(proj);
    setIsDrawerOpen(true);
  };

  // Search, filter, and sort logic
  const filteredProjects = projects
    .filter((p) => {
      // Search title, description, or tech stack
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.technologies || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      // Tech filter
      const matchesTech = techFilter === 'All' || (p.technologies || []).includes(techFilter);

      return matchesSearch && matchesStatus && matchesTech;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || b.receivedDate) - new Date(a.createdAt || a.receivedDate);
      if (sortBy === 'oldest') return new Date(a.createdAt || a.receivedDate) - new Date(b.createdAt || b.receivedDate);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'value') {
        return calculateProjectFinancials(b).totalValue - calculateProjectFinancials(a).totalValue;
      }
      return 0;
    });

  const getTargetProjectTitle = () => {
    if (!targetProjectIdForPayment) return '';
    const p = projects.find((proj) => proj.id === targetProjectIdForPayment);
    return p ? p.title : '';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row">
      <Sidebar />

      <main className="flex-1 min-w-0 pb-12 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-md shadow-violet-500/10 text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Freelance Project Tracking
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Track freelance engagements, milestone payments, technology stacks, and revenue.
              </p>
            </div>

            <button
              onClick={handleOpenNewProjectModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>

          {/* Summary Statistics KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Total Projects */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-slate-500">Total Projects</p>
              <h3 className="text-xl font-bold text-slate-900">{totalProjectsCount}</h3>
              <p className="text-[10px] text-slate-400">All engagements</p>
            </div>

            {/* Active Projects */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-indigo-600">Active Projects</p>
              <h3 className="text-xl font-bold text-slate-900">{activeProjectsCount}</h3>
              <p className="text-[10px] text-indigo-500">In progress</p>
            </div>

            {/* Completed Projects */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-emerald-600">Completed</p>
              <h3 className="text-xl font-bold text-slate-900">{completedProjectsCount}</h3>
              <p className="text-[10px] text-emerald-500">Delivered</p>
            </div>

            {/* Overall Project Value / Total Earnings */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-slate-500">Total Earnings</p>
              <h3 className="text-lg font-bold text-slate-900 truncate">
                ₹{grandTotalValue.toLocaleString('en-IN')}
              </h3>
              <p className="text-[10px] text-slate-400">Overall value</p>
            </div>

            {/* Received Payments */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-emerald-600">Payments Received</p>
              <h3 className="text-lg font-bold text-emerald-600 truncate">
                ₹{grandTotalReceived.toLocaleString('en-IN')}
              </h3>
              <p className="text-[10px] text-emerald-500">Cleared in bank</p>
            </div>

            {/* Pending Payments */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-amber-600">Pending Payments</p>
              <h3 className="text-lg font-bold text-amber-600 truncate">
                ₹{grandTotalPending.toLocaleString('en-IN')}
              </h3>
              <p className="text-[10px] text-amber-500">Outstanding</p>
            </div>

          </div>

          {/* Controls: Search, Filter, Sort */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects by title, description or tech..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-800"
              />
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-medium text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Tech Filter */}
              {allTechs.length > 0 && (
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-500">Tech:</span>
                  <select
                    value={techFilter}
                    onChange={(e) => setTechFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Tech</option>
                    {allTechs.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort By */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-medium text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="value">Highest Value</option>
                </select>
              </div>

            </div>

          </div>

          {/* Project Grid */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No freelance projects found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'All' || techFilter !== 'All'
                  ? 'Try adjusting your search query or status filter.'
                  : 'Get started by creating your first freelance project to track scope and payments.'}
              </p>
              <button
                onClick={handleOpenNewProjectModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 transition-all mt-2"
              >
                <Plus className="w-4 h-4" /> Add First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const { totalValue, totalReceived, totalPending } = calculateProjectFinancials(project);
                const paymentCount = (project.payments || []).length;

                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Card Top / Header */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            project.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : project.status === 'Inactive'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {project.status}
                        </span>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenAddPayment(project.id)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Add Payment (+)"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditProjectModal(project)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Edit Project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Dates */}
                      <div>
                        <h3
                          onClick={() => handleOpenDrawer(project)}
                          className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors cursor-pointer line-clamp-1"
                        >
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Received: {project.receivedDate || 'N/A'}
                          </span>
                          {project.isCompleted && project.completionDate && (
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {project.completionDate}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description snippet */}
                      {project.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      {/* Tech Stack Badges */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-100"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Financial Summary Footer */}
                    <div className="bg-slate-50/70 p-4 border-t border-slate-100 space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Value</p>
                          <p className="text-xs font-extrabold text-slate-800 truncate">
                            ₹{totalValue.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-semibold text-emerald-600 uppercase">Received</p>
                          <p className="text-xs font-extrabold text-emerald-600 truncate">
                            ₹{totalReceived.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-semibold text-amber-600 uppercase">Pending</p>
                          <p className="text-xs font-extrabold text-amber-600 truncate">
                            ₹{totalPending.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500 font-medium">
                          {paymentCount} payment record{paymentCount === 1 ? '' : 's'}
                        </span>
                        <button
                          onClick={() => handleOpenDrawer(project)}
                          className="inline-flex items-center gap-1 font-bold text-violet-600 hover:text-violet-700"
                        >
                          View Details & Payments <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Footer />
        </div>
      </main>

      {/* Modals & Drawers */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePayment}
        payment={editingPayment}
        projectTitle={getTargetProjectTitle()}
      />

      <ProjectDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        project={drawerProject}
        onEditProject={handleOpenEditProjectModal}
        onAddPayment={handleOpenAddPayment}
        onEditPayment={handleOpenEditPayment}
        onDeletePayment={handleDeletePayment}
      />
    </div>
  );
}
