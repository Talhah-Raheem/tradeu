'use client';

import { useEffect, useState } from "react";
import { getListings } from "@/lib/api/listings";
import { Listing } from "@/types/database";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Categories from "@/components/landing/Categories";
import FeaturedItems from "@/components/landing/FeaturedItems";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadListings = async () => {
      if (!isMounted) return;

      setLoading(true);
      setErrorMessage(null);
      try {
        const { data, error } = await getListings({ limit: 8 });
        if (!isMounted) return;

        if (error) {
          console.error("Error loading listings:", error);
          setListings([]);
          setErrorMessage("Unable to load listings right now.");
          return;
        }
        setListings(data ?? []);
      } catch (error) {
        if (!isMounted) return;
        console.error("Unexpected error loading listings:", error);
        setListings([]);
        setErrorMessage("Unable to load listings right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = async (search: string) => {
    setLoading(true);
    setErrorMessage(null);
    setSearchTerm(search);
    try {
      const { data, error } = await getListings({ search, limit: 8 });
      if (error) {
        console.error("Error searching listings:", error);
        setListings([]);
        setErrorMessage("Unable to load listings for that search.");
        return;
      }
      setListings(data ?? []);
    } catch (error) {
      console.error("Unexpected error searching listings:", error);
      setListings([]);
      setErrorMessage("Unable to load listings for that search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto">
        <Hero onSearch={handleSearch} />
        <Categories />
        <FeaturedItems listings={listings} loading={loading} errorMessage={errorMessage} />
        <WhyChooseUs />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
