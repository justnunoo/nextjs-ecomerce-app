import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


export default function AnimatedSearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef(null);
    const router = useRouter();

    // Toggle the search bar expansion
    const handleSearchClick = (e) => {
        e.preventDefault();
        if (isExpanded && searchQuery) {
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        } else {
            setIsExpanded(!isExpanded);
            if (!isExpanded) {
                searchInputRef.current.focus();
            }
        }
    };

    // Close search bar when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isExpanded && searchInputRef.current && !searchInputRef.current.contains(e.target)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isExpanded]);

    return (
        <div className={`search-container ${isExpanded ? "expanded" : ""}`}>
            <form onSubmit={handleSearchClick}>
                <input
                    type="search"
                    ref={searchInputRef}
                    className="search-input"
                    placeholder="Search shoes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    type="button"
                    className={`search-btn ${isExpanded ? "clicked" : ""}`}
                    onClick={handleSearchClick}
                >
                    <FontAwesomeIcon icon={faSearch} size="lg" />
                </button>
            </form>

            <style jsx>{`
                .search-container {
                    position: relative;
                    width: ${isExpanded ? "300px" : "50px"};
                    transition: width 0.4s ease;
                }
                .search-input {
                    width: 100%;
                    height: 40px;
                    padding: 0 10px;
                    border: 1px solid #ccc;
                    border-radius: 20px;
                    outline: none;
                    opacity: ${isExpanded ? "1" : "0"};
                    transition: opacity 0.4s ease;
                }
                .search-btn {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    color: ${isExpanded ? "#333" : "black"};
                    outline: none;
                }
                .search-btn i {
                    font-size: 20px;
                }
                .expanded .search-input {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}
