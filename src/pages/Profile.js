import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import {
  School as CourseIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CompletedIcon,
  Email as EmailIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const config = { headers: { Authorization: `Token ${token}` } };
        const [userResponse, progressResponse] = await Promise.all([
          axios.get('https://artem.diplomcomtehno.online/api/auth/user/', config),
          axios.get('https://artem.diplomcomtehno.online/api/progress/', config),
        ]);
        setUserData(userResponse.data);
        setProgress(progressResponse.data || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3, textAlign: 'center', bgcolor: 'background.paper', width: '100%' }}>
        <Avatar sx={{ width: 90, height: 90, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 48 }}>
          <PersonIcon fontSize="inherit" />
        </Avatar>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {userData?.first_name} {userData?.last_name}
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={2}>
          <EmailIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {userData?.email}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={2}>
          <CalendarIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {userData?.date_joined ? `С нами с ${new Date(userData.date_joined).toLocaleDateString()}` : 'Пользователь платформы'}
          </Typography>
        </Stack>
        <Chip icon={<StarIcon sx={{ color: 'gold' }} />} label="Уровень: Новичок" color="warning" variant="outlined" sx={{ mb: 2 }} />

        {/* Блок О себе */}
        <Box sx={{ my: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            О себе
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData?.about || 'Вы можете добавить информацию о себе для других участников платформы.'}
          </Typography>
        </Box>

        {/* Достижения */}
        <Box sx={{ my: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Достижения
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            <Tooltip title="Первый курс!">
              <Chip icon={<CourseIcon color="primary" />} label="Первый курс" color="primary" />
            </Tooltip>
            <Tooltip title="5 уроков подряд!">
              <Chip icon={<CompletedIcon color="success" />} label="5 уроков" color="success" />
            </Tooltip>
            <Tooltip title="100% прогресс!">
              <Chip icon={<StarIcon sx={{ color: 'gold' }} />} label="100%" color="warning" />
            </Tooltip>
          </Stack>
        </Box>

        {/* Статистика */}
        <Box sx={{ my: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Статистика
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CourseIcon color="primary" />
              <Typography variant="body2">Курсов завершено: <b>{progress.filter(cp => (cp.course?.lessons?.length || 0) === (cp.completed_lessons?.length || 0)).length}</b></Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CompletedIcon color="success" />
              <Typography variant="body2">Уроков завершено: <b>{progress.reduce((acc, cp) => acc + (cp.completed_lessons?.length || 0), 0)}</b></Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AssignmentIcon color="warning" />
              <Typography variant="body2">Заданий выполнено: <b>{progress.reduce((acc, cp) => acc + (cp.completed_assignments?.length || 0), 0)}</b></Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarIcon color="action" />
              <Typography variant="body2">Дней на платформе: <b>{userData?.date_joined ? Math.max(1, Math.round((Date.now() - new Date(userData.date_joined)) / (1000 * 60 * 60 * 24))) : '-'}</b></Typography>
            </Stack>
          </Stack>
        </Box>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutIcon />}
          sx={{ mt: 2, fontWeight: 600 }}
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Выйти из аккаунта
        </Button>
      </Paper>

      {/* Блок прогресса и курсов */}
      <Grid item xs={12} md={8}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          Мой прогресс
        </Typography>
        <Grid container spacing={3}>
          {progress && progress.length > 0 ? progress.map((courseProgress) => {
            const totalLessons = courseProgress.course?.lessons?.length || 0;
            const completedLessons = courseProgress.completed_lessons?.length || 0;
            const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
            return (
              <Grid item xs={12} md={6} key={courseProgress.id}>
                <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                      <CourseIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        {courseProgress.course?.title || 'Без названия'}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Прогресс: {completedLessons} из {totalLessons} уроков
                    </Typography>
                    <LinearProgress variant="determinate" value={percent} sx={{ height: 10, borderRadius: 5, mb: 1 }} color={percent === 100 ? 'success' : 'primary'} />
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Tooltip title="Открыть курс">
                        <Button
                          component={RouterLink}
                          to={`/courses/${courseProgress.course?.id || ''}`}
                          variant="contained"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                        >
                          Перейти
                        </Button>
                      </Tooltip>
                      {percent === 100 && <Chip icon={<CompletedIcon color="success" />} label="Курс завершён" color="success" size="small" />}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          }) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'grey.100' }}>
                <Typography variant="body1" color="text.secondary">
                  Вы ещё не начали ни один курс. <br />
                  <Button component={RouterLink} to="/courses" variant="contained" sx={{ mt: 2 }}>
                    Начать обучение
                  </Button>
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Последние выполненные задания */}
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mt: 5, mb: 2 }}>
          Последние выполненные задания
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1, mb: 2 }}>
          <List>
            {progress && progress.length > 0 && progress.flatMap((courseProgress) =>
              (courseProgress.completed_assignments || []).map((assignment) => (
                <ListItem key={assignment.id} sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  <ListItemIcon>
                    <AssignmentIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={assignment.title}
                    secondary={`Курс: ${courseProgress.course?.title || ''}`}
                  />
                  <Tooltip title="Открыть задание">
                    <Button
                      component={RouterLink}
                      to={`/courses/${courseProgress.course?.id || ''}/lessons/${assignment.lesson}/assignments/${assignment.id}`}
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Открыть
                    </Button>
                  </Tooltip>
                </ListItem>
              ))
            )}
            {/* Если нет выполненных заданий */}
            {progress && progress.length > 0 && progress.every(cp => !cp.completed_assignments || cp.completed_assignments.length === 0) && (
              <ListItem>
                <ListItemText primary="У вас пока нет выполненных заданий." />
              </ListItem>
            )}
          </List>
        </Paper>
      </Grid>
    </Container>
  );
}

export default Profile; 