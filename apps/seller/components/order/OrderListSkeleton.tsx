const OrderListSkeleton = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Đang tải đơn hàng...</p>
      </div>
    </div>
  );
};

export default OrderListSkeleton;
