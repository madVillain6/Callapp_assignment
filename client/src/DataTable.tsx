import React, { useEffect, useState } from "react";
import { Table, TableProps } from "antd";
import axios from "axios";

interface DataItem {
  id: number;
  name: string;
  email: string;
  gender: string;
  address: {
    street: string;
    city: string;
  };
  phone: string;
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataItem[]>("/api/data");
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const columns: TableProps<DataItem>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Street",
      dataIndex: "address.street",
      key: "address.street",
    },
    {
      title: "City",
      dataIndex: "address.city",
      key: "address.city",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return <Table<DataItem> dataSource={data} columns={columns} />;
};

export default DataTable;
