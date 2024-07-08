import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Header() {
  return (
    <header className="header">
      <h1>MID IN</h1>
    </header>
  );
}

function Timetable(props) {
  return (
    <div className="timetable-container">
      {props.timetable.length > 0 ? (
        props.timetable.map((item, index) => (
          <div className="timetable-row" key={index}>
            <div className="timetable-item">{item.교시}</div>
            <div className="timetable-item">{item.과목}</div>
            <div className="timetable-item">{item.해당학생}</div>
          </div>
        ))
      ) : (
        <h2>데이터 없음</h2>
      )}
    </div>
  );
}

function ImageSlider() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=5');
        const data = await response.json();
        const imageUrls = data.map(item => item.url);
        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '30px',
    autoplay: true,
    autoplaySpeed: 5000, // 5초로 변경
    cssEase: 'linear'
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <img src={src} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

function Headline() {
  const [headline, setHeadline] = useState("");

  useEffect(() => {
    const fetchHeadline = async () => {
      try {
        const response = await fetch('https://api.example.com/headline'); // 실제 API 주소로 변경
        const data = await response.json();
        setHeadline(data.headline);
      } catch (error) {
        console.error('Error fetching headline:', error);
        setHeadline("오늘의 주요 뉴스: 기사 제목");
      }
    };

    fetchHeadline();
  }, []);

  return (
    <div className="headline">
      <h2>{headline}</h2>
    </div>
  );
}

function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = 'f813d4c006fc5112a174c82c210070ad';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Changwon&appid=${apiKey}&units=metric`);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <footer className="footer">
      <div className="right">
        현재 시간: {currentTime.toLocaleTimeString()}
      </div>
      <div className="right">
        {weather ? (
          <div>
            <div>현재 온도: {weather.main.temp}°C</div>
            <div>날씨: {weather.weather[0].description}</div>
          </div>
        ) : (
          <div>날씨 정보를 불러오는 중...</div>
        )}
      </div>
    </footer>
  );
}

function App() {
  const [timetable, setTimetable] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dayOfWeek] = useState(new Date().getDay());

  const getClassPeriod = (time) => {
    const periods = [
      { start: "08:40", end: "09:30", class: 1 },
      { start: "09:40", end: "10:30", class: 2 },
      { start: "10:40", end: "11:30", class: 3 },
      { start: "11:40", end: "12:30", class: 4 },
      { start: "12:30", end: "13:30", class: "lunch" },
      { start: "13:30", end: "14:20", class: 5 },
      { start: "14:30", end: "15:20", class: 6 },
      { start: "15:30", end: "16:20", class: 7 }
    ];

    const current = periods.find(period => {
      const start = new Date();
      const end = new Date();
      const [startHour, startMinute] = period.start.split(':');
      const [endHour, endMinute] = period.end.split(':');

      start.setHours(startHour, startMinute);
      end.setHours(endHour, endMinute);

      return time.getTime() >= start.getTime() && time.getTime() <= end.getTime();
    });

    return current ? current.class : null;
  };

  const fetchTimetable = async (currentClass) => {
    try {
      if (currentClass && currentClass !== "lunch") {
        const response = await fetch(`https://api.example.com/timetable?class=${currentClass}`); // 실제 API 주소로 변경
        const data = await response.json();
        setTimetable(data);
      } else {
        setTimetable([]);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setTimetable([]);
    }
  };

  useEffect(() => {
    const updateCurrentClass = () => {
      const now = new Date();
      const currentClassPeriod = getClassPeriod(now);
      fetchTimetable(currentClassPeriod); // 상태를 설정하는 대신 함수를 직접 호출
    };

    updateCurrentClass();
    const timer = setInterval(updateCurrentClass, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDailyTimetable = async () => {
      try {
        let url = '';

        switch (dayOfWeek) {
          case 1: // Monday
            url = 'https://api.example.com/monday-timetable'; // 실제 API 주소로 변경
            break;
          case 2: // Tuesday
            url = 'https://api.example.com/tuesday-timetable'; // 실제 API 주소로 변경
            break;
          case 3: // Wednesday
            url = 'https://api.example.com/wednesday-timetable'; // 실제 API 주소로 변경
            break;
          case 4: // Thursday
            url = 'https://api.example.com/thursday-timetable'; // 실제 API 주소로 변경
            break;
          case 5: // Friday
            url = 'https://api.example.com/friday-timetable'; // 실제 API 주소로 변경
            break;
          case 6: // Saturday
          case 0: // Sunday
            setTimetable([]);
            return;
          default:
            setTimetable([]);
            return;
        }

        const response = await fetch(url);
        const data = await response.json();
        setTimetable(data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setTimetable([]);
      }
    };

    fetchDailyTimetable();
  }, [dayOfWeek]);

  useEffect(() => {
    if (timetable.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex < timetable.length - 1) {
            return prevIndex + 1;
          } else {
            return 0; // 슬라이드가 끝나면 처음으로 돌아감
          }
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [timetable]);

  return (
    <div className="container">
      <Header />
      <Timetable timetable={timetable.slice(0, currentIndex + 1)} />
      <div className="line"></div>
      <ImageSlider />
      <Headline />
      <Footer />
    </div>
  );
}

export default App;
