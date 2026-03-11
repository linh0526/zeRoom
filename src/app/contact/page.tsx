"use client";

import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col pb-32 font-sans selection:bg-blue-100">
      <Header />
      
      <div className="max-w-[1240px] mx-auto w-full pt-16 px-6">
        <ContactSection />
      </div>
    </main>
  );
}
