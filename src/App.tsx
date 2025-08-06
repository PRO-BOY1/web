import { Authenticated, Unauthenticated, useQuery, useAction } from "convex/react";
import { useState } from "react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./Dashboard";
import { CustomSignInForm } from "./CustomSignInForm";
import { Sidebar } from "./Sidebar";

export default function App() {
  const [showDebug, setShowDebug] = useState(false);
  const testConnection = useAction(api.mongodb.testMongoConnection);
  const [connectionResult, setConnectionResult] = useState<any>(null);

  const handleTestConnection = async () => {
    try {
      const result = await testConnection();
      setConnectionResult(result);
    } catch (error) {
      setConnectionResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Authenticated>
        <div className="flex h-screen">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <header className="bg-red-800 shadow-lg h-16 flex justify-between items-center px-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">Law Town RP</h1>
                <span className="text-red-200 text-sm">Grand Theft Auto Roleplay Server</span>
              </div>
              <SignOutButton />
            </header>
            <main className="flex-1 p-6 bg-gray-900">
              <Dashboard />
            </main>
          </div>
          
          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="min-h-screen login-container flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Logo/Header Section */}
            <div className="text-center mb-10">
              <div className="login-logo w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://media.discordapp.net/attachments/1317518281380462692/1402398436468195388/logo.png?ex=6893c4d2&is=68927352&hm=b94352a739dc407375f0c3fa014bbf3a7c69ef18a784fc353f9630b4cb903d96&=&format=webp&quality=lossless&width=512&height=512"
                  alt="Law Town RP Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a default icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <svg class="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      `;
                    }
                  }}
                />
              </div>
              <h1 className="text-5xl font-bold text-white mb-3">Law Town RP</h1>
              <p className="text-gray-300 text-xl font-medium">Roleplay Server</p>
            </div>

            {/* Login Form Card */}
            <div className="login-card rounded-2xl p-10 shadow-2xl">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Sign In</h2>
              
              <div className="space-y-6">
                <CustomSignInForm />
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Need access? Contact server administrators
              </p>
            </div>
          </div>
        </div>
      </Unauthenticated>
      
      <Toaster 
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#374151',
            color: '#fff',
            border: '1px solid #4B5563'
          }
        }}
      />
    </div>
  );
}
