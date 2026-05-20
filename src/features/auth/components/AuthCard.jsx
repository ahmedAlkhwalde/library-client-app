import React from "react";
import { motion } from "framer-motion";

export default function AuthCard({ children }) {
  return (
    <motion.div
      style={{
        background: "var(--ui-card-bg)",
        boxShadow: "var(--ui-card-shadow)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="box-border w-full max-w-[540px] h-fit max-h-full flex flex-col justify-center items-center p-4 md:p-6 lg:p-8 rounded-[20px] border border-[var(--ui-card-border)] transition-all duration-300"
    >
      <div className="w-full max-w-[460px] flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  );
}
