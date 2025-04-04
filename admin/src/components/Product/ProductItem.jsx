import React, { useEffect, useState } from "react";
import { productAPI } from "../../services/productService";
import { useDispatch } from "react-redux";
import { setLoadingAPI } from "../../redux/adminSlice";

const ProductItem = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saveProduct, setSaveProduct] = useState([]);
  const dispatch = useDispatch();

  const handleRowClick = (productId) => {
    setSelectedProduct(productId === selectedProduct ? null : productId);
  };

  const handleChangeStatus = async (productId, newStatus) => {
    if (productId && newStatus) {
      await productAPI.setStatusProduct(productId, newStatus);
      await dispatch(setLoadingAPI(true));
    }
  };

  useEffect(() => {
    if (products) {
      const timeout = setTimeout(() => {
        setSaveProduct(products);
      }, 200);
  
      return () => clearTimeout(timeout); 
    }
  }, [products]);
  
  return (
    <div className="w-full overflow-x-auto">
      {/* Mobile/Tablet View */}
      <div className="block md:hidden">
        {saveProduct?.length > 0 ? (
          saveProduct?.map((product, index) => (
            <div 
              key={product.productId} 
              className="bg-white shadow-md rounded-lg mb-4 p-4 border"
            >
              <div className="flex items-center mb-4">
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-20 h-20 object-cover rounded-xl mr-4"
                />
                <div>
                  <h3 className="font-bold text-sm truncate max-w-[200px]">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {product.retailerName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Ngày đăng</p>
                  <p className="text-sm">
                    {product.createdAt
                      ?.split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/") || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Trạng thái</p>
                  <select
                    value={product.status}
                    onChange={(e) =>
                      handleChangeStatus(product.productId, e.target.value)
                    }
                    disabled={product.status === "ENABLE" || product.status === "BLOCK" ||  product.status === "PAUSE"}
                    className={`w-full py-1 rounded-md shadow-md text-white text-center cursor-pointer text-sm ${
                      product.status === "ENABLE"
                        ? "bg-green-500 appearance-none"
                        : product.status === "DISABLE"
                        ? "bg-yellow-500"
                        : product.status === "PAUSE"
                        ? "bg-gray-500 appearance-none"
                        : product.status === "BLOCK"
                         ? "bg-red-500 appearance-none"
                         : ""
                    }`}
                  >
                    {/* Status options remain the same as in the original code */}
                    {product.status === "ENABLE" && (
                      <option value="ENABLE" className="bg-green-500">
                        Được bán
                      </option>
                    )}
                    {product.status === "DISABLE" && (
                      <>
                        <option value="DISABLE" className="bg-yellow-500">
                          Chờ duyệt
                        </option>
                        <option value="ENABLE" className="bg-green-500">
                          Được bán
                        </option>
                        <option value="BLOCK" className="bg-red-500">
                          Vi phạm
                        </option>
                      </>
                    )}
                    {product.status === "PAUSE" && (
                      <option value="PAUSE" className="bg-gray-500">
                        Tạm ngừng
                      </option>
                    )}
                    {product.status === "BLOCK" && (
                      <option value="BLOCK" className="bg-red-500">
                        Vi phạm
                      </option>
                    )}
                  </select>
                </div>
              </div>

              <div 
                onClick={() => handleRowClick(product.productId)}
                className="text-center bg-blue-50 py-2 rounded-md cursor-pointer"
              >
                {selectedProduct === product.productId ? "Ẩn chi tiết" : "Xem chi tiết"}
              </div>

              {selectedProduct === product.productId && (
                <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm">
                  <p className="font-bold text-center mb-2">Chi tiết sản phẩm:</p>
                  
                  <div className="mb-2">
                    <span className="font-semibold">Nguồn gốc: </span>
                    <span>{product.productOrigin}</span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="font-semibold">Danh mục: </span>
                    {Array.isArray(product.categoryName) &&
                      product.categoryName.map((item, index) => (
                        <p key={index} className="pl-2">
                          - {item}
                        </p>
                      ))}
                  </div>
                  
                  <div className="mb-2">
                    <span className="font-semibold">Mô tả: </span>
                    <span>{product.productDesc}</span>
                  </div>
                  
                  <div>
                    <p className="font-semibold">Loại: </p>
                    {product.variants?.map((variant, vIndex) => (
                      <p
                        key={vIndex}
                        className="pl-2"
                      >
                        - {variant.value}
                        {variant.unitName}: ₫
                        {new Intl.NumberFormat("vi-VN").format(
                          variant.price
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-4">
            Không có sản phẩm nào.
          </div>
        )}
      </div>

      {/* Desktop View */}
      <table
        className="w-full border-collapse table-fixed min-w-full hidden md:table"
        title="Xem chi tiết"
      >
        <thead>
          <tr className="text-center bg-black text-white uppercase">
            <th className="p-3 text-sm w-12">STT</th>
            <th className="p-3 text-sm">Sản phẩm</th>
            <th className="p-3 text-sm">Cửa hàng</th>
            <th className="p-3 text-sm">Mô tả</th>
            <th className="p-3 text-sm">Ngày đăng</th>
            <th className="p-3 text-sm">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {/* Existing desktop table body code remains the same as in the original component */}
          {saveProduct?.length > 0 ? (
            saveProduct?.map((product, index) => (
              <React.Fragment key={product.productId}>
                <tr
                  className={`cursor-pointer hover:bg-gray-100 mb-4 ${
                    selectedProduct === product.productId ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleRowClick(product.productId)}
                >
                  {/* Existing table row content remains unchanged */}
                  <td className="p-1 text-center">{index + 1}</td>
                  <td className="flex pl-5 items-center text-center gap-2">
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="w-26 h-26 object-cover p-2 rounded-xl"
                    />
                    <span className="text-center truncate max-w-xs overflow-hidden">
                      {product.productName}
                    </span>
                  </td>
                  <td className="p-1 text-center">{product.retailerName}</td>
                  <td className="p-3 truncate max-w-xs overflow-hidden">
                    {product.productDesc}
                  </td>
                  <td className="text-center">
                    {product.createdAt
                      ?.split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/") || "N/A"}
                  </td>
                  <td className="p-3 text-center">
                    <select
                      value={product.status}
                      onChange={(e) =>
                        handleChangeStatus(product.productId, e.target.value)
                      }
                      disabled={product.status === "ENABLE" || product.status === "BLOCK" ||  product.status === "PAUSE"}
                      onClick={(e) => e.stopPropagation()}
                      className={`py-1 w-24 rounded-md shadow-md text-white text-center cursor-pointer ${
                        product.status === "ENABLE"
                          ? "bg-green-500 appearance-none"
                          : product.status === "DISABLE"
                          ? "bg-yellow-500"
                          : product.status === "PAUSE"
                          ? "bg-gray-500 appearance-none"
                          : product.status === "BLOCK"
                           ? "bg-red-500 appearance-none"
                           : ""
                      }`}
                    >
                      {/* Status options remain the same as in the original code */}
                      {product.status === "ENABLE" && (
                        <option value="ENABLE" className="bg-green-500">
                          Được bán
                        </option>
                      )}
                      {product.status === "DISABLE" && (
                        <>
                          <option value="DISABLE" className="bg-yellow-500">
                            Chờ duyệt
                          </option>
                          <option value="ENABLE" className="bg-green-500">
                            Được bán
                          </option>
                          <option value="BLOCK" className="bg-red-500">
                            Vi phạm
                          </option>
                        </>
                      )}
                      {product.status === "PAUSE" && (
                        <option value="PAUSE" className="bg-gray-500">
                          Tạm ngừng
                        </option>
                      )}
                      {product.status === "BLOCK" && (
                        <option value="BLOCK" className="bg-red-500">
                          Vi phạm
                        </option>
                      )}
                    </select>
                  </td>
                </tr>
                {selectedProduct === product.productId && (
                  <tr className="bg-gray-100 mb-4">
                    <td colSpan={6} className="p-3 text-gray-700 px-18">
                      <p className="bg-gray-200 font-bold text-center">
                        Chi tiết sản phẩm:
                      </p>
                      <div>
                        <span>Nguồn gốc: </span>
                        <span className="font-light">
                          {product.productOrigin}
                        </span>
                      </div>
                      <div>
                        <span>Danh mục: </span>
                        {Array.isArray(product.categoryName) &&
                          product.categoryName.map((item, index) => (
                            <p key={index} className="font-light pl-2">
                              - {item}
                            </p>
                          ))}
                      </div>
                      <div>
                        <span>Mô tả: </span>
                        <span className="font-light">
                          {product.productDesc}
                        </span>
                      </div>
                      <div>
                        <p>Loại: </p>
                        {product.variants?.map((variant, vIndex) => (
                          <p
                            key={vIndex}
                            className="cursor-pointer pl-2 font-light"
                          >
                            - {variant.value}
                            {variant.unitName}: ₫
                            {new Intl.NumberFormat("vi-VN").format(
                              variant.price
                            )}
                          </p>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-3 text-center text-gray-500">
                Không có sản phẩm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductItem;