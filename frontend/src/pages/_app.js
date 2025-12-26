import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { getAboutUser } from "@/config/redux/action/authAction";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const autoLogin = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            await store.dispatch(getAboutUser({ token }));
          } catch (error) {
            localStorage.removeItem("token");
          }
        }
      }
    };

    autoLogin();
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
