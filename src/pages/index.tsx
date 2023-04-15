import { type NextPage } from "next";

import { api } from "~/utils/api";
import PageLayout from "~/components/pageLayout";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <PageLayout noHeader>
      Gamma
    </PageLayout>
  );
};

export default Home;
