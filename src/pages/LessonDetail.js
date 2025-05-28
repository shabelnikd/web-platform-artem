import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';

function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressId, setProgressId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [creatingProgress, setCreatingProgress] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/lessons/${lessonId}/`);
        setLesson(response.data);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const config = { headers: { Authorization: `Token ${token}` } };
        const response = await axios.get('http://localhost:8000/api/progress/', config);
        // Найти progress для текущего курса
        const progress = response.data.find((p) => String(p.course.id) === String(courseId));
        if (progress) setProgressId(progress.id);
      } catch (error) {
        // игнорируем
      }
    };
    fetchProgress();
  }, [courseId]);

  const handleCompleteLesson = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Token ${token}` } };
      let pid = progressId;
      setCreatingProgress(true);
      if (!pid) {
        // Создать прогресс по курсу
        const createResp = await axios.post('http://localhost:8000/api/progress/', { course_id: Number(courseId) }, config);
        pid = createResp.data.id;
        setProgressId(pid);
      }
      // Отметить урок как пройденный
      await axios.post(`http://localhost:8000/api/progress/${pid}/complete_lesson/`, { lesson_id: lessonId }, config);
      setSnackbarMsg('Урок отмечен как пройденный!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMsg('Ошибка при отметке урока');
      setSnackbarOpen(true);
    } finally {
      setCreatingProgress(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Урок не найден
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {lesson.title}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            {lesson.content}
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Практические задания
          </Typography>
          <List>
            {lesson.assignments.map((assignment) => (
              <ListItem key={assignment.id}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText
                  primary={assignment.title}
                  secondary={assignment.description}
                />
                <Button
                  variant="contained"
                  startIcon={<CodeIcon />}
                  component={RouterLink}
                  to={`/courses/${courseId}/lessons/${lessonId}/assignments/${assignment.id}`}
                >
                  Решить задачу
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            component={RouterLink}
            to={`/courses/${courseId}`}
          >
            Назад к курсу
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCompleteLesson}
            disabled={creatingProgress}
          >
            Отметить как пройденный
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
      />
    </Container>
  );
}

export default LessonDetail; 