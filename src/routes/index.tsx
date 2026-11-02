import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { WhyChoose, Specialities } from "@/components/landing/Specialities";
import { Packages, AskBanner, Posts } from "@/components/landing/Content";
import { Corporate, MapSection, Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "South Apollo Medical College Hospital" },
      {
        name: "description",
        content:
          "South Apollo Medical College Hospital — find a doctor, book appointments, health check packages and world-class specialities.",
      },
      { property: "og:title", content: "South Apollo Medical College Hospital" },
      {
        property: "og:description",
        content: "Find a doctor, book appointments and explore our specialities and health packages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main>
        <Hero />
        <WhyChoose />
        <Specialities />
        <Packages />
        <AskBanner />
        <Posts />
        <Corporate />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
