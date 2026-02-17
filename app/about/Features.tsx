import Image from "next/image";
import React from "react";

const Features = () => {
  const items = [
    {
      icon: "/images/fdelivery.png",
      text: "Free Delivery Shipping Over ৳2000",
    },
    {
      icon: "/images/cdelivery.png",
      text: "Cash on Delivery",
    },
    {
      icon: "/images/osupport.png",
      text: "Online Support 24/7",
    },
    {
      icon: "/images/hwarannty.png",
      text: "Hassle- Free Warranty",
    },
  ];

  return (
    <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-[#f4f4f4] rounded-xl p-4 md:p-6 py-6 flex flex-col xl:flex-row 
                     items-center justify-center gap-2 md:gap-3 text-center xl:text-left"
        >
          <Image
            src={item.icon}
            alt="feature icon"
            width={40}
            height={40}
            className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] object-contain"
          />

          <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-medium text-gray-800">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Features;
