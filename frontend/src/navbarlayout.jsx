import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function NavbarLayout({searchText, setSearchText}) {
  return (
    <>
      <Navbar searchText={searchText} setSearchText={setSearchText} />
      <Outlet />
    </>
  );
}

export default NavbarLayout;