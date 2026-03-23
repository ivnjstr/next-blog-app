'use client'
// This is a client component, it can use hooks and other client-side features

import BlogItem from "@/Components/BlogItem";
import BlogList from "@/Components/BlogList";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <>
      <ToastContainer theme="dark" />
      <Header />
      {/* <BlogItem /> */}
      <BlogList />
      <Footer />
    </>
  );
}
