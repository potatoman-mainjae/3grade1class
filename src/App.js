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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="footer">
      <div className="right">
        현재 시간: {currentTime.toLocaleTimeString()}
      </div>
    </footer>
  );
}

function ImageSlider() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=5'); // 예시 API
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
    autoplaySpeed: 10000, // 10초
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
  const [headline, setHeadline] = useState(""); // 헤드라인 상태

  useEffect(() => {
    const fetchHeadline = async () => {
      try {
        // API에서 헤드라인 데이터 가져오기
        const response = await fetch('API 주소'); // API 주소를 여기에 넣어주세요
        const data = await response.json();
        // API에서 받은 데이터를 헤드라인 상태로 설정
        setHeadline(data.headline);
      } catch (error) {
        console.error('Error fetching headline:', error);
        // 에러 발생 시 기본 텍스트로 설정
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
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // 예시 API
        const data = await response.json();

        // 오늘의 요일을 구하기 (0: 일요일, 1: 월요일, ..., 6: 토요일)
        const currentDay = new Date().getDay();

        // 현재 시간을 구하기
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // 현재 시간과 요일에 해당하는 데이터 필터링
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
      <Headline/>
      <div className="HeadLine"></div>
      <Footer />
    </div>
  );
}

export default App;
