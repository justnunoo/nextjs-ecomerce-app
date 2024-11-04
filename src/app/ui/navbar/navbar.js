"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Badge } from "react-bootstrap";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import AnimatedSearchBar from "@/components/search-bar/AnimatedSearchBar";

export default function NavBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState()
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (searchQuery) {
  //     router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  //   }
  // };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        setIsAuthenticated(false); // Set authentication status to false
        router.push("/"); // Redirect user to homepage
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  //THIS IS USED TO FETCH THE NUMBER OF ITEMS CURRENTLY IN A USER'S CART
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/cart/cart-count"); // Await fetch here
        const data = await response.json();
        setCartCount(data.cartItemCount || 0); // Handle undefined value
      } catch (error) {
        console.error("Error fetching cart item count:", error);
        setCartCount(0); // Default to 0 on error
      }
    };
    fetchData();
  }, [cartCount]); // Re-run effect when cartCount changes




  // Fetch the authentication status from the server
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/status");

      // Check if the response is OK and parse it as JSON
      if (res.ok) {
        const { authenticated } = await res.json(); // Parse JSON only if valid response
        setIsAuthenticated(authenticated);
      } else {
        console.error('Failed to fetch authentication status');
        setIsAuthenticated(false); // In case of error, assume not authenticated
      }
    } catch (error) {
      console.error('Failed to check authentication status:', error);
      setIsAuthenticated(false); // Handle any network or server errors
    }
  };


  // Check authentication status when the component loads
  useEffect(() => {
    checkAuth();
  }, []);


  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load brands");
      }
    };

    fetchBrands();
  }, []);

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light py-3" id="navbar">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">Expand at sm</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample03"
          aria-controls="navbarsExample03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample03">
          <ul className="navbar-nav me-auto mb-2 mb-sm-0">
            <li className="nav-item mx-2">
              <Link href="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item mx-2">
              <Link href="/shop" className="nav-link">Shop</Link>
            </li>
            <li className="nav-item dropdown mx-2">
              <Link href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Brands
              </Link>
              <ul className="dropdown-menu">
                {error ? (
                  <li className="dropdown-item text-danger">{error}</li>
                ) : (
                  brands.map((brand, index) => (
                    <li key={index}>
                      <Link href={`/brands/${brand.brand}`} className="dropdown-item">
                        {brand.brand}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </li>
          </ul>

          <div className="d-flex">
            {/* <form className={`d-flex  ${styles.searchContainer}`} onSubmit={handleSearch}>
              <input
                className={`form-control me-2 ${searchInput}`}
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit"
                className={styles.searchBtn}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form> */}

            <AnimatedSearchBar />


            {isAuthenticated ? (
              <div>
                <Link href="/favorites" title="My Favourites" className="mt-2 mx-2">
                  <FontAwesomeIcon icon={faHeart} size="lg" />
                </Link>

                <Link href="/orders" title="My Orders" className="mt-2 mx-2">
                  <FontAwesomeIcon icon={faBagShopping} size="lg" />
                </Link>

                <Link href="/cart" title="My Cart" className="position-relative mt-2 mx-2">
                  <FontAwesomeIcon icon={faCartShopping} size="lg" />
                  <Badge pill bg="secondary" className="position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </Badge>
                </Link>
              </div>
            ) : ""}

            {/* Show the login button if not authenticated */}
            {!isAuthenticated ? (
              <Link href="/login" className="btn btn-outline-primary rounded-pill mx-2 px-4">
                Login
              </Link>
            ) : (
              <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill mx-2 px-4">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
