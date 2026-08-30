// Authentication service - Mock implementation
// Replace with actual API calls later

const MOCK_USER = {
  id: 1,
  name: "Rajesh Kumar",
  email: "rajesh@example.com",
  phone: "+91 98765 43210"
};

const DEMO_OTP = "123456";

export const authService = {
  // Register a new user
  register: async (data) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate input
    if (!data.fullName || !data.phone || !data.password) {
      throw new Error("All fields are required");
    }

    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Store in localStorage (for demo only)
    const user = {
      id: Date.now(),
      name: data.fullName,
      email: data.email || "",
      phone: data.phone,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("sahayak_user", JSON.stringify(user));
    localStorage.setItem("sahayak_token", `token_${user.id}`);

    return { success: true, user };
  },

  // Login user
  login: async (emailOrPhone, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!emailOrPhone || !password) {
      throw new Error("Email/Phone and password are required");
    }

    // Mock validation
    if (password !== "demo123") {
      throw new Error("Invalid credentials");
    }

    localStorage.setItem("sahayak_user", JSON.stringify(MOCK_USER));
    localStorage.setItem("sahayak_token", `token_${MOCK_USER.id}`);

    return { success: true, user: MOCK_USER };
  },

  // Send OTP
  sendOTP: async (phone) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!phone) {
      throw new Error("Phone number is required");
    }

    // Mock OTP storage
    localStorage.setItem("sahayak_otp_phone", phone);
    localStorage.setItem("sahayak_otp", DEMO_OTP);
    localStorage.setItem("sahayak_otp_sent_time", Date.now().toString());

    return { success: true, message: `OTP sent to ${phone}` };
  },

  // Verify OTP
  verifyOTP: async (otp) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!otp) {
      throw new Error("OTP is required");
    }

    const storedOTP = localStorage.getItem("sahayak_otp");
    if (otp !== storedOTP) {
      throw new Error("Invalid OTP");
    }

    // Clear OTP
    localStorage.removeItem("sahayak_otp");
    localStorage.removeItem("sahayak_otp_phone");

    return { success: true, message: "OTP verified successfully" };
  },

  // Forgot password - Send OTP
  forgotPassword: async (emailOrPhone) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!emailOrPhone) {
      throw new Error("Email or phone is required");
    }

    localStorage.setItem("sahayak_reset_contact", emailOrPhone);
    localStorage.setItem("sahayak_reset_otp", DEMO_OTP);
    // Reuse the verification flow used by the OTP screen.
    localStorage.setItem("sahayak_otp", DEMO_OTP);

    return { success: true, message: `Reset code sent to ${emailOrPhone}` };
  },

  // Reset password
  resetPassword: async (newPassword, confirmPassword) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!newPassword || !confirmPassword) {
      throw new Error("Passwords are required");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    localStorage.removeItem("sahayak_reset_contact");
    localStorage.removeItem("sahayak_reset_otp");

    return { success: true, message: "Password reset successfully" };
  },

  // Get current user
  getCurrentUser: () => {
    const userJson = localStorage.getItem("sahayak_user");
    const token = localStorage.getItem("sahayak_token");
    
    if (userJson && token) {
      return JSON.parse(userJson);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("sahayak_token");
  },

  // Logout
  logout: () => {
    localStorage.removeItem("sahayak_user");
    localStorage.removeItem("sahayak_token");
    localStorage.removeItem("sahayak_profile");
    return { success: true };
  }
};

export default authService;
