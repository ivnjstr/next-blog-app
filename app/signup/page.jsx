'use client'
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/Assets/assets";
import axios from "axios";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const avatarPreview = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : null),
    [avatarFile]
  );

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password and confirmation don't match.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      if (avatarFile) formData.append("image", avatarFile);

      const res = await axios.post("/api/auth/register", formData);
      if (!res.data.success) {
        setError(res.data.msg || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (signInRes?.error) {
        setError("Account created, but automatic sign-in failed. Please log in.");
        setSubmitting(false);
      } else if (signInRes?.url) {
        window.location.href = signInRes.url;
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfc] p-4">
      <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-xl w-full max-w-md">
        <Image src={assets.logo} width={130} alt="Logo" className="mx-auto mb-8" />

        {error && (
          <div className="flex items-start gap-2.5 mb-4 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zM9 6a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Optional avatar */}
          <div className="flex flex-col items-center gap-2 mb-1">
            <label htmlFor="avatar" className="cursor-pointer group relative">
              <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-200 overflow-hidden bg-white group-hover:border-black transition-all">
                <Image
                  src={avatarPreview || assets.profile_icon}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized={!!avatarFile}
                />
              </div>
              <span className="absolute bottom-0 right-0 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">EDIT</span>
            </label>
            <input onChange={(e) => setAvatarFile(e.target.files[0])} type="file" id="avatar" accept="image/*" hidden />
            <p className="text-[11px] text-gray-400">Profile picture (optional)</p>
          </div>

          <input
            type="text"
            placeholder="Full Name"
            className={`p-3 rounded-xl border outline-none transition-all ${error ? 'border-red-200 focus:border-red-400' : 'border-gray-200 focus:border-black'}`}
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className={`p-3 rounded-xl border outline-none transition-all ${error ? 'border-red-200 focus:border-red-400' : 'border-gray-200 focus:border-black'}`}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={`p-3 rounded-xl border outline-none transition-all ${error ? 'border-red-200 focus:border-red-400' : 'border-gray-200 focus:border-black'}`}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={`p-3 rounded-xl border outline-none transition-all ${error ? 'border-red-200 focus:border-red-400' : 'border-gray-200 focus:border-black'}`}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link href="/login" className="font-bold text-black hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
