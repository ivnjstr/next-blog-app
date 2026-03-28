'use client'
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/admin",
    });
    
    if (res?.error) toast.error("Invalid Admin Credentials");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfc] p-4">
      <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-xl w-full max-w-md">
        <Image src={assets.logo} width={130} alt="Logo" className="mx-auto mb-8" />
        
        <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Admin Email" 
            className="p-3 rounded-xl border border-gray-200 outline-none focus:border-black"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-3 rounded-xl border border-gray-200 outline-none focus:border-black"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
            Login as Admin
          </button>
        </form>

        <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <p className="px-4 text-xs text-gray-400 font-bold uppercase">Or</p>
            <div className="flex-1 h-px bg-gray-100"></div>
        </div>
        
        <button 
          onClick={() => signIn('google', { callbackUrl: '/admin' })}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;