const PurchaseSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FDFEF9] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#525252]/20">
          <div className="animate-pulse space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-96"></div>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSkeleton;
