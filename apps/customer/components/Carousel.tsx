"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  { src: '/image_login.jpg', alt: 'Slide 1' },
  { src: '/image_login.jpg', alt: 'Slide 2' },
  { src: '/image_login.jpg', alt: 'Slide 3' },
  { src: '/image_login.jpg', alt: 'Slide 4' },
  { src: '/image_login.jpg', alt: 'Slide 5' },
];

export default function CarouselComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = images.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // 
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative w-full h-56 overflow-hidden rounded-lg md:h-96">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            } flex justify-center items-center`}
          >
            <div className="relative w-full overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                width={1920} 
                height={1080} 
                className="w-full h-auto object-cover"
                priority={index === currentIndex}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* <button
        onClick={prevSlide}
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 6 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 1 1 5l4 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button> */}

      {/* <button
        onClick={nextSlide}
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 6 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m1 9 4-4-4-4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button> */}
    </div>
  );
}
