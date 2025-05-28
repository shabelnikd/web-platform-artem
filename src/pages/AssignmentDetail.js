import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, CircularProgress, Box } from '@mui/material';
import axios from 'axios';

function AssignmentDetail() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Token ${token}` } } : {};
        const response = await axios.get(`https://artem.diplomcomtehno.online/api/assignments/${assignmentId}/`, config);
        setAssignment(response.data);
      } catch (err) {
        setError('Ошибка загрузки задания');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Container><Typography color="error">{error}</Typography></Container>;
  }
  if (!assignment) {
    return <Container><Typography color="error">Задание не найдено</Typography></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {assignment.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {assignment.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <b>Тестовые случаи:</b>
        </Typography>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>{JSON.stringify(assignment.test_cases, null, 2)}</pre>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          <b>Шаблон решения:</b>
        </Typography>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>{assignment.solution_template}</pre>
      </Paper>
    </Container>
  );
}

export default AssignmentDetail; 