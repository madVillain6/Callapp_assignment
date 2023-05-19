import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Form, Input, Select, Button } from "antd";
import { create } from "zustand";

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

type AppState = {
  data: Person[];
  fetchData: () => void;
  addPerson: (person: Person) => void;
  updatePerson: (id: number, person: Person) => void;
  deletePerson: (id: number) => void;
};

const useAppStore = create<AppState>((set) => ({
  data: [],
  fetchData: async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/data");
      set({ data: response.data });
    } catch (error) {
      console.error(error);
    }
  },
  addPerson: async (person) => {
    try {
      await axios.post("http://localhost:3000/api/data", person);
      set((state) => ({ data: [...state.data, person] }));
    } catch (error) {
      console.error(error);
    }
  },

  updatePerson: async (id, person) => {
    try {
      await axios.put(`http://localhost:3000/api/data/${id}`, person);
      set((state) => ({
        data: state.data.map((p) => (p.id === id ? person : p)),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deletePerson: async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/data/${id}`);
      set((state) => ({
        data: state.data.filter((person) => person.id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));

const DataTable: React.FC = () => {
  const { data, fetchData, addPerson, updatePerson, deletePerson } =
    useAppStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setModalVisible(true);
    setSelectedPerson(null);
    form.resetFields();
  };

  const handleEdit = (person: Person) => {
    setModalVisible(true);
    setSelectedPerson(person);
    form.setFieldsValue(person);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const newData = {
          id: selectedPerson?.id || data.length + 1,
          ...values,
        };

        if (selectedPerson) {
          updatePerson(selectedPerson.id, newData);
        } else {
          addPerson(newData);
        }
        setModalVisible(false);
      })
      .catch((error) => {
        console.error("Form validation error:", error);
      });
  };

  const handleDelete = (id: number) => {
    deletePerson(id);
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
          <div>{record.address?.street}</div>
          <div>{record.address?.city}</div>
        </div>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: Person) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={handleAdd}>Add</Button>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        onRow={(record: Person) => ({
          onDoubleClick: () => handleEdit(record),
        })}
      />
      <Modal
        forceRender
        title={selectedPerson ? "Edit Person" : "Add Person"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name and Last Name"
            initialValue={selectedPerson?.name}
            rules={[
              { required: true, message: "Please enter your name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            initialValue={selectedPerson?.email}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            initialValue={selectedPerson?.gender}
            rules={[{ required: true, message: "Please select your gender" }]}
          >
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["address", "street"]}
            label="Street"
            initialValue={selectedPerson?.address?.street}
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["address", "city"]}
            label="City"
            initialValue={selectedPerson?.address?.city}
            rules={[{ required: true, message: "Please enter your hometown" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTable;
