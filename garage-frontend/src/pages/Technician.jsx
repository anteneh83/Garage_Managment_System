import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Descriptions
} from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import technicianApi from "@/api/technician";

const { Option } = Select;

const Technician = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const data = await technicianApi.getAllTechnicians();
      setTechnicians(data);
    } catch (err) {
      message.error("Failed to fetch technicians");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleRegister = async (values) => {
    try {
      await technicianApi.registerTechnician(values);
      message.success("Technician registered successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchTechnicians();
    } catch (err) {
      message.error(err);
    }
  };

  const handleView = async (id) => {
    try {
      const tech = await technicianApi.getTechnicianById(id);
      setSelectedTechnician(tech);
      setViewModal(true);
    } catch (err) {
      message.error("Failed to load technician");
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleView(record._id)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Technician Management</h1>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsModalOpen(true)}>
          Add Technician
        </Button>
      </div>

      <Table
        rowKey="_id"
        dataSource={technicians}
        columns={columns}
        loading={loading}
      />

      {/* Register Modal */}
      <Modal
        open={isModalOpen}
        title="Register Technician"
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={handleRegister}>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
            <Select placeholder="Select specialization">
              <Option value="mechanic">Mechanic</Option>
              <Option value="electrician">Electrician</Option>
              <Option value="diagnostic">Diagnostic</Option>
              <Option value="bodywork">Bodywork</Option>
              <Option value="tire">Tire Specialist</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        open={viewModal}
        title="Technician Info"
        onCancel={() => setViewModal(false)}
        footer={null}
      >
        {selectedTechnician && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Full Name">{selectedTechnician.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedTechnician.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedTechnician.phone}</Descriptions.Item>
            <Descriptions.Item label="Specialization">{selectedTechnician.specialization}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Technician;
