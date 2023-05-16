import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

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

const App: React.FC = () => {
  const [data, setData] = useState<Person[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/data");
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newData = {
        id: data.length + 1,
        ...values,
      };

      axios
        .post("/api/data", newData)
        .then(() => {
          fetchData();
          setModalVisible(false);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const handleDelete = (id: number) => {
    const deleteId = parseInt(id.toString(), 10); // Convert id to number if needed
    axios
      .delete(`http://localhost:3000/api/data/${deleteId}`)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Gender", dataIndex: "gender" },
    {
      title: "Address",
      render: (_: any, record: Person) => (
        <div>
          <div>{record.address.street}</div>
          <div>{record.address.city}</div>
        </div>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: Person) => (
        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={handleAdd}>Add</Button>
      <Table dataSource={data} columns={columns} rowKey="id" />

      <Modal
        title="Add Person"
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["address", "street"]}
            label="
Street"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["address", "city"]}
            label="City"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
