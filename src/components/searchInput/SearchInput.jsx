import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import TextField from "@mui/material/TextField";

const SearchInput = ({ onSearch, label = "Search", debounceTime = 500, ...props }) => {
    const [searchText, setSearchText] = useState("");

    const delayedSearch = useCallback(
        debounce((searchValue) => {
            onSearch(searchValue);
        }, debounceTime),
        [onSearch, debounceTime]
    );

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchText(value);
        delayedSearch(value);
    };

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
