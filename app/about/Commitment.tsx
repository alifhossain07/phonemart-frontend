import Image from "next/image";
import React from "react";

const Commitment = () => {
  return (
    <div className="mt-[36px] bg-[#f4f4f4] p-8 md:p-10 rounded-xl shadow-sm">

      <div className="flex flex-col xl:flex-row gap-8 md:gap-10 items-start xl:items-stretch">
      <div className="w-full  xl:hidden xl:w-1/2">
          <Image
            src="/images/commitment.png"
            alt="Commitment Image"
            width={600}
            height={600}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
        {/* LEFT TEXT */}
        <div className="w-full xl:w-1/2 flex flex-col gap-4">

          <h2 className="text-[20px] md:text-[30px] xl:text-[32px] 2xl:text-[36px] font-semibold text-orange-500">
            Our Commitment to Growth
          </h2>

          <p className="text-[14px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] leading-[33px] text-gray-700 text-justify">
            Growth at Sannai Technology Limited is not just about expansion—it’s
            about creating lasting value for our customers, employees, and
            communities. We continuously invest in research and development (R&D)
            to design forward-thinking solutions that improve the way people
            experience technology in their daily lives.
          </p>

          <p className="text-[14px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] leading-[33px] text-gray-700">
            We believe in empowering our workforce through training, innovation,
            and collaboration, so they can deliver the highest quality service and
            support. By nurturing a culture of learning, creativity, and
            accountability, we ensure that our people are equipped to adapt to
            rapid technological advancements and customer needs.
          </p>

          <p className="text-[14px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] leading-[33px] text-gray-700">
            At the heart of our growth strategy is a commitment to
            customer-centric innovation. Every product we create is developed with
            the customer in mind—focusing on durability, usability, and design.
            We regularly gather insights and feedback from our users to ensure
            that our accessories not only meet expectations but also exceed them.
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full hidden xl:block xl:w-1/2">
          <Image
            src="/images/commitment.png"
            alt="Commitment Image"
            width={600}
            height={600}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Commitment;
