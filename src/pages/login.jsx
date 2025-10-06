import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageTitle from "@/components/ui/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/authService";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectUrl = authService.getRoleRedirectUrl(user.role);

      router.push(redirectUrl);
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (loginError) {
      setLoginError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setLoginError("Email/Username dan password wajib diisi");
      toast.error("Email/Username dan password wajib diisi");

      return;
    }

    setIsLoading(true);
    setLoginError(""); // Clear any previous error

    try {
      await login(formData);
      // If login is successful, the user will be redirected by the useEffect hook
    } catch (error) {
      // Handle login error without refreshing the page
      const errorMessage = error.message || "Login gagal. Silakan coba lagi.";

      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <PageTitle
        description="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi. Bergabunglah bersama kami dalam ibadah, persekutuan, dan pelayanan."
        title="Login Page"
      />
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            GMIT Imanuel Oepura
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Masuk ke akun Anda
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email/Username Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="identifier"
              >
                Email atau Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  required
                  autoComplete="username"
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                    loginError
                      ? "border-red-300"
                      : "border-gray-300 dark:border-gray-600"
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors`}
                  disabled={isLoading}
                  id="identifier"
                  name="identifier"
                  placeholder="Masukkan email atau username"
                  type="text"
                  value={formData.identifier}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  required
                  autoComplete="current-password"
                  className={`appearance-none relative block w-full pl-10 pr-12 py-3 border ${
                    loginError
                      ? "border-red-300"
                      : "border-gray-300 dark:border-gray-600"
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors`}
                  disabled={isLoading}
                  id="password"
                  name="password"
                  placeholder="Masukkan password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  className="absolute inset-y-0 right-0 pr-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  disabled={isLoading}
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  <div className="p-1">
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="text-red-500 text-sm text-center py-2 px-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                {loginError}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Masuk
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
