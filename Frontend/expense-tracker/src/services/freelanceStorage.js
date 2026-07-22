// Service layer for Freelance Projects and Payments with Backend API Integration and LocalStorage Fallback

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:3000';
const STORAGE_KEY = 'apex_freelance_projects';

const DEFAULT_PROJECTS = [
  {
    _id: 'proj-1',
    id: 'proj-1',
    title: 'E-Commerce Mobile App Redesign',
    receivedDate: '2026-06-01',
    description: 'Complete UI/UX redesign and React Native frontend development for online store.',
    technologies: ['React Native', 'TypeScript', 'TailwindCSS', 'Redux Toolkit'],
    status: 'Active',
    isCompleted: false,
    completionDate: '',
    payments: [
      {
        _id: 'pay-101',
        id: 'pay-101',
        title: 'Initial Deposit (30%)',
        amount: 45000,
        date: '2026-06-02',
        method: 'Bank Transfer',
        status: 'Received',
        transactionId: 'TXN-984210492',
        notes: 'Advance received upon signing contract.'
      },
      {
        _id: 'pay-102',
        id: 'pay-102',
        title: 'Milestone 1 - Figma & UI Handover',
        amount: 35000,
        date: '2026-06-20',
        method: 'UPI',
        status: 'Received',
        transactionId: 'UPI/617281920/RE',
        notes: 'Wire transfer confirmed.'
      },
      {
        _id: 'pay-103',
        id: 'pay-103',
        title: 'Milestone 2 - App Beta Release',
        amount: 40000,
        date: '2026-07-25',
        method: 'Bank Transfer',
        status: 'Pending',
        transactionId: '',
        notes: 'Scheduled upon testflight submission.'
      }
    ],
    createdAt: '2026-06-01T10:00:00.000Z'
  },
  {
    _id: 'proj-2',
    id: 'proj-2',
    title: 'AI Customer Service Bot Dashboard',
    receivedDate: '2026-05-10',
    description: 'Web portal with real-time analytics dashboard and OpenAI LLM fine-tuning integration.',
    technologies: ['Node.js', 'Express', 'React', 'Python', 'OpenAI API'],
    status: 'Completed',
    isCompleted: true,
    completionDate: '2026-07-15',
    payments: [
      {
        _id: 'pay-201',
        id: 'pay-201',
        title: 'Full Payment',
        amount: 85000,
        date: '2026-07-15',
        method: 'Stripe',
        status: 'Received',
        transactionId: 'ch_3N1984712094',
        notes: 'Full payment cleared after deployment.'
      }
    ],
    createdAt: '2026-05-10T14:30:00.000Z'
  }
];

const formatProjectData = (p) => ({
  ...p,
  id: p._id || p.id,
  payments: (p.payments || []).map((pay) => ({
    ...pay,
    id: pay._id || pay.id
  }))
});

// Helper for local storage backup
const getLocalProjects = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_PROJECTS;
  }
};

const saveLocalProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {}
};

// GET /api/v1/freelance
export const getFreelanceProjects = async () => {
  const token = localStorage.getItem('token');
  if (!token) return getLocalProjects();

  try {
    const response = await fetch(`${getApiUrl()}/api/v1/freelance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (response.ok && data.projects) {
      const formatted = data.projects.map(formatProjectData);
      saveLocalProjects(formatted);
      return formatted;
    }
  } catch (err) {
    console.warn('API unavailable, loading local freelance storage:', err.message);
  }
  return getLocalProjects();
};

// POST /api/v1/freelance
export const addFreelanceProject = async (projectData) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/freelance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
      const data = await response.json();
      if (response.ok && data.project) {
        return getFreelanceProjects();
      }
    } catch (err) {
      console.warn('API error during addProject:', err.message);
    }
  }

  // Fallback to localStorage
  const local = getLocalProjects();
  const newProject = {
    _id: 'proj-' + Date.now(),
    id: 'proj-' + Date.now(),
    title: projectData.title || '',
    receivedDate: projectData.receivedDate || new Date().toISOString().split('T')[0],
    description: projectData.description || '',
    technologies: projectData.technologies || [],
    status: projectData.isCompleted ? 'Completed' : (projectData.status || 'Active'),
    isCompleted: !!projectData.isCompleted,
    completionDate: projectData.isCompleted ? (projectData.completionDate || new Date().toISOString().split('T')[0]) : '',
    payments: [],
    createdAt: new Date().toISOString()
  };
  const updated = [newProject, ...local];
  saveLocalProjects(updated);
  return updated;
};

// PUT /api/v1/freelance/:id
export const updateFreelanceProject = async (id, projectData) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/freelance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
      if (response.ok) {
        return getFreelanceProjects();
      }
    } catch (err) {
      console.warn('API error during updateProject:', err.message);
    }
  }

  // Fallback to localStorage
  const local = getLocalProjects();
  const updated = local.map((p) => {
    if (p.id === id || p._id === id) {
      const isCompleted = !!projectData.isCompleted;
      return {
        ...p,
        title: projectData.title,
        receivedDate: projectData.receivedDate,
        description: projectData.description,
        technologies: projectData.technologies,
        status: isCompleted ? 'Completed' : projectData.status,
        isCompleted,
        completionDate: isCompleted ? projectData.completionDate : ''
      };
    }
    return p;
  });
  saveLocalProjects(updated);
  return updated;
};

// DELETE /api/v1/freelance/:id
export const deleteFreelanceProject = async (id) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/freelance/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        return getFreelanceProjects();
      }
    } catch (err) {
      console.warn('API error during deleteProject:', err.message);
    }
  }

  // Fallback to localStorage
  const local = getLocalProjects();
  const updated = local.filter((p) => p.id !== id && p._id !== id);
  saveLocalProjects(updated);
  return updated;
};

// POST /api/v1/freelance/:id/payments
export const addPaymentToProject = async (projectId, paymentData) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/freelance/${projectId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      if (response.ok) {
        return getFreelanceProjects();
      }
    } catch (err) {
      console.warn('API error during addPayment:', err.message);
    }
  }

  // Fallback to localStorage
  const local = getLocalProjects();
  const updated = local.map((p) => {
    if (p.id === projectId || p._id === projectId) {
      const newPayment = {
        _id: 'pay-' + Date.now(),
        id: 'pay-' + Date.now(),
        title: paymentData.title || 'Payment',
        amount: parseFloat(paymentData.amount) || 0,
        date: paymentData.date || new Date().toISOString().split('T')[0],
        method: paymentData.method || 'Bank Transfer',
        status: paymentData.status || 'Received',
        transactionId: paymentData.transactionId || '',
        notes: paymentData.notes || ''
      };
      return { ...p, payments: [...(p.payments || []), newPayment] };
    }
    return p;
  });
  saveLocalProjects(updated);
  return updated;
};

// PUT /api/v1/freelance/:id/payments/:paymentId
export const updatePaymentInProject = async (projectId, paymentId, paymentData) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/freelance/${projectId}/payments/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      if (response.ok) {
        return getFreelanceProjects();
      }
    } catch (err) {
      console.warn('API error during updatePayment:', err.message);
    }
  }

  // Fallback to localStorage
  const local = getLocalProjects();
  const updated = local.map((p) => {
    if (p.id === projectId || p._id === projectId) {
      const updatedPayments = (p.payments || []).map((pay) => {
        if (pay.id === paymentId || pay._id === paymentId) {
          return {
            ...pay,
            title: paymentData.title,
            amount: parseFloat(paymentData.amount) || 0,
            date: paymentData.date,
            method: paymentData.method,
            status: paymentData.status,
            transactionId: paymentData.transactionId || '',
            notes: paymentData.notes || ''
          };
        }
        return pay;
      });
      return { ...p, payments: updatedPayments };
    }
    return p;
  });
  saveLocalProjects(updated);
  return updated;
};

// DELETE /api/v1/freelance/:id/payments/:paymentId
export const deletePaymentFromProject = async (projectId, paymentId) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/freelance/${projectId}/payments/${paymentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        return getFreelanceProjects();
      }
    } catch (err) {
      console.warn('API error during deletePayment:', err.message);
    }
  }

  // Fallback to localStorage
  const local = getLocalProjects();
  const updated = local.map((p) => {
    if (p.id === projectId || p._id === projectId) {
      return {
        ...p,
        payments: (p.payments || []).filter((pay) => pay.id !== paymentId && pay._id !== paymentId)
      };
    }
    return p;
  });
  saveLocalProjects(updated);
  return updated;
};

export const calculateProjectFinancials = (project) => {
  const payments = project.payments || [];
  const totalValue = payments.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const totalReceived = payments
    .filter((p) => p.status === 'Received')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const totalPending = payments
    .filter((p) => p.status === 'Pending')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  return {
    totalValue,
    totalReceived,
    totalPending
  };
};
