import { useState } from "react";
import { useEffect } from "react";
import { BiErrorCircle } from "react-icons/bi";

const FlavorModal = ({ isOpen, onClose, onConfirm, menu }) => {
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const flavors = [
    "Ovo Crunchy",
    "Dark Choco",
    "Yakult",
    "Coffee",
    "Creme Brulee",
    "Durian Sorbet",
    "Cookies N Cream",
    "Blue Bublegum",
    "Tiramisu",
    "Mango Sorbet",
    "Strawberry Sorbet",
    "Crunchy Ovaltine",
    "Lychee Berries Sorbet",
    "Taro",
    "American Pie",
    "Tutty Fruity",
    "Cotton Candy",
    "Lemon Cookie",
    "Sirsak Sorbet",
    "Matcha",
    "Peach Sorbet",
    "Cookie Monster",
    "Apple Strudell",
    "Klepon",
  ];

  const getMaxFlavors = (menuName) => {
    const nameLower = menuName.toLowerCase();
    if (nameLower.includes("1 rasa")) return 1;
    if (nameLower.includes("2 rasa")) return 2;
    if (nameLower.includes("3 rasa")) return 3;
    return 1;
  };

  const maxFlavors = menu ? getMaxFlavors(menu.name) : 1;

  const toggleFlavor = (flavor) => {
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter((f) => f !== flavor));
    } else if (selectedFlavors.length < maxFlavors) {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  useEffect(() => {
    setSelectedFlavors([]);
  }, [menu]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black/50 absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-lg w-[90%] max-w-md z-50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-bold text-lg text-center">{menu?.name}</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            Pilih {maxFlavors} rasa ({selectedFlavors.length} terpilih)
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4">
          <div className="grid grid-cols-2 gap-2">
            {flavors.map((flavor) => (
              <button
                key={flavor}
                onClick={() => toggleFlavor(flavor)}
                disabled={
                  !selectedFlavors.includes(flavor) &&
                  selectedFlavors.length >= maxFlavors
                }
                className={`p-2 rounded-md ${
                  selectedFlavors.includes(flavor)
                    ? "bg-pink-700 text-white"
                    : selectedFlavors.length >= maxFlavors
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-white">
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setSelectedFlavors([]);
                onClose();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={() => {
                if (selectedFlavors.length === maxFlavors) {
                  onConfirm(selectedFlavors);
                  setSelectedFlavors([]);
                  onClose();
                }
              }}
              disabled={selectedFlavors.length !== maxFlavors}
              className={`px-4 py-2 rounded-md ${
                selectedFlavors.length === maxFlavors
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

export default FlavorModal;