const OrderListSkeleton = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
        <p className="text-sm text-slate-500 font-medium">Đang tải đơn hàng...</p>
      </div>
    </div>
  );
};

export default OrderListSkeleton;
