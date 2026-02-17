import Image from "next/image";
import React from "react";

const MissionVision = () => {
  return (
    <div className="flex flex-col xl:flex-row justify-between gap-10 mt-14  ">

      {/* Mission */}
      <div className="bg-black rounded-xl p-10 xl:w-1/2 flex flex-col gap-6">
        <Image
          src="/images/mission.png"
          alt="Mission Icon"
          width={56}
          height={56}
          className="w-[56px] h-[56px]"
        />

        <h1 className="2xl:text-4xl xl:text-3xl text-xl text-white tracking-wide">
          Our Mission
        </h1>

        <p className="2xl:text-xl xl:text-lg text-justify text-base leading-[32px] text-white">
          At Sannai Technology, our mission is to provide innovative, reliable, and high-
          quality mobile accessories that enhance the everyday digital lifestyle of our 
          customers. We are committed to blending advanced technology with modern
          design, ensuring that every product not only performs well but also adds value
          to the user experience. We strive to maintain the highest standards of customer
          service, trust, and satisfaction, ensuring that every interaction with our brand 
          builds long-term relationships. Through continuous research, improvement, 
          and innovation, our goal is to deliver solutions that empower people to stay 
          connected in smarter and more meaningful ways.
        </p>
      </div>

      {/* Vision */}
      <div className="bg-black rounded-xl p-10 xl:w-1/2 flex flex-col gap-6">
        <Image
          src="/images/vission.png"
          alt="Vision Icon"
          width={56}
          height={56}
          className="w-[56px] h-[56px]"
        />

        <h1 className="2xl:text-4xl xl:text-3xl text-xl text-white tracking-wide">
          Our Vision
        </h1>

        <p className="2xl:text-xl xl:text-lg text-base text-justify leading-[32px] text-white">
          Our vision is to become the most trusted and leading provider of mobile 
          accessories in Bangladesh and beyond—a brand recognized for its quality, 
          innovation, and customer-first approach. We aspire to set benchmarks in the
          industry by offering products that combine durability, modern design, and eco-
          friendly practices. We envision creating a future where technology is accessible,
          sustainable, and reliable for all, contributing to a smarter lifestyle while positively
          impacting communities. By focusing on innovation and excellence, Sannai 
          Technology aims to grow into a global brand that customers can depend on 
          with confidence.
        </p>
      </div>

    </div>
  );
};

export default MissionVision;
