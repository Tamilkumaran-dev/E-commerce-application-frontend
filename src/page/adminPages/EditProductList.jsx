import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../App";

export default function EditProductList() {

  const [products, setProducts] = useState([]);
  const [searchBar, setSearchBar] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("AllProduct"); // <-- keeps active search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [page, searchKeyword]); // <-- refetch when page or search changes

  const getData = async () => {
    try {
      let url;
      if (searchKeyword === "AllProduct") {
        url = `${import.meta.env.VITE_BASE_URL}home/${page}/10`;
      } else {
        url = `${import.meta.env.VITE_BASE_URL}home/searchProduct/${searchKeyword}/${page}/10`;
      }

      const res = await axios.get(url, { withCredentials: true });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/");
      }
    }
  };

  const searchMethod = (e) => {
    const value = e.target.value;
    setSearchBar(value);

    if (value.trim() === "") {
      setSearchKeyword("AllProduct"); // reset to all products
      setPage(1);
    } else {
      setSearchKeyword(value.trim()); // keep active search
      setPage(1); // reset to first page when searching
    }
  };

  return (
    <div>
      <h1>Edit products</h1>

      <div>
        <input
          type="text"
          value={searchBar}
          onChange={searchMethod}
          placeholder="Search products..."
        />
      </div>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/editProduct/${product.id}`}>
              <div>
                <img src={product.image} alt="img" width={100} height={100} />
                <h2>{product.productName}</h2>
                <p>{product.description}</p>
                <p>{product.price}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index+1)}
            style={{
              margin: "0 5px",
              fontWeight: page === index ? "bold" : "normal",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
