const Modal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
          <p className="mb-4">Are you sure you want to delete this post?</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mr-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };


  export default Modal;