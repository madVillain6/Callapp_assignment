import React, { useEffect, useMemo } from "react";
import { Pie } from "@ant-design/charts";
import useAppStore, { Person } from "../../appStore";

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

const ChartPage: React.FC = () => {
  const { data, fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cityData = useMemo(() => generateCityData(data), [data]);

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
