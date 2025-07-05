import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Card, Statistic, Table, Calendar, Tag, Space, Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import {
  DashboardOutlined,
  CarOutlined,
  ToolOutlined,
  ScheduleOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  AlertOutlined
} from '@ant-design/icons';
import Customers from './Customers';
import Vehicles from './Vehicles'; 
import Inventory from './Inventory'; 
import Repair from './Repair'; 
import Technician from './Technician'; 


const { Header, Sider, Content } = Layout;
const { Option } = Select;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formType, setFormType] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Sample data - replace with actual API calls
  const [appointments, setAppointments] = useState([
    { id: 1, customer: 'John Doe', vehicle: 'Toyota Corolla', date: '2024-05-15', time: '09:00', status: 'Scheduled' },
    { id: 2, customer: 'Jane Smith', vehicle: 'Honda Civic', date: '2024-05-15', time: '10:30', status: 'In Progress' },
    { id: 3, customer: 'Mike Johnson', vehicle: 'Ford F-150', date: '2024-05-16', time: '13:00', status: 'Completed' },
  ]);

  const [vehicles, setVehicles] = useState([
    { id: 1, make: 'Toyota', model: 'Corolla', year: '2020', vin: 'JT2BF22K1W0123456', owner: 'John Doe' },
    { id: 2, make: 'Honda', model: 'Civic', year: '2019', vin: '2HGFC2F56KH543210', owner: 'Jane Smith' },
  ]);

  const [inventory, setInventory] = useState([
    { id: 1, name: 'Engine Oil 5W-30', quantity: 12, minLevel: 5, supplier: 'OilCo' },
    { id: 2, name: 'Brake Pads', quantity: 8, minLevel: 4, supplier: 'BrakeTech' },
  ]);

  const [repairs, setRepairs] = useState([
    { id: 1, vehicle: 'Toyota Corolla', service: 'Oil Change', cost: 75, date: '2024-05-10', technician: 'Alex' },
    { id: 2, vehicle: 'Honda Civic', service: 'Brake Service', cost: 120, date: '2024-05-12', technician: 'Sam' },
  ]);

  useEffect(() => {
    // Fetch user data on component mount
    const fetchUser = async () => {
      try {
        // Replace with actual API call
        const userData = { name: 'Admin User', role: 'admin' };
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    // Clear authentication token and redirect to login
    localStorage.removeItem('token');
    navigate('/login');
  };

  const showModal = (type) => {
    setFormType(type);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      // Here you would make an API call to submit the form data
      setIsModalVisible(false);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const renderForm = () => {
    switch (formType) {
      case 'appointment':
        return (
          <>
            <Form.Item label="Customer" name="customer" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Vehicle" name="vehicle" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Service Type" name="service" rules={[{ required: true }]}>
              <Select>
                <Option value="oil_change">Oil Change</Option>
                <Option value="tire_rotation">Tire Rotation</Option>
                <Option value="brake_service">Brake Service</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Date" name="date" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Time" name="time" rules={[{ required: true }]}>
              <Select>
                <Option value="09:00">09:00 AM</Option>
                <Option value="10:30">10:30 AM</Option>
                <Option value="13:00">01:00 PM</Option>
              </Select>
            </Form.Item>
          </>
        );
      case 'vehicle':
        return (
          <>
            <Form.Item label="Make" name="make" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Model" name="model" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Year" name="year" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="VIN" name="vin" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Owner" name="owner" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </>
        );
      case 'inventory':
        return (
          <>
            <Form.Item label="Item Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Minimum Level" name="minLevel" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Supplier" name="supplier" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="stats-row">
              <Card>
                <Statistic title="Today's Appointments" value={appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length} />
              </Card>
              <Card>
                <Statistic title="Vehicles in System" value={vehicles.length} />
              </Card>
              <Card>
                <Statistic title="Low Inventory Items" value={inventory.filter(i => i.quantity < i.minLevel).length} />
              </Card>
              <Card>
                <Statistic title="Pending Repairs" value={repairs.filter(r => r.status === 'In Progress').length} />
              </Card>
            </div>

            <div className="tables-row">
              <Card title="Upcoming Appointments" style={{ marginBottom: 16 }}>
                <Table 
                  dataSource={appointments.slice(0, 5)} 
                  columns={[
                    { title: 'Customer', dataIndex: 'customer' },
                    { title: 'Vehicle', dataIndex: 'vehicle' },
                    { title: 'Date', dataIndex: 'date' },
                    { title: 'Time', dataIndex: 'time' },
                    { 
                      title: 'Status', 
                      dataIndex: 'status',
                      render: status => (
                        <Tag color={status === 'Scheduled' ? 'blue' : status === 'In Progress' ? 'orange' : 'green'}>
                          {status}
                        </Tag>
                      )
                    },
                  ]} 
                  size="small" 
                />
              </Card>

              <Card title="Recent Repairs">
                <Table 
                  dataSource={repairs.slice(0, 5)} 
                  columns={[
                    { title: 'Vehicle', dataIndex: 'vehicle' },
                    { title: 'Service', dataIndex: 'service' },
                    { title: 'Cost', dataIndex: 'cost', render: cost => `$${cost}` },
                    { title: 'Date', dataIndex: 'date' },
                    { title: 'Technician', dataIndex: 'technician' },
                  ]} 
                  size="small" 
                />
              </Card>
            </div>
          </div>
        );
      case 'appointments':
        return (
          <div className="appointments-content">
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={() => showModal('appointment')}>
                Add New Appointment
              </Button>
            </div>
            <Card>
              <Table 
                dataSource={appointments} 
                columns={[
                  { title: 'Customer', dataIndex: 'customer' },
                  { title: 'Vehicle', dataIndex: 'vehicle' },
                  { title: 'Date', dataIndex: 'date' },
                  { title: 'Time', dataIndex: 'time' },
                  { 
                    title: 'Status', 
                    dataIndex: 'status',
                    render: status => (
                      <Tag color={status === 'Scheduled' ? 'blue' : status === 'In Progress' ? 'orange' : 'green'}>
                        {status}
                      </Tag>
                    )
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    render: (_, record) => (
                      <Space size="middle">
                        <Button size="small">Edit</Button>
                        <Button size="small" danger>Cancel</Button>
                      </Space>
                    ),
                  },
                ]} 
              />
            </Card>
          </div>
        );
      case 'vehicles':
        return <Vehicles />;
      case 'inventory':
        return <Inventory />;
      case 'repairs':
        return <Repair />;

        // return (
        //   <div className="repairs-content">
        //     <Card>
        //       <Table 
        //         dataSource={repairs} 
        //         columns={[
        //           { title: 'Vehicle', dataIndex: 'vehicle' },
        //           { title: 'Service', dataIndex: 'service' },
        //           { title: 'Cost', dataIndex: 'cost', render: cost => `$${cost}` },
        //           { title: 'Date', dataIndex: 'date' },
        //           { title: 'Technician', dataIndex: 'technician' },
        //           {
        //             title: 'Action',
        //             key: 'action',
        //             render: (_, record) => (
        //               <Space size="middle">
        //                 <Button size="small">View Details</Button>
        //                 <Button size="small">Edit</Button>
        //               </Space>
        //             ),
        //           },
        //         ]} 
        //       />
        //     </Card>
        //   </div>
        // );
      case 'billing':
        return (
          <div className="billing-content">
            <Card>
              <Table 
                dataSource={repairs.map(r => ({ ...r, invoice: `INV-${r.id.toString().padStart(4, '0')}` }))} 
                columns={[
                  { title: 'Invoice #', dataIndex: 'invoice' },
                  { title: 'Vehicle', dataIndex: 'vehicle' },
                  { title: 'Service', dataIndex: 'service' },
                  { title: 'Cost', dataIndex: 'cost', render: cost => `$${cost}` },
                  { title: 'Date', dataIndex: 'date' },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    render: () => <Tag color="green">Paid</Tag>
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    render: (_, record) => (
                      <Space size="middle">
                        <Button size="small">Print</Button>
                        <Button size="small">Email</Button>
                      </Space>
                    ),
                  },
                ]} 
              />
            </Card>
          </div>
        );
      case 'customers':
        return <Customers />;
      case 'technicians':
        return <Technician />;

        // return (
        //   <div className="technicians-content">
        //     <Card>
        //       <Table 
        //         dataSource={[
        //           { id: 1, name: 'Alex Johnson', specialization: 'Engine, Transmission', activeRepairs: 2 },
        //           { id: 2, name: 'Sam Wilson', specialization: 'Brakes, Suspension', activeRepairs: 1 },
        //         ]} 
        //         columns={[
        //           { title: 'Name', dataIndex: 'name' },
        //           { title: 'Specialization', dataIndex: 'specialization' },
        //           { title: 'Active Repairs', dataIndex: 'activeRepairs' },
        //           {
        //             title: 'Action',
        //             key: 'action',
        //             render: (_, record) => (
        //               <Space size="middle">
        //                 <Button size="small">View Schedule</Button>
        //                 <Button size="small">Edit</Button>
        //               </Space>
        //             ),
        //           },
        //         ]} 
        //       />
        //     </Card>
        //   </div>
        // );
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[activeTab]}
          onSelect={({ key }) => setActiveTab(key)}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="appointments" icon={<ScheduleOutlined />}>
            Appointments
          </Menu.Item>
          <Menu.Item key="vehicles" icon={<CarOutlined />}>
            Vehicles
          </Menu.Item>
          <Menu.Item key="repairs" icon={<ToolOutlined />}>
            Repairs
          </Menu.Item>
          <Menu.Item key="inventory" icon={<ShoppingCartOutlined />}>
            Inventory
          </Menu.Item>
          <Menu.Item key="billing" icon={<FileTextOutlined />}>
            Billing
          </Menu.Item>
          <Menu.Item key="customers" icon={<UserOutlined />}>
            Customers
          </Menu.Item>
          <Menu.Item key="technicians" icon={<TeamOutlined />}>
            Technicians
          </Menu.Item>
          <Menu.Item key="alerts" icon={<AlertOutlined />}>
            Alerts
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>Monaco Garage Management System</h2>
            {user && <span style={{ color: 'white' }}>Welcome, {user.name} ({user.role})</span>}
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          {renderContent()}
        </Content>
      </Layout>

      <Modal 
        title={`Add New ${formType.charAt(0).toUpperCase() + formType.slice(1)}`} 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          {renderForm()}
        </Form>
      </Modal>
    </Layout>
  );
};

export default Dashboard;