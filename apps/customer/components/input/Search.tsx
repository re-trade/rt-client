import React, { useState } from "react";

const SearchBox: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [modalQuery, setModalQuery] = useState("");

  const handleSubmit = () => {
    setQuery(modalQuery);
    setShowModal(false);
    // You can also add API call, filter, navigation, etc. here
    console.log("Searching for:", modalQuery);
  };

  return (
    <>
      {/* Fake SearchBar */}
      <div className="w-full max-w-md mx-auto  ">
        <div
          className="w-full flex items-center border border-orange-400 rounded-full overflow-hidden bg-white shadow cursor-pointer"
          onClick={() => {
            setModalQuery(query); // prefill modal with existing query
            setShowModal(true);
          }}
        >
          <input
            type="text"
            value={query}
            placeholder="Search for products..."
            className="w-full px-5 py-3 outline-none text-gray-700 bg-white"
            readOnly
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-6">Advanced Search</h2>

            <form
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {/* Name input — Main query field */}
              <div className="col-span-full">
                <label className="block mb-1 text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apple Juice"
                  value={modalQuery}
                  onChange={(e) => setModalQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                  autoFocus
                />
              </div>

              {/* Manufacturer */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">Manufacturer</label>
                <select className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300">
                  <option value="">Select</option>
                  <option value="Starbucks">Starbucks</option>
                  <option value="PepsiCo">PepsiCo</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">Status</label>
                <select className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300">
                  <option value="">Select</option>
                  <option value="in">In Warehouse</option>
                  <option value="out">Dispatched</option>
                </select>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBox;
