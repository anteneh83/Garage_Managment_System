import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  notification,
} from 'antd';
import vehicleApi from '@/api/vehicles';
import customerApi from '@/api/customers';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isCreateMode, setIsCreateMode] = useState(false);

  useEffect(() => {
    fetchVehicles();
    fetchCustomers();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.getAllVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (err) {
      notification.error({ message: '❌ Failed to fetch vehicles' });
    }
    setLoading(false);
  };

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.getAllCustomers();
      setCustomers(data);
    } catch {
      notification.error({ message: '❌ Failed to fetch customers' });
    }
  };

  const handleSearch = e => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    setFilteredVehicles(
      vehicles.filter(v =>
        v.make?.toLowerCase().includes(text) ||
        v.model?.toLowerCase().includes(text) ||
        v.vin?.toLowerCase().includes(text))
    );
  };

  const handleCreate = () => {
    setIsCreateMode(true);
    form.resetFields();
    setEditingVehicle(null);
    setIsModalVisible(true);
  };

  const handleEdit = record => {
    setIsCreateMode(false);
    setEditingVehicle(record);
    form.setFieldsValue({
      ...record,
      customerId: typeof record.customerId === 'string'
        ? record.customerId
        : record.customerId?._id,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (isCreateMode) {
        await vehicleApi.createVehicle(values);
        notification.success({ message: '✅ Vehicle created successfully' });
      } else {
        await vehicleApi.updateVehicle(editingVehicle._id, values);
        notification.success({ message: '✅ Vehicle updated successfully' });
      }

      fetchVehicles();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      notification.error({
        message: '❌ Operation failed',
        description: 'Check required fields or duplicate VIN.',
      });
    }
  };

  const showDeleteConfirm = id => {
    setDeletingId(id);
    setConfirmModalVisible(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await vehicleApi.deleteVehicle(deletingId);
      notification.success({ message: '🗑️ Vehicle deleted successfully' });
      fetchVehicles();
    } catch {
      notification.error({ message: '❌ Delete failed' });
    }
    setConfirmModalVisible(false);
    setDeletingId(null);
  };

  const getCustomerName = value => {
    if (!value) return 'N/A';
    const id = typeof value === 'string' ? value : value._id;
    const customer = customers.find(c => c._id === id);
    return customer ? customer.fullName : 'Loading...';
  };

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerId',
      render: getCustomerName,
      sorter: (a, b) => getCustomerName(a.customerId).localeCompare(getCustomerName(b.customerId)),
    },
    {
      title: 'Make',
      dataIndex: 'make',
      sorter: (a, b) => a.make.localeCompare(b.make),
    },
    {
      title: 'Model',
      dataIndex: 'model',
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: 'Year',
      dataIndex: 'year',
    },
    {
      title: 'VIN',
      dataIndex: 'vin',
    },
    {
      title: 'Reg. Number',
      dataIndex: 'registrationNumber',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Actions',
      render: (_, rec) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(rec)}>Edit</Button>
          <Button type="link" danger onClick={() => showDeleteConfirm(rec._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>🚗 Vehicle Management</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search make, model, VIN"
          value={searchText}
          onChange={handleSearch}
          allowClear
        />
        <Button type="primary" onClick={handleCreate}>➕ Add Vehicle</Button>
      </Space>

      <Table
        dataSource={filteredVehicles}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={isCreateMode ? '➕ Add Vehicle' : '✏️ Edit Vehicle'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={isCreateMode ? 'Create' : 'Update'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Customer"
            name="customerId"
            rules={[{ required: true, message: 'Select a customer' }]}
          >
            <Select
              placeholder="Select customer"
              showSearch
              optionFilterProp="children"
            >
              {customers.map(c => (
                <Select.Option key={c._id} value={c._id}>
                  {c.fullName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Make" name="make" rules={[{ required: true }]}>
            <Input placeholder="e.g. Toyota" />
          </Form.Item>
          <Form.Item label="Model" name="model" rules={[{ required: true }]}>
            <Input placeholder="e.g. Corolla" />
          </Form.Item>
          <Form.Item label="Year" name="year" rules={[{ required: true }]}>
            <Input type="number" placeholder="e.g. 2020" />
          </Form.Item>
          <Form.Item label="VIN" name="vin" rules={[{ required: true }]}>
            <Input placeholder="e.g. 1HGCM82633A123456" />
          </Form.Item>
          <Form.Item
            label="Registration Number"
            name="registrationNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. ABC-123" />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="archived">Archived</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="⚠️ Confirm Delete"
        open={confirmModalVisible}
        onOk={handleDeleteConfirmed}
        onCancel={() => setConfirmModalVisible(false)}
        okText="Yes"
        cancelText="No"
        okType="danger"
      >
        <p>Are you sure you want to delete this vehicle?</p>
      </Modal>
    </div>
  );
};

export default Vehicles;
