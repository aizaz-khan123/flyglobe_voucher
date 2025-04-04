'use client';
import React, { useState, useMemo, useCallback } from "react";

import debounce from "lodash.debounce";
import TextField from "@mui/material/TextField";

const SearchInput = ({ onSearch, label = "Search", debounceTime = 500, ...props }) => {
    const [searchText, setSearchText] = useState("");

    const debouncedSearch = useMemo(() => {
        return debounce((value) => {
            onSearch(value);
        }, debounceTime);
    }, [onSearch, debounceTime]);

    const handleSearchChange = useCallback((e) => {
        const { value } = e.target;

        setSearchText(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    return (
        <TextField
            fullWidth
            variant="outlined"
            label={label}
            value={searchText}
            onChange={handleSearchChange}
            {...props}
        />
    );
};

export default SearchInput;
