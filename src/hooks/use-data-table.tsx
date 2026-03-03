import { useState } from "react";
import useDebounce from "./use-debounce";

export default function useDataTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const debounce = useDebounce();

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleChangeSearch = (search: string) => {
    debounce(() => {
      setCurrentSearch(search);
      setCurrentPage(1);
    }, 500);
  };

  return {
    currentPage,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
  };
}
