import React, { useState } from "react";
import {
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const CategoryManager = ({
  categories,
  onUpdateCategories,
  disabled = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError("Danh mục không được để trống.");
      return;
    }
    if (categories.includes(newCategory.trim())) {
      setError("Danh mục đã tồn tại.");
      return;
    }
    onUpdateCategories([...categories, newCategory.trim()]);
    setNewCategory("");
    setIsAdding(false);
    setError("");
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditValue(category);
    setError("");
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      setError("Danh mục không được để trống.");
      return;
    }
    if (
      categories.includes(editValue.trim()) &&
      editValue !== editingCategory
    ) {
      setError("Danh mục đã tồn tại.");
      return;
    }
    const updatedCategories = categories.map((cat) =>
      cat === editingCategory ? editValue.trim() : cat
    );
    onUpdateCategories(updatedCategories);
    setEditingCategory(null);
    setEditValue("");
    setError("");
  };

  const handleDeleteCategory = (category) => {
    onUpdateCategories(categories.filter((cat) => cat !== category));
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          Quản lý danh mục
        </h3>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={disabled}
          aria-label="Thêm danh mục mới"
        >
          <PlusIcon className="size-5" />
        </button>
      </div>

      {/* Form thêm danh mục */}
      {isAdding && (
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md shadow-sm">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-200"
            placeholder="Nhập tên danh mục mới"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
            disabled={disabled}
          >
            Thêm
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewCategory("");
              setError("");
            }}
            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
            disabled={disabled}
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>
      )}
      {error && isAdding && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}

      {/* Danh sách danh mục */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 max-h-60 overflow-y-auto">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-2">
            Chưa có danh mục nào.
          </p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                {editingCategory === cat ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-200"
                      disabled={disabled}
                    />
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="p-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                      disabled={disabled}
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setError("");
                      }}
                      className="p-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      disabled={disabled}
                    >
                      <XMarkIcon className="size-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-700 truncate">{cat}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(cat)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors disabled:text-gray-400"
                        disabled={disabled}
                      >
                        <PencilIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400"
                        disabled={disabled}
                      >
                        <TrashIcon className="size-5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && editingCategory && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CategoryManager;
