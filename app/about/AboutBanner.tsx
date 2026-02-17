import Image from 'next/image'
import React from 'react'

const AboutBanner = () => {
  return (
    <div>
      {/* =========================
          TOP OFFICE IMAGE
      ========================== */}
      <div className="w-full rounded-xl overflow-hidden mb-10">
        <Image
          src="/images/sannaioffice.webp" // <-- replace with your image
          alt="Office"
          width={2000}
          height={900}
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>

      {/* =========================
          TITLE + PARAGRAPH
      ========================== */}
      <div className=" mx-auto mb-12 w-11/12">
        <h2 className="xl:text-[28px] text-[20px] font-semibold text-black mb-2">
          Welcome to Sannai
        </h2>

        <p className="2xl:text-[28px] xl:text-[22px] text-[18px] text-justify leading-[32px] md:leading-[42px] text-gray-700">
          Founded in September 2023, Sannai Technology Limited is a rapidly
          emerging leader in Bangladeshs mobile accessories industry.
          Headquartered in Bangladesh, the company has quickly established
          itself as a trusted brand, renowned for its high-quality mobile
          accessories, including chargers, cables, earphones, power banks,
          neckbands, and TWS (True Wireless Stereo) devices.
        </p>
      </div>

      {/* =========================
          3 FEATURE CARDS
      ========================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* CARD 1 */}
        <div className="border rounded-xl p-8 bg-white">
          <p className="text-gray-400 text-[14px] mb-24">(01)</p>

          <h3 className="min-h-[60px] 2xl:text-[22px] text-[18px] md:text-[20px] font-semibold text-orange-500 mb-2">
            Stronger Presence, Wider Reach
          </h3>

          <p className="2xl:text-[20px] text-[16px] md:text-[18px] leading-[32px] text-orange-500">
            From bustling cities to remote towns, our products are available
            every-where across Bangladesh—making quality accessible to everyone,
            everywhere.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="border rounded-xl p-8 bg-white">
          <p className="text-gray-400 text-[14px] mb-24">(02)</p>

          <h3 className=" min-h-[60px] 2xl:text-[22px] text-[18px] md:text-[20px] font-semibold text-orange-500 mb-2">
            Trusted by Thousands, Growing Every Day
          </h3>

          <p className="2xl:text-[20px] text-[16px] md:text-[18px] leading-[32px] text-orange-500">
            We take pride in serving a rapidly expanding customer community.
            Their trust fuels our passion to deliver excellence in both product
            quality & service.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="border rounded-md p-8 bg-white">
          <p className="text-gray-400 text-[14px] mb-24">(03)</p>

          <h3 className="min-h-[60px] 2xl:text-[22px] text-[18px] md:text-[20px] font-semibold text-orange-500 mb-2">
            Fast, Reliable & Everywhere You Need Us
          </h3>

          <p className="2xl:text-[20px] text-[16px] md:text-[18px] leading-[32px] text-orange-500">
            With an extensive network of distributors and partners, we ensure
            fast delivery, constant product availability, and a seamless
            experience nationwide.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutBanner
