import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Dashboard.css';
import { addDays, subDays, startOfDay, endOfDay } from 'date-fns';

// Registre os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dateOption, setDateOption] = useState('custom'); // Estado para a opção de data selecionada
  const employees = ['Funcionário 1', 'Funcionário 2', 'Funcionário 3', 'Funcionário 4'];

  useEffect(() => {
    fetch('http://localhost:8080/api/feedback/all')
      .then(response => response.json())
      .then(data => {
        setFeedbacks(data);
        setFilteredFeedbacks(data);
      })
      .catch(error => console.error('Error fetching feedbacks:', error));
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [startDate, endDate, selectedEmployee, dateOption]);

  const handleDateOptionChange = (e) => {
    const option = e.target.value;
    setDateOption(option);

    const now = new Date();
    let start = null;
    let end = now;

    switch (option) {
      case 'today':
        start = startOfDay(now);
        break;
      case 'yesterday':
        start = startOfDay(subDays(now, 1));
        end = endOfDay(subDays(now, 1));
        break;
      case 'last7':
        start = subDays(now, 7);
        break;
      case 'last30':
        start = subDays(now, 30);
        break;
      case 'custom':
      default:
        start = null;
        end = null;
        break;
    }

    setStartDate(start);
    setEndDate(end);
  };

  const filterFeedbacks = () => {
    let filtered = feedbacks;

    if (startDate) {
      filtered = filtered.filter(feedback => new Date(feedback.created_at) >= startDate);
    }

    if (endDate) {
      const adjustedEndDate = endOfDay(endDate);
      filtered = filtered.filter(feedback => new Date(feedback.created_at) <= adjustedEndDate);
    }

    if (selectedEmployee) {
      filtered = filtered.filter(feedback => feedback.employee === selectedEmployee);
    }

    setFilteredFeedbacks(filtered);
  };

  const ratingsData = {
    labels: ['Péssimo', 'Ruim', 'Mediano', 'Bom', 'Ótimo'],
    datasets: [
      {
        label: 'Avaliações',
        data: [
          filteredFeedbacks.filter(f => f.rating === 'Péssimo').length,
          filteredFeedbacks.filter(f => f.rating === 'Ruim').length,
          filteredFeedbacks.filter(f => f.rating === 'Mediano').length,
          filteredFeedbacks.filter(f => f.rating === 'Bom').length,
          filteredFeedbacks.filter(f => f.rating === 'Ótimo').length,
        ],
        backgroundColor: ['#ff4b5c', '#ff9153', '#ffcd56', '#4bc0c0', '#36a2eb'],
      },
    ],
  };

  return (
    <div className="container">
      <h1>Painel de Avaliações</h1>
      <div className="filters">
        <div>
          <label>Filtrar por: </label>
          <select value={dateOption} onChange={handleDateOptionChange}>
            <option value="custom">Personalizado</option>
            <option value="today">Hoje</option>
            <option value="yesterday">Ontem</option>
            <option value="last7">Últimos 7 Dias</option>
            <option value="last30">Últimos 30 Dias</option>
          </select>
        </div>
        {dateOption === 'custom' && (
          <>
            <div>
              <label>Data Inicial: </label>
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat="dd/MM/yyyy" />
            </div>
            <div>
              <label>Data Final: </label>
              <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat="dd/MM/yyyy" />
            </div>
          </>
        )}
        <div>
          <label>Funcionario: </label>
          <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
            <option value="">Todos</option>
            {employees.map((emp, index) => (
              <option key={index} value={emp}>{emp}</option>
            ))}
          </select>
        </div>
      </div>
      <Bar data={ratingsData} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Avaliação</th>
            <th>Encontrou?</th>
            <th>Funcionario</th>
            <th>DATA</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedbacks.map(feedback => (
            <tr key={feedback.id}>
              <td>{feedback.id}</td>
              <td>{feedback.rating}</td>
              <td>{feedback.found}</td>
              <td>{feedback.employee}</td>
              <td>{new Date(feedback.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
