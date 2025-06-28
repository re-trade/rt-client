import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Category, getAllCategories } from '@/service/categories.api';

interface Props {
    onChange: (selected: string[]) => void;
    value?: string[]; 
}

export function MultiSelectCategory({ onChange, value: initialValue = [] }: Props) {
    const [search, setSearch] = useState("");
    const [allCategories, setAllCategories] = useState<Category[] | null>(null);
    const [selected, setSelected] = useState<string[]>(initialValue); // State để lưu danh sách categoryIds đã chọn
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State để kiểm soát dropdown

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allCategories = await getAllCategories();
                setAllCategories(allCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // Đồng bộ selected với giá trị từ prop value khi thay đổi
        if (initialValue) {
            setSelected(initialValue);
        }
    }, [initialValue]);

    const handleToggleCategory = (id: string) => {
        const newSelected = selected.includes(id)
            ? selected.filter((cid) => cid !== id)
            : [...selected, id];
        setSelected(newSelected);
        onChange(newSelected); // Truyền danh sách categoryIds đã chọn lên component cha
    };

    const categories = allCategories || [];
    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {selected.map((id) => {
                    const category = categories.find((c) => c.id === id);
                    if (!category) return null;
                    return (
                        <div key={id} className="flex items-center px-2 py-1 bg-gray-200 rounded">
                            <span className="text-sm">{category.name}</span>
                            <button
                                type="button"
                                onClick={() => handleToggleCategory(id)}
                                className="ml-1 text-gray-500 hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

        
            <div className="relative">
                <div className="relative w-full">
                    <Input
                        placeholder="Chọn danh mục..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={toggleDropdown}
                        readOnly 
                        className="pr-10 cursor-pointer "
                    />
                    <button
                        type="button"
                        onClick={toggleDropdown}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                        {isDropdownOpen ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                </div>



                {isDropdownOpen && (
                    <div className="absolute z-10 w-full border rounded p-2 max-h-48 overflow-y-auto bg-white mt-1">
                        {filtered.length > 0 ? (
                            filtered.map((category) => (
                                <div
                                    key={category.id}
                                    className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-100 flex justify-between ${selected.includes(category.id) ? "bg-gray-100 font-semibold" : ""
                                        }`}
                                    onClick={() => {
                                        handleToggleCategory(category.id);
                                      
                                    }}
                                >
                                    {category.name}
                                    {selected.includes(category.id) && <span>✓</span>}
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">Không tìm thấy danh mục nào</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}