import { DM_Sans } from "next/font/google";
import { Hero } from "../components/core/Hero";
import { FeaturesCards } from "../components/core/Features";

const dmSans = DM_Sans({ subsets: ["latin"] });

const Home = () => {
  return (
    <>
      <div className={dmSans.className}>
        
        <span>Stockage all your data</span>

      </div>
    </>
  );
}

export default Home;