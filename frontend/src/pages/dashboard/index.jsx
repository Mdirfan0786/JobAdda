import { useRouter } from "next/router";
import React, { useEffect } from "react";

function dashboardComponent() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/auth?mode=login");
    }
  });
  return <div>dashboardComponent</div>;
}

export default dashboardComponent;
