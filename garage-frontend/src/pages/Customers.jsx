import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Modal, Form, Input } from 'antd';
import customerApi from '@/api/customers';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err) {
      message.error('Failed to fetch customers');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = customers.filter(
      (customer) =>
        (customer.fullName && customer.fullName.toLowerCase().includes(value)) ||
        (customer.address && customer.address.toLowerCase().includes(value))
    );
    setFilteredCustomers(filtered);
  };

  const showDeleteConfirm = (id) => {
    console.log('Deleting customer with ID:', id);
    setDeletingId(id);
    setConfirmModalVisible(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await customerApi.deleteCustomer(deletingId);
      message.success('Customer deleted');
      fetchCustomers();
    } catch (err) {
      console.error('Delete error:', err);
      message.error('Failed to delete customer');
    }
    setConfirmModalVisible(false);
    setDeletingId(null);
  };

  const handleEdit = (record) => {
    setIsCreateMode(false);
    setEditingCustomer(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setIsCreateMode(true);
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (isCreateMode) {
        await customerApi.createCustomer(values);
        message.success('Customer created');
      } else {
        await customerApi.updateCustomer(editingCustomer._id, values);
        message.success('Customer updated');
      }
      setIsModalVisible(false);
      setEditingCustomer(null);
      fetchCustomers();
      setSearchText('');
    } catch {
      message.error(isCreateMode ? 'Failed to create customer' : 'Failed to update customer');
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => (a.address || '').localeCompare(b.address || ''),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => showDeleteConfirm(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Customers</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by name or address"
          value={searchText}
          onChange={handleSearch}
          allowClear
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleCreate}>
          Add Customer
        </Button>
      </Space>

      <Table
        dataSource={filteredCustomers}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={isCreateMode ? 'Add Customer' : 'Edit Customer'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCustomer(null);
          form.resetFields();
        }}
        okText={isCreateMode ? 'Create' : 'Update'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input phone!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={confirmModalVisible}
        onOk={handleDeleteConfirmed}
        onCancel={() => setConfirmModalVisible(false)}
        okText="Yes"
        cancelText="No"
        okType="danger"
      >
        <p>Are you sure you want to delete this customer?</p>
      </Modal>
    </div>
  );
};

export default Customers;
