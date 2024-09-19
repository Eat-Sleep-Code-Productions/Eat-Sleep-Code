import type { BoardRowPopup } from "../boardTypes";

const AddBoardRowPopup: React.FC<BoardRowPopup> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 max-w-lg w-full max-h-screen overflow-y-auto">
        <button
          type="button"
          className="absolute top-3 right-3 mt-2 mr-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          &times;
        </button>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default AddBoardRowPopup;
