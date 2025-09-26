import { useState, useEffect } from "react";

interface CascadeData {
  provinces: string[];
  cities: string[];
  districts: string[];
  villages: string[];
  names: string[];
}

export const useCascadeSelection = () => {
  const [cascadeData, setCascadeData] = useState<CascadeData>({
    provinces: [],
    cities: [],
    districts: [],
    villages: [],
    names: [],
  });

  const [loading, setLoading] = useState({
    provinces: false,
    cities: false,
    districts: false,
    villages: false,
    names: false,
  });

  const fetchProvinces = async () => {
    setLoading((prev) => ({ ...prev, provinces: true }));
    try {
      const response = await fetch("/api/cooperation/provinces");
      if (response.ok) {
        const provinces = await response.json();
        setCascadeData((prev) => ({ ...prev, provinces }));
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }));
    }
  };

  const fetchCities = async (province: string) => {
    if (!province) {
      setCascadeData((prev) => ({ ...prev, cities: [], districts: [], villages: [], names: [] }));
      return;
    }
    
    setLoading((prev) => ({ ...prev, cities: true }));
    try {
      const response = await fetch(`/api/cooperation/cities/${province}`);
      if (response.ok) {
        const cities = await response.json();
        setCascadeData((prev) => ({ ...prev, cities, districts: [], villages: [], names: [] }));
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  const fetchDistricts = async (province: string, city: string) => {
    if (!province || !city) {
      setCascadeData((prev) => ({ ...prev, districts: [], villages: [], names: [] }));
      return;
    }
    
    setLoading((prev) => ({ ...prev, districts: true }));
    try {
      const response = await fetch(`/api/cooperation/districts/${province}/${city}`);
      if (response.ok) {
        const districts = await response.json();
        setCascadeData((prev) => ({ ...prev, districts, villages: [], names: [] }));
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }));
    }
  };

  const fetchVillages = async (province: string, city: string, district: string) => {
    if (!province || !city || !district) {
      setCascadeData((prev) => ({ ...prev, villages: [], names: [] }));
      return;
    }
    
    setLoading((prev) => ({ ...prev, villages: true }));
    try {
      const response = await fetch(`/api/cooperation/villages/${province}/${city}/${district}`);
      if (response.ok) {
        const villages = await response.json();
        setCascadeData((prev) => ({ ...prev, villages, names: [] }));
      }
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoading((prev) => ({ ...prev, villages: false }));
    }
  };

  const fetchNamesByVillage = async (province: string, city: string, district: string, village: string) => {
    if (!province || !city || !district || !village) {
      setCascadeData((prev) => ({ ...prev, names: [] }));
      return;
    }
    
    setLoading((prev) => ({ ...prev, names: true }));
    try {
      const response = await fetch(`/api/cooperation/names/${province}/${city}/${district}/${village}`);
      if (response.ok) {
        const names = await response.json();
        setCascadeData((prev) => ({ ...prev, names }));
      }
    } catch (error) {
      console.error("Error fetching names:", error);
    } finally {
      setLoading((prev) => ({ ...prev, names: false }));
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  return {
    cascadeData,
    loading,
    fetchCities,
    fetchDistricts,
    fetchVillages,
    fetchNamesByVillage,
  };
};