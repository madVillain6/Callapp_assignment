import React, { useEffect, useState } from "react";
import { Table, Modal, Form, Input, Select, Button } from "antd";
import useAppStore, { Person } from "../../appStore";

const { Option } = Select;

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
