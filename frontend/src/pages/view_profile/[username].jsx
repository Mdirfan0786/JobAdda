import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import { clientServer } from "@/config";
import styles from "./style.module.css";

export default function ViewProfile({ userProfile }) {
  return (
    <UserLayout>
      <div className={styles.conteiner}>
        <div className={styles.profile_container}>
          <div className={styles.profile_container_left}></div>
          <div className={styles.profile_container_right}></div>
        </div>
      </div>
    </UserLayout>
  );
}

export const getServerSideProps = async (context) => {
  try {
    const { username } = context.params;

    const res = await clientServer.get(
      `/user/get_Profile_based_on_username/${username}`,
      {
        params: { username },
      }
    );

    return {
      props: {
        userProfile: res.data,
      },
    };
  } catch (err) {
    return { notFound: true };
  }
};
