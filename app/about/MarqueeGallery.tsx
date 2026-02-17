"use client";

import Image from "next/image";
import React from "react";

const MarqueeGallery = () => {
  const images = [
    "/images/marquee1.webp",
    "/images/marquee2.webp",
    "/images/marquee3.webp",
    "/images/marquee4.webp",
    "/images/marquee5.webp",
  ];

  const socialOptions = [
    {
      icon: "/images/instagramslidericon.png",
      url: "https://www.instagram.com/sannai_technology/",
    },
    {
      icon: "/images/facebookslidericon.png",
      url: "https://www.facebook.com/SannaiTechnology",
    },
  ];

  return (
    <div className="w-full mt-[36px] overflow-hidden py-6 marquee-wrapper">
      <div className="animate-marquee gap-4 flex">
        {[...images, ...images].map((src, i) => {
          const social = socialOptions[i % 2];

          return (
            <div
              key={i}
              className="relative rounded-md overflow-hidden"
              style={{ width: "337.38px", height: "389.23px" }}
            >
              <Image src={src} alt="marquee item" fill className="object-cover" />

              {/* Smoother Hover Overlay */}
              <div
                className="
                  absolute inset-0 
                  bg-black/60
                  opacity-0 hover:opacity-100 
                  transition-all duration-500
                  flex items-center justify-center
                "
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    bg-white rounded-full p-4 
                    shadow-lg 
                    scale-75 hover:scale-100 
                    transition-all duration-500
                  "
                >
                  <Image
                    src={social.icon}
                    width={36}
                    height={36}
                    alt="social icon"
                    className="object-contain"
                  />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarqueeGallery;
