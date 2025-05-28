import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Avatar,
  Tooltip,
  Rating,
} from '@mui/material';
import { School as SchoolIcon, Star as StarIcon, Person as PersonIcon, MenuBook as LessonIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import axios from 'axios';

const difficultyMap = {
  beginner: { label: 'Начинающий', color: 'success', icon: <StarIcon fontSize="small" /> },
  intermediate: { label: 'Средний', color: 'warning', icon: <StarIcon fontSize="small" /> },
  advanced: { label: 'Продвинутый', color: 'error', icon: <StarIcon fontSize="small" /> },
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [difficulty, setDifficulty] = useState('all');
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://artem.diplomcomtehno.online/admin/api/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = difficulty === 'all'
    ? courses
    : courses.filter(course => course.difficulty === difficulty);

  const handleRate = (courseId, value) => {
    setUserRatings((prev) => ({ ...prev, [courseId]: value }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Доступные курсы
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Сложность</InputLabel>
          <Select
            value={difficulty}
            label="Сложность"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <MenuItem value="all">Все уровни</MenuItem>
            <MenuItem value="beginner">Начинающий</MenuItem>
            <MenuItem value="intermediate">Средний</MenuItem>
            <MenuItem value="advanced">Продвинутый</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredCourses.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <SchoolIcon sx={{ fontSize: 80, color: 'grey.300' }} />
          <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
            Нет доступных курсов по выбранному уровню.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredCourses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-6px) scale(1.03)',
                    boxShadow: 8,
                  },
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={course.image || 'https://source.unsplash.com/random/400x180?programming'}
                    alt={course.title}
                  />
                  <Chip
                    label={difficultyMap[course.difficulty]?.label || 'Неизвестно'}
                    color={difficultyMap[course.difficulty]?.color || 'default'}
                    icon={difficultyMap[course.difficulty]?.icon}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      fontWeight: 600,
                      fontSize: 16,
                      px: 1.5,
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                      {course.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                      {course.description}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <LessonIcon color="primary" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {course.lessons?.length || 0} уроков
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {course.instructor?.first_name} {course.instructor?.last_name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Rating
                        name={`course-rating-${course.id}`}
                        value={course.rating || 0}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({course.rating_count || 0})
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Tooltip title="Ваша оценка">
                        <Rating
                          name={`user-rating-${course.id}`}
                          value={userRatings[course.id] || null}
                          onChange={(_, value) => handleRate(course.id, value)}
                          size="small"
                        />
                      </Tooltip>
                      <Typography variant="body2" color="text.secondary">
                        Оценить
                      </Typography>
                    </Stack>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={RouterLink}
                    to={`/courses/${course.id}`}
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    sx={{ fontWeight: 600, py: 1, fontSize: 16 }}
                  >
                    Подробнее
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Courses; 