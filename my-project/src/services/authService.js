import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  RecaptchaVerifier
} from 'firebase/auth';
import { auth } from '../../firebase';

let recaptchaVerifier = null;
let pendingPhoneConfirmation = null;

const getConfiguredAuth = () => {
  if (!auth) {
    throw new Error('Firebase is not configured. Add valid VITE_FIREBASE_* values to .env.local and restart the dev server.');
  }
  return auth;
};

const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  return cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
};

const ensureRecaptcha = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }

  let container = document.getElementById('recaptcha-container');
  if (container) {
    container.remove();
  }

  container = document.createElement('div');
  container.id = 'recaptcha-container';
  container.style.display = 'none';
  document.body.appendChild(container);

  recaptchaVerifier = new RecaptchaVerifier(getConfiguredAuth(), 'recaptcha-container', {
    size: 'invisible',
    callback: () => {},
    'expired-callback': () => {
      recaptchaVerifier = null;
    }
  });

  return recaptchaVerifier;
};

const mapFirebaseUser = (firebaseUser, fallback = null) => {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || fallback?.name || '',
    email: firebaseUser.email || fallback?.email || '',
    phone: fallback?.phone || firebaseUser.phoneNumber || ''
  };
};

const storeCurrentUser = (user) => {
  if (!user) {
    localStorage.removeItem('sahayak_user');
    localStorage.removeItem('sahayak_token');
    return;
  }

  localStorage.setItem('sahayak_user', JSON.stringify(user));
  localStorage.setItem('sahayak_token', auth?.currentUser?.accessToken || 'firebase-phone-auth');
};

export const authService = {
  register: async (data) => {
    if (!data?.fullName || !data?.email || !data?.phone || !data?.password) {
      throw new Error('Full name, email, phone, and password are required');
    }

    if (!data.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const userCredential = await createUserWithEmailAndPassword(
      getConfiguredAuth(),
      data.email.trim(),
      data.password
    );

    await updateProfile(userCredential.user, {
      displayName: data.fullName.trim()
    });

    const user = mapFirebaseUser(userCredential.user, {
      name: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim()
    });

    const savedProfile = JSON.parse(localStorage.getItem('sahayak_profile') || '{}');
    localStorage.setItem('sahayak_profile', JSON.stringify({
      ...savedProfile,
      name: user.name,
      email: user.email,
      phone: user.phone,
      onboardingStep: savedProfile.onboardingStep || 1
    }));

    storeCurrentUser(user);

    return { success: true, user };
  },

  login: async (emailOrPhone, password) => {
    if (!emailOrPhone || !password) {
      throw new Error('Email and password are required');
    }

    const email = emailOrPhone.trim();
    if (!email.includes('@')) {
      throw new Error('Please use your email address to sign in');
    }

    const userCredential = await signInWithEmailAndPassword(getConfiguredAuth(), email, password);
    const user = mapFirebaseUser(userCredential.user);

    storeCurrentUser(user);

    return { success: true, user };
  },

  sendPhoneOTP: async (phone) => {
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone) {
      throw new Error('Phone number is required');
    }

    const verifier = ensureRecaptcha();
    if (!verifier) {
      throw new Error('Phone authentication is not available in this browser');
    }

    pendingPhoneConfirmation = await signInWithPhoneNumber(getConfiguredAuth(), normalizedPhone, verifier);

    return { success: true, message: `OTP sent to ${normalizedPhone}` };
  },

  verifyPhoneLogin: async (otp) => {
    if (!pendingPhoneConfirmation) {
      throw new Error('No active phone verification session found');
    }

    const credential = await pendingPhoneConfirmation.confirm(otp);
    const user = mapFirebaseUser(credential.user);

    const savedProfile = JSON.parse(localStorage.getItem('sahayak_profile') || '{}');
    localStorage.setItem('sahayak_profile', JSON.stringify({
      ...savedProfile,
      name: user?.name || savedProfile.name || '',
      email: user?.email || savedProfile.email || '',
      phone: savedProfile.phone || user?.phone || '',
      onboardingStep: savedProfile.onboardingStep || 1
    }));

    storeCurrentUser(user);
    pendingPhoneConfirmation = null;
    return { success: true, user };
  },

  verifyPhoneRegister: async ({ otp, fullName, phone }) => {
    if (!pendingPhoneConfirmation) {
      throw new Error('No active phone registration session found');
    }

    const credential = await pendingPhoneConfirmation.confirm(otp);
    const user = credential.user;

    if (fullName) {
      await updateProfile(user, { displayName: fullName.trim() });
    }

    const finalUser = mapFirebaseUser(user, {
      name: fullName || '',
      email: user.email || '',
      phone: phone || normalizePhoneNumber(phone)
    });

    const savedProfile = JSON.parse(localStorage.getItem('sahayak_profile') || '{}');
    localStorage.setItem('sahayak_profile', JSON.stringify({
      ...savedProfile,
      name: finalUser.name,
      email: finalUser.email,
      phone: finalUser.phone,
      onboardingStep: savedProfile.onboardingStep || 1
    }));

    storeCurrentUser(finalUser);
    pendingPhoneConfirmation = null;
    return { success: true, user: finalUser };
  },

  sendOTP: async (phone) => {
    return authService.sendPhoneOTP(phone);
  },

  forgotPassword: async (email) => {
    if (!email || !email.includes('@')) {
      throw new Error('Email is required');
    }
    await sendPasswordResetEmail(getConfiguredAuth(), email.trim());
    return { success: true, message: `Password reset link sent to ${email}` };
  },

  getCurrentUser: () => {
    if (auth?.currentUser) {
      return mapFirebaseUser(auth.currentUser);
    }

    return null;
  },

  isAuthenticated: () => {
    return !!auth?.currentUser;
  },

  logout: async () => {
    try {
      if (auth) await signOut(auth);
    } catch (error) {
      console.warn('Firebase sign-out warning:', error);
    }

    localStorage.removeItem('sahayak_user');
    localStorage.removeItem('sahayak_token');
    localStorage.removeItem('sahayak_profile');
    pendingPhoneConfirmation = null;

    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    return { success: true };
  }
};

export default authService;
