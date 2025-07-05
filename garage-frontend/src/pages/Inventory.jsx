import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Tag,
} from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import inventoryApi from '@/api/inventory';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await inventoryApi.getAllItems();
      setItems(data);
      setFiltered(data);
    } catch {
      message.error('❌ Failed to fetch inventory');
    }
    setLoading(false);
  };

  const handleSearch = e => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    setFiltered(items.filter(item =>
      item.name.toLowerCase().includes(text) ||
      item.category.toLowerCase().includes(text) ||
      item.supplier?.toLowerCase().includes(text)
    ));
  };

  const handleCreate = () => {
    setIsCreateMode(true);
    form.resetFields();
    setEditingItem(null);
    setIsModalVisible(true);
  };

  const handleEdit = record => {
    setIsCreateMode(false);
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (isCreateMode) {
        await inventoryApi.createItem(values);
        message.success('✅ Item created successfully');
      } else {
        await inventoryApi.updateItem(editingItem._id, values);
        message.success('✅ Item updated successfully');
      }

      fetchItems();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('❌ Operation failed');
    }
  };

  const showDeleteConfirm = id => {
    setDeletingId(id);
    setConfirmModalVisible(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await inventoryApi.deleteItem(deletingId);
      message.success('🗑️ Item deleted successfully');
      fetchItems();
    } catch {
      message.error('❌ Delete failed');
    }
    setConfirmModalVisible(false);
    setDeletingId(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Inventory Report', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Name', 'Category', 'Qty', 'Reorder Level', 'Supplier', 'Price/unit']],
      body: filtered.map(i => [
        i.name,
        i.category,
        i.quantity,
        i.reorderLevel,
        i.supplier || '-',
        i.pricePerUnit,
      ]),
    });
    doc.save(`inventory-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (qty, record) =>
        qty < record.reorderLevel ? (
          <Tag color="red">{qty} ⚠️</Tag>
        ) : (
          <Tag color="green">{qty}</Tag>
        ),
    },
    {
      title: 'Reorder Level',
      dataIndex: 'reorderLevel',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
    },
    {
      title: 'Price/Unit',
      dataIndex: 'pricePerUnit',
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
      <h2>📦 Inventory Management</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search name, category, supplier"
          value={searchText}
          onChange={handleSearch}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Add Item
        </Button>
        <Button onClick={exportToPDF} icon={<DownloadOutlined />}>
          Export PDF
        </Button>
      </Space>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={isCreateMode ? '➕ Add Item' : '✏️ Edit Item'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={isCreateMode ? 'Create' : 'Update'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="spare_part">Spare Part</Select.Option>
              <Select.Option value="tool">Tool</Select.Option>
              <Select.Option value="supply">Supply</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="reorderLevel" label="Reorder Level">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="supplier" label="Supplier">
            <Input />
          </Form.Item>
          <Form.Item name="pricePerUnit" label="Price per Unit">
            <Input type="number" />
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
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </div>
  );
};

export default Inventory;
