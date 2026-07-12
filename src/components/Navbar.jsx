import React, { memo } from "react";
import { motion } from "framer-motion";
import { Home, Calendar, RefreshCw } from "lucide-react";

const TABS = [
  { id: "home", label: "Accueil", Icon: Home },
  { id: "calendar", label: "Calendrier", Icon: Calendar },
  { id: "sync", label: "Sync", Icon: RefreshCw },
];

const Navbar = memo(function Navbar({ activeTab, onChange }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-lg">
      <div className="flex">
        {TABS.map(function({ id, label, Icon }) {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={function() { onChange(id); }}
              className="flex-1 flex flex-col items-center py-2.5 relative"
            >
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 inset-x-4 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
              <Icon size={22} className={active ? "text-indigo-600" : "text-gray-400"} />
              <span className={"text-xs mt-1 font-medium " + (active ? "text-indigo-600" : "text-gray-400")}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Copyright */}
      <div className="text-center py-1 bg-white">
        <p className="text-[9px] text-gray-300 font-medium tracking-wide">
          © GipsyDang3r & Claude AI — 2026
        </p>
      </div>
    </nav>
  );
});

export default Navbar;