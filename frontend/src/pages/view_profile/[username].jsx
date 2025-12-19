import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import { clientServer } from "@/config";

export default function ViewProfile({ userProfile }) {
  return (
    <UserLayout>
      <DashboardLayout>
        <h1>{userProfile.userId.name}</h1>
        <p>@{userProfile.userId.username}</p>
      </DashboardLayout>
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
