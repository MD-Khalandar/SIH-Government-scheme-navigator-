// Application service - Mock implementation
// Replace with actual API calls later

export const applicationService = {
  // Get all applications
  getApplications: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const appsJson = localStorage.getItem("sahayak_applications");
    if (!appsJson) {
      return { success: true, data: [] };
    }
    
    return { success: true, data: JSON.parse(appsJson) };
  },

  // Create new application
  createApplication: async (schemeId, schemeName) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const appsJson = localStorage.getItem("sahayak_applications");
    let applications = appsJson ? JSON.parse(appsJson) : [];
    
    const newApp = {
      id: Date.now(),
      schemeId,
      schemeName,
      status: "Not Started",
      applicationDate: new Date().toISOString(),
      progress: 0,
      currentStep: 1,
      totalSteps: 6,
      notes: ""
    };
    
    applications.push(newApp);
    localStorage.setItem("sahayak_applications", JSON.stringify(applications));
    
    return { success: true, data: newApp };
  },

  // Get application by ID
  getApplicationById: async (applicationId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const appsJson = localStorage.getItem("sahayak_applications");
    if (!appsJson) {
      throw new Error("Application not found");
    }
    
    const applications = JSON.parse(appsJson);
    const app = applications.find(a => a.id === applicationId);
    
    if (!app) {
      throw new Error("Application not found");
    }
    
    return { success: true, data: app };
  },

  // Update application status
  updateApplicationStatus: async (applicationId, status, progress, currentStep) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const appsJson = localStorage.getItem("sahayak_applications");
    if (!appsJson) {
      throw new Error("Application not found");
    }
    
    let applications = JSON.parse(appsJson);
    const app = applications.find(a => a.id === applicationId);
    
    if (!app) {
      throw new Error("Application not found");
    }
    
    app.status = status;
    app.progress = progress;
    app.currentStep = currentStep;
    
    localStorage.setItem("sahayak_applications", JSON.stringify(applications));
    
    return { success: true, data: app };
  },

  // Get application roadmap
  getApplicationRoadmap: async (scheme) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const steps = scheme.applicationSteps || [
      "Check eligibility",
      "Prepare documents",
      "Register on official portal",
      "Fill application form",
      "Submit documents",
      "Track application"
    ];
    
    const roadmap = steps.map((step, index) => ({
      id: index + 1,
      title: step,
      description: `Step ${index + 1} of ${steps.length}`,
      status: index === 0 ? "current" : "locked",
      estimatedTime: "2-3 days"
    }));
    
    return { success: true, data: roadmap };
  },

  // Get all notifications
  getNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const notificationsJson = localStorage.getItem("sahayak_notifications");
    if (!notificationsJson) {
      return { success: true, data: [] };
    }
    
    return { success: true, data: JSON.parse(notificationsJson) };
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const notificationsJson = localStorage.getItem("sahayak_notifications");
    if (!notificationsJson) {
      return { success: true };
    }
    
    let notifications = JSON.parse(notificationsJson);
    const notif = notifications.find(n => n.id === notificationId);
    
    if (notif) {
      notif.read = true;
      localStorage.setItem("sahayak_notifications", JSON.stringify(notifications));
    }
    
    return { success: true };
  }
};

export default applicationService;
