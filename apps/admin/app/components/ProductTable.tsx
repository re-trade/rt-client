// Dữ liệu mẫu cho Products
const products = [
  {
    sellerId: 'S001',
    name: 'Laptop Dell XPS',
    description: 'High-performance laptop',
    brand: 'Dell',
    tags: ['Electronics', 'Laptop'],
  },
  {
    sellerId: 'S002',
    name: 'Headphones Sony',
    description: 'Noise-cancelling headphones',
    brand: 'Sony',
    tags: ['Audio', 'Headphones'],
  },
  {
    sellerId: 'S003',
    name: 'Smartphone Samsung',
    description: 'Latest model with 5G',
    brand: 'Samsung',
    tags: ['Electronics', 'Phone'],
  },
  {
    sellerId: 'S004',
    name: 'Wireless Mouse',
    description: 'Ergonomic design',
    brand: 'Logitech',
    tags: ['Accessories', 'Mouse'],
  },
];

// Component hiển thị bảng Products
export default function ProductTable() {
  return (
    <div className="w-full">
      {/* Tiêu đề bảng */}
      <h2 className="text-2xl font-bold mb-6 text-[#4A4039]">Products</h2>
      {/* Bảng responsive */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          {/* Tiêu đề cột */}
          <thead>
            <tr className="bg-[#F5E8C7] text-[#4A4039]">
              <th className="p-4 text-left">SellerId</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Brand</th>
              <th className="p-4 text-left">Tags</th>
            </tr>
          </thead>
          {/* Dữ liệu mẫu */}
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-4">{product.sellerId}</td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.description}</td>
                <td className="p-4">{product.brand}</td>
                <td className="p-4">{product.tags.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
