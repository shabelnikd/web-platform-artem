import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  PlayCircleOutline as LessonIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import axios from 'axios';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/${id}/`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Курс не найден
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Преподаватель: {course.instructor.first_name} {course.instructor.last_name}
        </Typography>
        <Typography variant="body1" paragraph>
          {course.description}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Содержание курса
          </Typography>
          <List>
            {course.lessons.map((lesson, index) => (
              <React.Fragment key={lesson.id}>
                <ListItem>
                  <ListItemIcon>
                    <LessonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={lesson.title}
                    secondary={`Урок ${index + 1}`}
                  />
                  <Button
                    component={RouterLink}
                    to={`/courses/${course.id}/lessons/${lesson.id}`}
                    variant="outlined"
                  >
                    Начать урок
                  </Button>
                </ListItem>
                {lesson.assignments.map((assignment) => (
                  <ListItem key={assignment.id} sx={{ pl: 9 }}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={assignment.title}
                      secondary="Практическое задание"
                    />
                  </ListItem>
                ))}
                {index < course.lessons.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Начать обучение
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CourseDetail; 