// Standalone local storage service for Freelance Projects and Payments

const STORAGE_KEY = 'apex_freelance_projects';

const DEFAULT_PROJECTS = [
  {
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

export const getFreelanceProjects = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read freelance projects from storage', e);
    return DEFAULT_PROJECTS;
  }
};

export const saveFreelanceProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save freelance projects to storage', e);
  }
};

export const addFreelanceProject = (projectData) => {
  const projects = getFreelanceProjects();
  const newProject = {
    id: 'proj-' + Date.now(),
    title: projectData.title || '',
    receivedDate: projectData.receivedDate || new Date().toISOString().split('T')[0],
    description: projectData.description || '',
    technologies: projectData.technologies || [],
    status: projectData.isCompleted ? 'Completed' : (projectData.status || 'Active'),
    isCompleted: !!projectData.isCompleted,
    completionDate: projectData.isCompleted ? (projectData.completionDate || new Date().toISOString().split('T')[0]) : '',
    payments: projectData.payments || [],
    createdAt: new Date().toISOString()
  };

  const updated = [newProject, ...projects];
  saveFreelanceProjects(updated);
  return updated;
};

export const updateFreelanceProject = (id, projectData) => {
  const projects = getFreelanceProjects();
  const updated = projects.map((p) => {
    if (p.id === id) {
      const isCompleted = !!projectData.isCompleted;
      return {
        ...p,
        title: projectData.title,
        receivedDate: projectData.receivedDate,
        description: projectData.description,
        technologies: projectData.technologies,
        status: isCompleted ? 'Completed' : projectData.status,
        isCompleted,
        completionDate: isCompleted ? projectData.completionDate : '',
      };
    }
    return p;
  });
  saveFreelanceProjects(updated);
  return updated;
};

export const deleteFreelanceProject = (id) => {
  const projects = getFreelanceProjects();
  const updated = projects.filter((p) => p.id !== id);
  saveFreelanceProjects(updated);
  return updated;
};

export const addPaymentToProject = (projectId, paymentData) => {
  const projects = getFreelanceProjects();
  const updated = projects.map((p) => {
    if (p.id === projectId) {
      const newPayment = {
        id: 'pay-' + Date.now(),
        title: paymentData.title || 'Payment',
        amount: parseFloat(paymentData.amount) || 0,
        date: paymentData.date || new Date().toISOString().split('T')[0],
        method: paymentData.method || 'Bank Transfer',
        status: paymentData.status || 'Received',
        transactionId: paymentData.transactionId || '',
        notes: paymentData.notes || ''
      };
      return {
        ...p,
        payments: [...(p.payments || []), newPayment]
      };
    }
    return p;
  });
  saveFreelanceProjects(updated);
  return updated;
};

export const updatePaymentInProject = (projectId, paymentId, paymentData) => {
  const projects = getFreelanceProjects();
  const updated = projects.map((p) => {
    if (p.id === projectId) {
      const updatedPayments = (p.payments || []).map((pay) => {
        if (pay.id === paymentId) {
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
  saveFreelanceProjects(updated);
  return updated;
};

export const deletePaymentFromProject = (projectId, paymentId) => {
  const projects = getFreelanceProjects();
  const updated = projects.map((p) => {
    if (p.id === projectId) {
      return {
        ...p,
        payments: (p.payments || []).filter((pay) => pay.id !== paymentId)
      };
    }
    return p;
  });
  saveFreelanceProjects(updated);
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
