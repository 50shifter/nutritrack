/**
 * Server Actions для аутентификации FinFlow
 * 🔒 Fixed: Demo login requires correct password (was: any non-empty password)
 * Credentials are server-side only — never exposed to client.
 */

"use server";

import { createClient } from "@supabase/supabase-js";

// Demo mode - credentials stored server-side only
const DEMO_EMAIL = "demo@finflow.com";
const DEMO_PASSWORD = "demo123";  // Demo password — change in development
const DEMO_NAME = "Алексей";

export interface LoginResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  // Validate email format
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { success: false, error: "Неверный email или пароль" };
  }

  // Validate password length
  if (!password || typeof password !== 'string' || password.length < 1) {
    return { success: false, error: "Неверный email или пароль" };
  }

  // Try Supabase Auth first (production path)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!authError && data.session) {
      return {
        success: true,
        redirectTo: "/dashboard",
      };
    }
  }

  // Demo fallback — 🔒 FIXED: requires BOTH correct email AND password
  if (process.env.ALLOW_DEMO_LOGIN === "true" && 
      email === DEMO_EMAIL && 
      password === DEMO_PASSWORD) {
    return {
      success: true,
      redirectTo: "/dashboard",
    };
  }

  return { success: false, error: "Неверный email или пароль" };
}

export async function logout(): Promise<void> {
  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("finflow_user");
    localStorage.removeItem("finflow_user_name");
    localStorage.removeItem("finflow_auth");
  }
}