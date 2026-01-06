import { useEffect, useState } from "react";
import logo from "../assets/tt-logo.svg";
import { CUSTOM_API, THEME_API_BASE } from '../config/api';
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [customizations, setCustomizations] = useState([]);
  const [open, setOpen] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const openWebsite = () => {
    window.location.href = "https://trackandtrail.in/";
  };
  const navigate = useNavigate();

    useEffect(() => {
    const handler = (e) => {
        if (!e.target.closest(".dropdown")) setOpen(false);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
    }, []); 

  useEffect(() => {
    // if user is missing -> don't even bother calling API
    if (!user?.phone) return;
    
    const fetchCustomizations = async () => {
      try {
        const res = await fetch(
          `${CUSTOM_API}/user/${user.phone}`
        );
        if (!res.ok) throw new Error("API failed");

        const data = await res.json();
        setCustomizations(data || []);
      } catch (err) {
        console.error("Customization fetch error:", err);
        setCustomizations([]); // fail gracefully
      }
    };

    fetchCustomizations();
  }, [user?.phone]);

  const showMyJobs =
    user?.sid && Array.isArray(customizations) && customizations.length > 0;

  return (
    <div className="flex items-center p-4 shadow bg-black">
      <img
        src={logo}
        alt="Logo"
        className="w-100 h-10 cursor-pointer"
        onClick={openWebsite}
      />

        <div className="ms-auto relative">
        {showMyJobs && (
            <div className="dropdown">
            <button
                className="dropdown-toggle-btn"
                onClick={() => setOpen((prev) => !prev)}
            >
                My Jobs
            </button>

            {open && (
                <ul className="dropdown-menu-custom">
                {customizations.map((item) => (
                    <li key={item._id}>
                    <button className="dropdown-item-custom"
                    onClick={() =>
                      window.location.href = `/kids/${item.themeSlug}/customize/${item.mode}/${item._id}`
                    }>
                        {item.customization_number || `Customization #${item._id}`}
                    </button>
                    </li>
                ))}
                </ul>
            )}
            </div>
        )}
        </div>

    </div>
  );
}
