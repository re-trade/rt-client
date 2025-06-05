'use client';

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import AddAddressDialog, { Address } from "@/components/dialog/add/create-address-dialog"
import EditAddressDialog from "@/components/dialog/view-update/edit-address-dialog"

const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường ABC',
    ward: 'Phường 1',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Trần Thị B',
    phone: '0987654321',
    address: '456 Đường XYZ',
    ward: 'Phường 2',
    district: 'Quận 2',
    city: 'TP. Hồ Chí Minh',
    isDefault: false,
  },
];

export default function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleAdd = (newAddress: Address) => {
    let updated = addresses;
    if (newAddress.isDefault) {
      updated = addresses.map((a) => ({ ...a, isDefault: false }));
    }
    setAddresses([...updated, newAddress]);
  };

  const handleUpdate = (updatedAddress: Address) => {
    let updated = addresses.map((a) => (a.id === updatedAddress.id ? updatedAddress : a));

    if (updatedAddress.isDefault) {
      updated = updated.map((a) => (a.id === updatedAddress.id ? a : { ...a, isDefault: false }));
    }

    setAddresses(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Quản lý địa chỉ</h2>
          <p className="text-muted-foreground">Quản lý địa chỉ lấy hàng và giao hàng</p>
        </div>
        <AddAddressDialog onAdd={handleAdd} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên & SĐT</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Phường/Xã</TableHead>
                <TableHead>Quận/Huyện</TableHead>
                <TableHead>Tỉnh/TP</TableHead>
                <TableHead>Mặc định</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{address.name}</div>
                      <div className="text-sm text-muted-foreground">{address.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{address.address}</TableCell>
                  <TableCell>{address.ward}</TableCell>
                  <TableCell>{address.district}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>
                    {address.isDefault && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Mặc định
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAddress(address);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditAddressDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        address={selectedAddress}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
