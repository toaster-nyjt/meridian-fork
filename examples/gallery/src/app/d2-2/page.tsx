"use client";

import { r2ODI } from "@/views/d2-2/soccer.meridian";
import { MeridianWrapper } from "meridian-ui";
import {
  MeridianOverview,
} from "meridian-ui";
import { useRouter } from "next/navigation";
import { r2Config } from "@/views/d2-2/r2-config";
import { useEffect, useState } from "react";

// Function to fetch the data
async function fetchR2Data() {
  // You could fetch from an API endpoint
  // const response = await fetch('/api/r2-data');
  // return response.json();

  // Or import dynamically
  const r2Data = await import("@/views/d2-2/r2-data.json");
  return r2Data.default;
}

export default function R2() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(2);
  const [progressiveData, setProgressiveData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedData = await fetchR2Data();

        // Start countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              // Initialize data but with empty lineups array
              const initialData = {
                ...fetchedData,
                lineups: [],
              };
              setData(fetchedData); // Store complete data for reference
              setProgressiveData(initialData); // Start with empty lineups
              setLoading(false);
              return 0;
            }
            return prev - 1;
          });
        }, 100);

        // Cleanup timer on unmount
        return () => clearInterval(timer);
      } catch (error) {
        console.error("Failed to load R2 data:", error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Progressive loading of lineup items
  useEffect(() => {
    if (!data || loading) return;

    let currentIndex = 0;
    const lineups = Array.isArray(data.lineups) ? [...data.lineups] : [];

    // Function to add the next lineup item
    const addNextLineupItem = () => {
      if (currentIndex < lineups.length) {
        setProgressiveData((prevData: any) => {
          const updatedData = {
            ...prevData,
            lineups: [...(prevData?.lineups || []), lineups[currentIndex]],
          };
          return updatedData;
        });
        currentIndex++;

        // Schedule the next item
        if (currentIndex < lineups.length) {
          setTimeout(addNextLineupItem, 200); // 0.2 seconds delay
        }
      }
    };

    // Start adding lineup items
    if (lineups.length > 0) {
      addNextLineupItem();
    }
  }, [data, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-2">Loading...</p>
          <p>Fetching async data: {countdown} seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-3">
      {progressiveData && (
        <MeridianWrapper data={progressiveData} odi={r2ODI} {...r2Config}>
          <MeridianOverview />
        </MeridianWrapper>
      )}
    </div>
  );
}
