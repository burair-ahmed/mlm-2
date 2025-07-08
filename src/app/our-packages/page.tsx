import Footer from "../components/footer/component";
import Header from "../components/header/component";
import IndustryPackage from "../components/packages/IndustryPackage";
import RentalPackage from "../components/packages/RentalPackage";
import TradingPackage from "../components/packages/TradingPackage";
// import { motion} from 'framer-motion';

export default function OurPackages() {
    return (
        <>
        <Header/>
        <div>
                  <section className="min-h-screen flex flex-col justify-center items-center px-6 bg-[#3e362e] text-white text-center py-20">
          <h1
         
            className="text-5xl md:text-6xl font-bold"
          >
            Our Packages
          </h1>
          <p className="mt-6 text-lg max-w-2xl text-[#ac8968]">
            Building your future with ethical, transparent, and profitable investments.
          </p>
        </section>
            <TradingPackage/>
            <RentalPackage/>
            <IndustryPackage/>
        </div>
        <Footer/>
        </>
    )
}