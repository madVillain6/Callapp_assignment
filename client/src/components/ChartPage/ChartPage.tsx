import React, { useEffect } from "react";
import axios from "axios";
import { create } from "zustand";
import { Pie } from "@ant-design/charts";

type Address = {
  street: string;
  city: string;
};

type Person = {
  id: number;
  name: string;
  email: string;
  gender: string;
  address: Address;
};

type CityData = {
  city: string;
  percentage: number;
};

const generateCityData = (data: Person[]): CityData[] => {
  const cityCounts: { [key: string]: number } = {};
  let totalPeople = 0;

  data.forEach((person) => {
    const city = person.address?.city; // Add null check for address
    if (city) {
      cityCounts[city] = cityCounts[city] ? cityCounts[city] + 1 : 1;
      totalPeople++;
    }
  });

  const cityData: CityData[] = [];
  for (const city in cityCounts) {
    const count = cityCounts[city];
    const percentage = (count / totalPeople) * 100;
    cityData.push({ city, percentage });
  }

  return cityData;
};

type ChartPageState = {
  cityData: CityData[];
  fetchData: () => void;
};

const useChartPageStore = create<ChartPageState>((set) => ({
  cityData: [],
  fetchData: async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/data");
      const data = response.data;
      const cityData = generateCityData(data);
      set({ cityData });
    } catch (error) {
      console.error(error);
    }
  },
}));

const ChartPage: React.FC = () => {
  const { cityData, fetchData } = useChartPageStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartConfig = {
    appendPadding: 10,
    data: cityData,
    angleField: "percentage",
    colorField: "city",
    radius: 1,
    label: {
      type: "inner",
      offset: "-30%",
      style: { textAlign: "center" },
      autoRotate: false,
      content: "{percentage}",
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <div>
      <h1>City Distribution Chart</h1>
      <Pie {...chartConfig} />
    </div>
  );
};

export default ChartPage;
