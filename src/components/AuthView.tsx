// src/components/AuthView.tsx
import React from 'react';
import { Lock } from 'lucide-react';

const APP_TITLE = "Garco Comics";
const WELCOME_IMAGE = "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1000&auto=format&fit=crop";

interface AuthViewProps {
  handleLogin: (e: React.FormEvent) => void;
  passwordInput: string;
  setPasswordInput: React.Dispatch<React.SetStateAction<string>>;
  errorMsg: string;
}

const AuthView: React.FC<AuthViewProps> = ({ handleLogin, passwordInput, setPasswordInput, errorMsg }) => {
  return (
    <div className="h-screen w-screen bg-spidey-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={WELCOME_IMAGE} className="w-full h-full object-cover filter brightness-50 blur-sm" alt="Spider-Man background"/>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-tr-3xl rounded-bl-3xl shadow-[8px_8px_0px_0px_rgba(230,36,41,1)] p-8 max-w-md w-full border-4 border-black relative z-10 transform -rotate-1 animate-in fade-in zoom-in-90 duration-500">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-spidey-red rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-black text-white">
            <Lock size={32} />
          </div>
          <h1 className="text-4xl font-comic text-spidey-blue mb-2 text-center tracking-wider uppercase drop-shadow-md">{APP_TITLE}</h1>
          <p className="text-gray-500 text-center font-sans font-bold uppercase tracking-tighter">S.H.I.E.L.D. Access</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-4 py-3 border-4 border-gray-200 focus:border-spidey-red focus:outline-none transition-colors font-bold"
            placeholder="Contrasenya..."
          />
          {errorMsg && <p className="text-spidey-red text-sm font-bold bg-red-50 p-2 border-2 border-red-100">{errorMsg}</p>}
          <button type="submit" className="w-full bg-spidey-blue hover:bg-spidey-darkBlue text-white font-comic text-xl py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-1 active:translate-y-1">ACCEDIR</button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
