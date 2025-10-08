"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { useTransactions } from "../context/TransactionContext"

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const { setSearchFilter } = useTransactions()

  const handleSearch = (value) => {
    setSearchTerm(value)
    setSearchFilter(value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchFilter("")
  }

  return (
    <motion.div
      className="search-container"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <motion.button
            className="clear-search"
            onClick={clearSearch}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default SearchBar
