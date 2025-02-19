import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";


const LevelModal = ({ isOpen, onClose, onConfirm, menuType, menus }) => {
    const [selectedLevel, setSelectedLevel] = useState(null);
  
    useEffect(() => {
      if (!isOpen) {
        setSelectedLevel(null);
      }
    }, [isOpen]);
  
    // Memoize menu filtering and sorting
    const menuLevels = useMemo(() => {
      if (!menus || !menuType) return [];
      
      return menus
        .filter(menu => menu.name.startsWith(menuType) && menu.name.includes("Lv."))
        .sort((a, b) => {
          const levelA = parseInt(a.name.match(/Lv\. (\d+)/)[1]);
          const levelB = parseInt(b.name.match(/Lv\. (\d+)/)[1]);
          return levelA - levelB;
        });
    }, [menus, menuType]);
  
    // Memoize handlers
    const handleClose = useCallback(() => {
      setSelectedLevel(null);
      onClose();
    }, [onClose]);
  
    const handleConfirm = useCallback(() => {
      if (selectedLevel) {
        onConfirm(selectedLevel);
        setSelectedLevel(null);
        onClose();
      }
    }, [selectedLevel, onConfirm, onClose]);
  
    if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black/50 absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-lg w-[90%] max-w-md z-50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-bold text-lg text-center">{menuType}</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            Pilih level pedas yang kamu inginkan
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4">
          <div className="grid gap-2">
            {menuLevels.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setSelectedLevel(menu)}
                className={`p-4 rounded-lg text-left transition-colors ${
                  selectedLevel?.id === menu.id
                    ? "bg-pink-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="font-medium">
                  Level {menu.name.match(/Lv\. (\d+)/)[1]}
                </div>
                <div className={`text-sm ${
                  selectedLevel?.id === menu.id
                    ? "text-pink-100"
                    : "text-gray-600"
                }`}>
                  {menu.description}
                </div>
                <div className={`text-sm font-medium mt-1 ${
                  selectedLevel?.id === menu.id
                    ? "text-white"
                    : "text-pink-600"
                }`}>
                  Rp {menu.price.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-white">
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setSelectedLevel(null);
                onClose();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={() => {
                if (selectedLevel) {
                  onConfirm(selectedLevel);
                  setSelectedLevel(null);
                  onClose();
                }
              }}
              disabled={!selectedLevel}
              className={`px-4 py-2 rounded-md ${
                selectedLevel
                  ? "bg-pink-700 text-white hover:bg-pink-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelModal;
