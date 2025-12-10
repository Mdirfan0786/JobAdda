import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function dashboardComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isTokenThere, setTokenThere] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/auth?mode=login");
    }
    setTokenThere(true);
  });

  useEffect(() => {
    if (isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [isTokenThere]);
  return <div>dashboardComponent</div>;
}

export default dashboardComponent;
