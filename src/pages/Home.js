import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import {
  School as SchoolIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from '@mui/icons-material';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    {
      url: 'https://source.unsplash.com/random/1200x400?programming',
      title: 'Изучайте программирование',
      description: 'Начните свой путь в мир разработки'
    },
    {
      url: 'https://source.unsplash.com/random/1200x400?coding',
      title: 'Практические задания',
      description: 'Закрепляйте знания на практике'
    },
    {
      url: 'https://source.unsplash.com/random/1200x400?education',
      title: 'Сертификация',
      description: 'Получайте сертификаты по завершении курсов'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  return (
    <Container maxWidth="lg">
      {/* Slider Section */}
      <Box sx={{ mt: 2, mb: 6, position: 'relative' }}>
        <Box
          sx={{
            position: 'relative',
            height: '400px',
            backgroundImage: `url(${sliderImages[currentSlide].url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          <Box sx={{ position: 'relative', textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" gutterBottom>
              {sliderImages[currentSlide].title}
            </Typography>
            <Typography variant="h5">
              {sliderImages[currentSlide].description}
            </Typography>
          </Box>
        </Box>
        
        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePrevSlide}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.5)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={handleNextSlide}
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.5)' },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>

        {/* Dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {sliderImages.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: currentSlide === index ? 'primary.main' : 'grey.300',
                mx: 0.5,
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          pt: 4,
          pb: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
        >
          Научитесь программировать
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Изучайте программирование с помощью интерактивных курсов и практических заданий.
          Начните свой путь в мир разработки уже сегодня!
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/courses"
          sx={{ mt: 4 }}
        >
          Начать обучение
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 6 }} justifyContent="center">
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ height: '100%', maxWidth: 500, width: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Интерактивные уроки
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Изучайте программирование с помощью пошаговых уроков и практических примеров.
                Наши уроки разработаны опытными преподавателями.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ height: '100%', maxWidth: 500, width: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Практические задания
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Закрепляйте знания, решая реальные задачи и получая мгновенную обратную связь.
                Практикуйтесь в удобном для вас темпе.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ height: '100%', maxWidth: 500, width: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrophyIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Отслеживание прогресса
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Следите за своим прогрессом и получайте сертификаты по завершении курсов.
                Достигайте новых высот в обучении.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ height: '100%', maxWidth: 500, width: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Сообщество и поддержка
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Присоединяйтесь к активному сообществу, задавайте вопросы и получайте помощь от других участников и преподавателей.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Statistics Section */}
      <Paper sx={{ p: 4, mb: 6, bgcolor: 'primary.light' }}>
        <Grid container spacing={4} sx={{ textAlign: 'center', justifyContent: 'space-evenly', borderRadius: '20px' }}>
          <Grid item xs={12} sm={4}>
            <PeopleIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
            <Typography variant="h4" color="white" gutterBottom>
              1000+
            </Typography>
            <Typography variant="h6" color="white">
              Активных студентов
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <SchoolIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
            <Typography variant="h4" color="white" gutterBottom>
              50+
            </Typography>
            <Typography variant="h6" color="white">
              Курсов доступно
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TimeIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
            <Typography variant="h4" color="white" gutterBottom>
              24/7
            </Typography>
            <Typography variant="h6" color="white">
              Доступ к материалам
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Готовы начать обучение?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Присоединяйтесь к тысячам студентов, которые уже начали свой путь в программировании
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/register"
          sx={{ mt: 2 }}
        >
          Зарегистрироваться
        </Button>
      </Box>
    </Container>
  );
}

export default Home; 