import { MapPin, Phone } from 'lucide-react';

export interface Destination {
  customerName: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  state: string;
}

interface ShippingInfoCardProps {
  destination: Destination;
}

export function ShippingInfoCard({ destination }: ShippingInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="p-2 bg-orange-100 rounded-lg">
          <MapPin className="w-5 h-5 text-orange-600" />
        </div>
        Thông tin giao hàng
      </h2>
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-3">Người nhận</h3>
            <div className="space-y-2 text-gray-600">
              <p className="font-medium text-gray-800">{destination.customerName}</p>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>{destination.phone}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-3">Địa chỉ giao hàng</h3>
            <div className="text-gray-600 space-y-1">
              <p className="leading-relaxed">{destination.addressLine}</p>
              <p>
                {destination.ward}, {destination.district}
              </p>
              <p>{destination.state}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
