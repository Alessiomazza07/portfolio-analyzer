import React, { useState, useEffect } from "react";


function AssetDropdown() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  const searchAsset = async (query) => {
    if (!query) return setResults([]);
    try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data.quotes);
        setOpen(true);
        console.log(data.quotes);
    } catch (error) {
        console.error("Errore API:", error);
        setResults([]);
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchAsset(query);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (asset) => {
    setQuery(asset.shortname || "");
    setOpen(false);
  };

  return (
    <div style={{position: "relative"}}>
      <input required
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search asset..."
        onFocus={() => results.length > 0 && setOpen(true)}
      />

      {open && results.length > 0 && (
        <ul>
        {results.map((asset) => (
            <li
              key={asset.symbol}
              onClick={() => handleSelect(asset)}
            >
              {asset.shortname}
            </li>
        ))}
        </ul>
      )}
    </div>
  );
}

export default AssetDropdown;





/*
import React, { useState } from "react";

function AssetDropdown(items) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleSelect = (item) => {
    setValue(item.shortname);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", width: "200px" }}>
      <input
        type="text"
        value={value}
        onClick={() => setOpen(!open)}
        placeholder="Scegli un frutto..."
        style={{ width: "100%", padding: "8px" }}
      />

      {open && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            border: "1px solid #ccc",
            borderTop: "none",
            backgroundColor: "white",
            listStyle: "none",
            margin: 0,
            padding: 0,
            zIndex: 1000,
          }}
        >
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AssetDropdown;

*/