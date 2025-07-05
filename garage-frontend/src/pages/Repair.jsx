import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import repairApi from "@/api/repair";
import vehicleApi from '@/api/vehicles';

import technicianApi from "@/api/technician"; // Assumes assignment API exists

const { Option } = Select;

const Repair = () => {
  const [repairs, setRepairs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const data = await repairApi.getAllRepairs();
      setRepairs(data);
    } catch (err) {
      message.error("Failed to fetch repairs");
    }
    setLoading(false);
  };

  const fetchVehicles = async () => {
    try {
      const data = await vehicleApi.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      message.error("Failed to fetch vehicles");
    }
  };

  const fetchTechnicians = async () => {
    try {
      const data = await technicianApi.getAllAssignments();
      setTechnicians(data);
    } catch (err) {
      message.error("Failed to fetch technicians");
    }
  };

  useEffect(() => {
    fetchRepairs();
    fetchVehicles();
    fetchTechnicians();
  }, []);

  const handleFinish = async (values) => {
    try {
      if (editingId) {
        await repairApi.updateRepair(editingId, values);
        message.success("Repair updated successfully");
      } else {
        await repairApi.createRepair(values);
        message.success("Repair added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchRepairs();
    } catch (err) {
      message.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await repairApi.deleteRepair(id);
      message.success("Repair deleted");
      fetchRepairs();
    } catch (err) {
      message.error(err);
    }
  };

  const handleEdit = (record) => {
    setIsModalOpen(true);
    setEditingId(record._id);
    form.setFieldsValue(record);
  };

  const columns = [
    {
      title: "Vehicle",
      dataIndex: ["vehicleId", "registrationNumber"],
      key: "vehicle",
    },
    {
      title: "Technician",
      dataIndex: ["technicianId", "username"],
      key: "technician",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const color =
          status === "completed"
            ? "green"
            : status === "in_progress"
            ? "orange"
            : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      render: (val) => `ETB ${val}`,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} type="link">
            Edit
          </Button>
          <Button onClick={() => handleDelete(record._id)} type="link" danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Repair Management</h1>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsModalOpen(true)}>
          Add Repair
        </Button>
      </div>
      <Table
        rowKey="_id"
        dataSource={repairs}
        columns={columns}
        loading={loading}
      />

      <Modal
        open={isModalOpen}
        title={editingId ? "Edit Repair" : "Add Repair"}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingId(null);
        }}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item name="vehicleId" label="Vehicle" rules={[{ required: true }]}>
            <Select placeholder="Select a vehicle">
              {vehicles.map((v) => (
                <Option key={v._id} value={v._id}>
                  {v.registrationNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="technicianId" label="Technician" rules={[{ required: true }]}>
            <Select placeholder="Select a technician">
              {technicians.map((t) => (
                <Option key={t._id} value={t._id}>
                  {t.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="servicesPerformed" label="Services Performed">
            <Select mode="tags" placeholder="Enter services" />
          </Form.Item>
          <Form.Item name="partsReplaced" label="Parts Replaced">
            <Select mode="tags" placeholder="Enter parts" />
          </Form.Item>
          <Form.Item name="cost" label="Cost (ETB)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="pending">
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Repair;
