const CartEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-orange-200 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <button
        type="button"
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-bold text-white hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default CartEmpty;
