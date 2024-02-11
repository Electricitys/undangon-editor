"use client";

import TinySlider from "tiny-slider-react";
import "tiny-slider/dist/tiny-slider.css";

const settings = {
  lazyload: true,
  nav: false,
  mouseDrag: true,
};

const imgs = [
  "http://d2ji2mue1p384z.cloudfront.net/img/480x360/162951.jpg",
  "http://d2ji2mue1p384z.cloudfront.net/img/480x360/162465.jpg",
  "http://d2ji2mue1p384z.cloudfront.net/img/480x360/220048.jpg"
];

const loadingImage = "data:image/gif;base64,R0lGODlhAQABAPAAAMzMzAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

export const HomepageCarousel = () => {
  return (
    <TinySlider settings={settings}>
      {imgs.map((el, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            className={`tns-lazy-img`}
            // src={loadingImage}
            data-src={el}
            alt=""
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover"
            }}
          />
        </div>
      ))}
    </TinySlider>
  );
};
