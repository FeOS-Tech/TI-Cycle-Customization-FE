import logo from "../assets/tt-logo.svg"
export default function Navbar(){
    const openWebsite = () =>{
        window.location.href = "https://trackandtrail.in/";
    };
    return(
        <div className ="flex items-center p-4 shadow bg-black">
            <img
                src={logo}
                alt="Logo"
                className="w-100 h-10 cursor-pointer"
                onClick={openWebsite}
            />
        </div>
    )
}