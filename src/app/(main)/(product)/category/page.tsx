import { Button } from '@/components/ui/button';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number) => void;
  onAddCategory: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategory, onCategoryClick, onAddCategory }) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh mục</h2>
        <Button
          onClick={onAddCategory}
        >
          <FaPlus className="mr-2" /> Thêm danh mục
        </Button>
      </div>
      <ul>
        {categories.map(category => (
          <li
            key={category.id}
            className={`cursor-pointer p-2 rounded-lg mb-2 hover:bg-gray-200 ${
              category.id === selectedCategory ? 'bg-gray-300' : ''
            }`}
            onClick={() => onCategoryClick(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
