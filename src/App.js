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
              <div>{item.subject}</div>
              <div>{item.classNumber}</div>
            </div>
          ))
        ) : (
          <h2>No Timetable</h2>
        )}
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

function ImageSlider() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=5');
        //윗줄에서 API를받음
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
    autoplaySpeed: 10000,
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
        const response = await fetch('API 주소'); // API 주소를 여기에 넣어주세요(헤드라인을 받음)
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

function App() {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();

        const currentDay = new Date().getDay();
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const filteredTimetable = data.filter(item => {
          const classTime = item.classTime.split('~');
          const startTime = classTime[0].trim();
          const endTime = classTime[1].trim();
          const itemDay = item.dayOfWeek;
          return itemDay === currentDay && startTime <= currentTime && currentTime <= endTime;
        });

        setTimetable(filteredTimetable);
      } catch (error) {
        console.error(error);
        setTimetable([]);
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="container">
      <Header />
      <Timetable timetable={timetable} />
      <div className="line"></div>
      <div className="line"></div>
      <ImageSlider />
      <Headline />
      <div className="HeadLine"></div>
      <Footer />
    </div>
  );
}

export default App;
//84, 154줄에 API를 받는 부분이 존재
