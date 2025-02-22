import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Adjust the import path as necessary
import SkeletonLoader from "./SkeletonLoader";
import { useRouter } from "next/navigation";

const formatCurrency = (value: any): string => {
  const numericValue = Number(value); // Convert to number

  if (isNaN(numericValue)) {
    return "$0.00"; // Return a default value if conversion fails
  }

  if (numericValue >= 1_000_000) {
    return `$${(numericValue / 1_000_000).toFixed(2)}M`; // Format in millions
  } else if (numericValue >= 1_000) {
    return `$${(numericValue / 1_000).toFixed(2)}K`; // Format in thousands
  } else {
    return `$${numericValue.toFixed(2)}`; // Format as is
  }
};

const PoolData = ({ data }: { data: any[] }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const itemsPerPage = 10; // Number of items to display per page

  // Calculate the index of the first and last items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter the data based on the search term
  const filteredData = data.filter((item) =>
    item.token_symbols
      .join(" / ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Define the range of pages to display
  const pageNumbers = [];
  const maxVisiblePages = 5; // Maximum number of page links to display
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePoolClick = (pool: any) => {
    router.push(`/finance/pool/${pool.id}`);
  };

  return (
    <div className="sm:max-w-5xl max-w-sm mx-auto">
      <div className="mb-4 pt-6 w-full flex">
        <div className="flex-1"></div>
        <input
          type="text"
          placeholder="Search pools by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl w-full items-end p-2 rounded-md"
        />
      </div>
      <div className="grid grid-cols-5 gap-2 text-[#4f5f64] px-3 text-sm font-semibold py-2">
        <p className="col-span-3">Pair</p>
        <p className="col-span-1">Fee (%)</p>
        <p className="col-span-1">TVL</p>
      </div>
      {data.length === 0 ? (
        <SkeletonLoader />
      ) : (
        <>
          {currentItems.map((item: any) => (
            <div
              onClick={() => handlePoolClick(item)}
              key={item.id}
              className="bg-[#0c171f] px-5 p-5 text-sm hover:bg-[#0c171f]/60 text-white cursor-pointer rounded-md grid grid-cols-5 gap-2 my-2"
            >
              <h1 className="col-span-3 font-semibold">
                {item.token_symbols.join(" / ")}
              </h1>
              <h1 className="col-span-1">
                {(item.total_fee / 100).toFixed(2)}%
              </h1>
              <h1 className="col-span-1 text-wrap truncate">
                {formatCurrency(item.tvl)}
              </h1>
            </div>
          ))}
        </>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center my-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="bg-white"
                onClick={() => paginate(currentPage - 1)}
                // @ts-ignore
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {pageNumbers.map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  className={`${
                    number === currentPage
                      ? "bg-green-500 border-green-500"
                      : "bg-white border-white"
                  }`}
                  href="#"
                  onClick={() => paginate(number)}
                  isActive={number === currentPage}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                className="bg-white"
                onClick={() => paginate(currentPage + 1)}
                // @ts-ignore
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PoolData;
