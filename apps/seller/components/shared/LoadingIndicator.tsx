const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center h-60">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 absolute top-0 left-0"
          style={{ animationDirection: 'reverse', opacity: 0.7, animationDuration: '1.5s' }}
        ></div>
      </div>
      <span className="ml-3 text-gray-600 font-medium">Đang tải dữ liệu...</span>
    </div>
  );
};

export default LoadingIndicator;
