import Image from "next/image";
import React from "react";

const FutureVision = () => {
  return (
    <div className=" mt-[36px] bg-[#f4f4f4] p-8 md:p-10 rounded-xl shadow-sm">

      <div className="flex flex-col xl:flex-row gap-8 md:gap-10 items-start xl:items-stretch">

        {/* LEFT IMAGE */}
        <div className="w-full xl:w-1/2">
          <Image
            src="/images/futurevision.png" // change to your image path
            alt="Future Vision"
            width={600}
            height={400}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>

        {/* RIGHT TEXT */}
        <div className="w-full xl:w-1/2 flex flex-col gap-4">

          <h2 className="text-[20px] md:text-[30px] xl:text-[32px] 2xl:text-[36px] font-semibold text-orange-500">
            Our Future Vision: Global Expansion
          </h2>

          <p className="text-[14px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] text-justify leading-[33px] text-gray-700">
            Sannai Technology Limited is not only focused on being a market leader in
            Bangladesh but also on positioning itself as a recognized global brand. We
            aim to enter new and emerging international markets, collaborating with
            distributors, resellers, and e-commerce partners to make our products
            available to customers everywhere.
          </p>

          <p className="text-[14px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] leading-[33px] text-gray-700">
            Our vision is built on innovation, sustainability, and reliability. By integrating 
            the latest technologies and design trends, we ensure that our mobile accessories 
            remain competitive in the ever-evolving digital landscape. We also emphasize 
            eco-friendly practices, ensuring our growth aligns with global sustainability goals.
            But global expansion for us goes beyond geography—it is about building meaningful 
            connections with diverse communities worldwide.
          </p>

          <p className="text-[14px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] leading-[33px] text-gray-700">
            We plan to localize our approach by understanding customer needs in each
            market and customizing solutions that truly add value to their digital lifestyles.
          </p>

        </div>

      </div>
    </div>
  );
};

export default FutureVision;
