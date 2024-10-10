import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencil,
  faFilter,
  faMagnifyingGlass,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomeBackend = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Updated to 5 items per page
  const navigate = useNavigate();
  const [totalOrganizations, setTotalOrganizations] = useState(0);

  const handleAddButtonClick = () => {
    navigate("/OrganizationPage");
  };

  const handleOrderCreation = () => {
    navigate("/orders");
  };

  const handleUser = () => {
    navigate("/Userpage");
  };

  const handleEdit = (org) => {
    navigate(`/OrganizationPage/${org.customer_id}`, { state: { organizationData: org } });
  };

  const staticData = [
    {
      id: 1,
      customerName: "P.M Enterprises",
      acDetails: "3 x 1TS, 2 x 3TC",
      status: "PI SENT",
      actions: ["Generate Link","Resend Link"],
      paymentDetails: "CASH"
    },
    {
      id: 2,
      customerName: "EVEREST FLEET",
      acDetails: "1 x 1TS, 4 x 3TC",
      status: "TOKEN LINK GENERATE",
      actions: ["Generate Link","Resend Link"],
      paymentDetails: "UPI"
    },
    {
      id: 3,
      customerName: "THE LIVLIT",
      acDetails: "2 x 1TS, 1 x 3TC",
      status: "TOKEN RECEIVED",
      actions: ["Generate Link","Resend Link"],
      paymentDetails: "NEFT"
    },
    {
      id: 4,
      customerName: "CHEELIZA PIZZA",
      acDetails: "5 x 1TS",
      status: "FULL PAYMENT RECEIVED",
      actions: ["Generate Link","Resend Link"],
      paymentDetails: "CHEQUE"
    },
    {
      id: 5,
      customerName: "DOMINOS PIZZA",
      acDetails: "3 x 3TC",
      status: "PENDING PAYMENT",
      actions: ["Generate Link","Resend Link"],
      paymentDetails: "NETBANKING"
    }
  ];
  const handleAction = (id, action) => {
    console.log(`Performing ${action} for item with id ${id}`);
    // Implement the logic for generating or resending links here
  };
  const fetchOrganizationData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/customers/getall`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      const fetchedData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setData(fetchedData);
      setTotalOrganizations(fetchedData.length);
      console.log("Fetched organization data:", fetchedData);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };
  useEffect(() => {
    fetchOrganizationData();
  }, [navigate]);

  useEffect(() => {
    const filtered = data.filter((org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setTotalOrganizations(filtered.length);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, data]);

  const handleDelete = async (cusId) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        const authToken = localStorage.getItem("authToken");
        console.log(cusId);
        
        // First API call (your existing API)
        const response = await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/user/customer/${cusId}`,
          {
            headers: {
              "x-auth-token": authToken,
            },
          }
        );
  
        if (response.status === 200) {
          alert("Sucessfully remove the customer",response.data);
          
          // Second API call (Swipe API)
          const swipeToken = `${process.env.REACT_APP_SwipeToken}`
          const swipeConfig = {
            method: 'delete',
            url: `https://app.getswipe.in/api/partner/v1/customer/${cusId}`,
            headers: { 
              'Authorization': `Bearer ${swipeToken}`
            }
          };
  
          try {
            const swipeResponse = await axios(swipeConfig);
            console.log("Swipe API response:", JSON.stringify(swipeResponse.data));
          } catch (swipeError) {
            console.error("Error deleting from Swipe API:", swipeError);
            // You might want to handle this error differently
          }
  
          // Refetch the data
          await fetchOrganizationData();
        }
      } catch (error) {
        console.error("Error deleting organization:", error);
        if (error.response) {
          if (error.response.status === 404) {
            alert("Organization not found.");
          } else if (error.response.status === 500) {
            alert("Server error. Please try again later.");
          } else {
            alert(
              error.response.data.msg ||
                "An error occurred while deleting the organization."
            );
          }
        } else {
          alert("An error occurred while deleting the organization.");
        }
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2 mb-4">
        <p className="text-lg font-semibold">All</p>
        <div className="flex items-center">
          <p className="text-primary mr-2 text-2xl">Total Customer:</p>
          <p className="text-primary font-bold text-2xl">5</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-between mb-4 gap-4">
        <div className="sm:flex flex-wrap gap-3">
          <div className="flex items-center gap-2 border-2 border-secondary rounded-md px-5 py-2">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="xl"
              color="#A14996"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-60 text-black outline-none"
              id="user-searchbox"
              placeholder="Search Customer"
            />
          </div>
        </div>
        <div className="flex-wrap">
          <button
            className="bg-white px-4 py-2 rounded-md text-primary border-primary border-2 mr-2"
            onClick={handleAddButtonClick}
          >
            ADD CUSTOMER
          </button>
          <button
            className="bg-white px-4 py-2 rounded-md text-primary border-primary border-2 mr-2"
            onClick={handleOrderCreation}
          >
            CREATE ORDER
          </button>
          {/* <button
            className="bg-white px-4 py-2 rounded-md text-primary border-primary border-2 mr-2"
            onClick={handleUser}
          >
            CREATE USER
          </button> */}
          <button
            className="text-white px-4 py-2 rounded-md bg-primary"
            onClick={handleLogout}
          >
            <FontAwesomeIcon className="mr-1" icon={faRightFromBracket} />
            Logout
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
  <table className="table-auto w-full border-collapse mb-6 text-sm sm:text-base">
    <thead>
      <tr className="bg-secondary">
        <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2 w-1/5">Customer</th>
        <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2 w-1/3">AC Details</th>
        <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2 w-1/6">Status</th>
        <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2 w-1/6">Action</th>
        <th className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2 w-1/10">Payment</th>
      </tr>
    </thead>
    <tbody>
      {staticData.map((item) => (
        <tr key={item.id} className="border-t border-gray-300">
          <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2">
            <p className="font-medium">{item.customerName}</p>
          </td>
          <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2">
            <p className="font-medium">{item.acDetails}</p>
          </td>
          <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2">
            <p className="font-medium">{item.status}</p>
          </td>
          <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2">
            <select
              className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
              onChange={(e) => handleAction(item.id, e.target.value)}
            >
              <option value="">Select Action</option>
              {item.actions.map((action, index) => (
                <option key={index} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </td>
          <td className="border border-gray-300 px-2 py-2 sm:px-4 sm:py-2">
            <p className="font-medium truncate">{item.paymentDetails}</p>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      {/* <div className="flex justify-center items-center space-x-2">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`py-1 px-3 rounded ${
              currentPage === index + 1
                ? "bg-primary text-white"
                : "bg-gray-300 hover:bg-gray-400 text-black"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default HomeBackend;