import { useState ,useEffect} from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';
import { BookOpen, Mail, Lock, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
//import { useAuth } from '../contexts/AuthContext';
import { useAuthStore } from '../stores/authStore';
import { isAxiosError } from 'axios';

interface LocationState {
  from?: {
    pathname?: string;
  };
}
const AuthPage = () => {
   const { login,register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [touched, setTouched] = useState({
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
    const navigate = useNavigate();
     useEffect(() => {
        if (isAuthenticated) {
          navigate('/home');
        }
      }, [isAuthenticated, navigate]);
    
      useEffect(() => {
        clearError();
        setPasswordError('');
      }, [formData, clearError]);
    
      const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }));
      };
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

       const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    
    setPasswordError('');
    return true;
  };
    const getFieldError = (field: string, value: string) => {
    if (!touched[field as keyof typeof touched]) return '';
    
    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    
    if (field === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }
    
    return '';
  };
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 
  
  const location = useLocation();

   const state = location.state as LocationState | null;
  const from = state?.from?.pathname || "/";
  
    useEffect(() => {
      if (isAuthenticated) {
        console.log('User authenticated, navigating to:', from);
        navigate(from, { replace: true });
      }
    }, [isAuthenticated, navigate, from]);
  
    useEffect(() => {
      clearError();
    }, [email, password, clearError]);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
   
     e.preventDefault();
     try {
       await login({ email, password });
       // Navigation happens automatically
         console.log('Login successful, useEffect will handle navigation');
     } catch (error: unknown) {
       let message = 'Login failed';
       if (isAxiosError(error)) {
         message = error.response?.data?.message || error.message || message;
       } else if (error instanceof Error) {
         message = error.message;
       }
       // Set error in local state or store
       console.error('Error occurred:', message);
     }
   
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
  
      try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        navigate('/home');} catch (error: unknown) {
    let message = 'Registration failed';
    if (isAxiosError(error)) {
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    setPasswordError(message);
    console.error('Error occurred:', error);
  }
  };
const nameError = getFieldError('name', formData.name);
  const emailError = getFieldError('email', formData.email);
  const passwordErrorMsg = getFieldError('password', formData.password);
 

  return (
    <div className="flex min-h-screen bg-hero">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 lg:flex">
        <div className="flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-primary-foreground" />
          <span className="font-display text-2xl font-bold text-primary-foreground">
            BookNest
          </span>
        </div>
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground">
            Your gateway to
            <br />
            endless stories.
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join thousands of book lovers and discover your next great read.
          </p>
        </div>
        {/* <div className="text-sm text-primary-foreground/60">
          © 2024 BookNest. All rights reserved.
        </div> */}
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 flex items-center justify-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="font-display text-xl font-bold">BookNest</span>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-8 shadow-elevated">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                         value={email}
                    onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                         value={password}
                    onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                {/* Demo Accounts */}
           
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                   {(error || passwordError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error || passwordError}
                </div>
              </div>
            )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                           id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    className={`appearance-none block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                      nameError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                       
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    className={`appearance-none block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                      emailError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                        
                      
                      />
                    </div>
                     {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                         id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    className={`appearance-none block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                      passwordErrorMsg ? 'border-red-300' : 'border-gray-300'
                    }`}
                      />
                    </div>
                     {passwordErrorMsg && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrorMsg}</p>
                )}
                  </div>
                  <Button type="submit" variant="hero" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
