import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Process } from "@/components/Process";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Work />
      <Process />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
