import FooterComponent from "@/Components/footer";
import NavbarComponent from "@/Components/Navbar";
import React from "react";

function UserLayout({ children }) {
  return (
    <>
      <NavbarComponent />
      <div>{children}</div>
      <FooterComponent />
    </>
  );
}

export default UserLayout;
