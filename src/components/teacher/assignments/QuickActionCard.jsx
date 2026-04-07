import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QuickActionCard = ({ subtitle, title, actionText, onAction }) => {
  return (
    <Card className="p-6 h-40 flex flex-col justify-center bg-indigo-600 text-white border-0 shine-effect relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-sm font-medium text-indigo-100 mb-2">{subtitle}</p>
        <h3 className="text-xl font-bold mb-4 pr-10">{title}</h3>
        <Button 
          variant="secondary" 
          className="bg-white/20 text-white hover:bg-white/30 border-0 h-9 px-4 text-sm font-medium w-fit transition-colors"
          onClick={onAction}
        >
          {actionText}
        </Button>
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
    </Card>
  );
};

export default QuickActionCard;
