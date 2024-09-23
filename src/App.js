import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select, Typography } from 'antd';
import 'antd/dist/reset.css';
// import 'antd/dist/antd.css';

const { Title } = Typography;
const { Option } = Select;

const App = () => {
  const [emails, setEmails] = useState([]);
  const [filter, setFilter] = useState('no leidos'); // Filtro para leídos/no leídos
  const [updatedEmails, setUpdatedEmails] = useState([]); // Correo con estado actualizado

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/emails');
        setEmails(response.data);
        setUpdatedEmails(response.data); // Inicializa los correos en el estado
      } catch (error) {
        console.error("Error fetching emails", error);
      }
    };
    fetchEmails();
  }, []);

  // Función para manejar el filtro de "Leídos" y "No leídos"
  const handleFilterChange = (value) => {
    setFilter(value);
  };

  // Manejar el cambio de estado por cada fila de la tabla
  const handleStatusChange = (id, value) => {
    setUpdatedEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, status: value } : email
      )
    );
  };

  // Filtrar correos según la selección del dropdown "Leídos/No leídos"
  const filteredEmails = updatedEmails.filter((email) =>
    filter === 'leidos' ? email.isRead : !email.isRead
  );

  // Definición de columnas para la tabla
  const columns = [
    { title: 'From', dataIndex: 'from', key: 'from' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Select defaultValue={record.status || 'Pendiente'} style={{ width: 120 }} onChange={(value) => handleStatusChange(record.id, value)}>
          <Option value="Pendiente">Pendiente</Option>
          <Option value="Observado">Observado</Option>
          <Option value="Atendido">Atendido</Option>
          <Option value="Urgente">Urgente</Option>
          <Option value="Conocimiento">Conocimiento</Option>
        </Select>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Título */}
      <Title level={1} center>Gestor de Correos</Title>

      {/* Dropdown para seleccionar entre "Leídos" y "No leídos" */}
      <Select defaultValue="no leidos" style={{ width: 200, marginBottom: '20px' }} onChange={handleFilterChange}>
        <Option value="leidos">Leídos</Option>
        <Option value="no leidos">No leídos</Option>
      </Select>

      {/* Tabla de correos filtrados */}
      <Table dataSource={filteredEmails} columns={columns} rowKey="id" pagination={false} />
    </div>
  );
};

export default App;

