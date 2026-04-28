import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Pagination from "./components/Pagination";


export default function App() {

  let [products, setProducts] = useState([])
  let [errorState, setErrorState] = useState(null)
  let [selectedTag, setSelectedTag] = useState("")
  let [search, setSearch] = useState("")

  const [page, setPage] = useState(0);

  let [isLoading, setIsLoading] = useState(true)

  const debounce = (callback, wait = 300) => {
    let timeoutId;

    return (...params) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        callback(...params);
      }, wait);
    };
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 500),
    []
  );

  const getProducts = async () => {
    try {
      let res = await axios.get(`https://dummyjson.com/products/search?q=${search}&limit=09&skip=${page * 9}`)
      setProducts(res.data)
      setErrorState(!res.data?.products?.length && "No products found");
      setIsLoading(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      setErrorState(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [search, page])

  let loadingItems = [1, 2, 3]

  return (
    <div className="p-[50px]">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-[28px] font-bold text-center">Products</h1>

        <div className="w-[300px] bg-gray-100 rounded-md p-[10px]">
          <input
            onChange={(e) => {
              setIsLoading(true)
              setPage(0)
              debouncedSearch(e.target.value)
            }}
            type="text"
            placeholder="Search..."
            className="outline-none w-full bg-transparent px-[10px]"
          />
        </div>
      </div>

      <div className="container mx-auto flex flex-wrap gap-[20px] mt-[50px]">
        {!isLoading ? products?.products?.map((item, i) => (
          <div key={i} className="p-[20px] w-[calc(33.33%-15px)] shadow-lg rounded-md">
            <div className="flex items-center justify-center ">
              <img src={item.thumbnail} alt={item.title} className="object-cover transition-all hover:scale-110" />
            </div>
            <div className="mt-[20px]">
              <h2 className="text-[20px] font-bold text-center">{item.title}</h2>
              <p className="text-[18px] font-bold text-center mt-[10px]">{item.price}</p>
              <div className="mt-[20px] flex justify-center">
                <button className="bg-blue-500 text-white py-[10px] px-[20px] rounded-md hover:bg-blue-600">Buy Now</button>
              </div>
              <div className="flex flex-wrap gap-[10px] mt-[20px]">
                {item?.tags?.map((tag, j) => (
                  <div
                    className="cursor-pointer py-[3px] px-[10px] bg-gray-200 hover:bg-gray-300 transition-all text-[12px] rounded-full"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
          :
          loadingItems?.map((item, i) => (
            <div
              key={i}
              className="p-[20px] w-[calc(33%-40px)] shadow-lg rounded-md animate-pulse"
            >
              <div className="flex items-center justify-center">
                <div className="w-full h-[180px] bg-gray-300 rounded-md"></div>
              </div>

              <div className="mt-[20px]">
                <div className="h-[20px] bg-gray-300 rounded w-[70%] mx-auto"></div>
                <div className="h-[18px] bg-gray-300 rounded w-[40%] mx-auto mt-[10px]"></div>
                <div className="mt-[20px] flex justify-center">
                  <div className="h-[40px] w-[120px] bg-gray-300 rounded-md"></div>
                </div>
                <div className="flex flex-wrap gap-[10px] mt-[20px] justify-center">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-[20px] w-[60px] bg-gray-300 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))
        }

        {!isLoading && errorState && <p className="text-center text-red-500 text-[18px] font-bold">{errorState}</p>}
      </div>

      <Pagination
        totalItems={products?.total || 0}
        itemsPerPage={9}
        currentPage={page}
        onPageChange={setPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}