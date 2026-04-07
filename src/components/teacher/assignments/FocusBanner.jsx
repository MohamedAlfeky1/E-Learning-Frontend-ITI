import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const FocusBanner = ({ title, description, buttonText, onStartFocus }) => {
  return (
    <div className="bg-indigo-50/50 rounded-3xl p-10 flex items-center justify-between mt-8 overflow-hidden relative">
      <div className="max-w-md z-10">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-6">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">{description}</p>
        <Button 
          onClick={onStartFocus}
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 text-base font-medium transition-transform active:scale-[0.98]"
        >
          {buttonText}
        </Button>
      </div>
      
      <div className="relative w-64 h-64 z-10 shrink-0 hidden md:block mr-10 shadow-xl rounded-2xl overflow-hidden border-4 border-white">
        <img 
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" 
          alt="AI Assistant" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 right-20 -translate-y-1/2 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
    </div>
  );
};

export default FocusBanner;
