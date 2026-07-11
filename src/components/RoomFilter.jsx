import React, { memo } from "react";
import { motion } from "framer-motion";
import { ChefHat, Sofa, Bath, Bed, Home, LayoutGrid } from "lucide-react";
import { ROOMS } from "../utils/constants";

const ROOM_ICONS = {
  Cuisine: ChefHat,
  Salon: Sofa,
  "Salle de bain": Bath,
  Chambre: Bed,
  Autre: Home,
};

const RoomFilter = memo(function RoomFilter({ selected, onChange }) {
  const all = [
    { label: "Tout", value: null, Icon: LayoutGrid },
    ...ROOMS.map((r) => ({ label: r, value: r, Icon: ROOM_ICONS[r] })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {all.map(({ label, value, Icon }) => {
        const active = selected === value;
        return (
          <motion.button
            key={label}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(value)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon size={15} />
            {label}
          </motion.button>
        );
      })}
    </div>
  );
});

export default RoomFilter;