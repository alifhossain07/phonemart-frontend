"use client";
import React from "react";

type CardProps = {
  icon: React.ReactNode;
  title: string;
  text: string | string[];
};

export default function Page() {
  return (
    <div className="w-11/12 mx-auto my-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af] mb-4">
          Contact PhoneMart
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Have a question or need assistance? We&apos;re here to help! Get in touch with our team.
        </p>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white flex justify-center rounded-xl p-5 md:p-6 lg:p-8 mb-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 w-full max-w-6xl">
          {/* FORM SIDE */}
          <div className="bg-gray-50 rounded-xl px-6 py-10 w-full flex flex-col">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1e40af] mb-3">
              Get in touch
            </h2>

            <p className="text-base text-gray-700 leading-relaxed mb-6">
              Fill out the form below to contact our team. We&apos;ll get back to you as soon as possible.
            </p>

            <div className="flex flex-col gap-4 flex-grow">
              {/* NAME */}
              <div>
                <label className="text-lg text-gray-700 font-medium">Name *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md mt-1 p-3 focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  placeholder="Your name"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-lg text-gray-700 font-medium">Phone Number *</label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-md mt-1 p-3 focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  placeholder="Your phone number"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-lg text-gray-700 font-medium">Your E-mail *</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md mt-1 p-3 focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* MESSAGE */}
              <div className="flex-grow flex flex-col">
                <label className="text-lg text-gray-700 font-medium">
                  Your Message *
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md mt-1 p-3 focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-none h-40 md:h-full"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
            </div>

            {/* SEND BUTTON */}
            <div className="mt-4 flex justify-end">
              <button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-8 py-3 rounded-md text-sm md:text-base font-medium transition">
                Send Message
              </button>
            </div>
          </div>

          {/* MAP SIDE */}
          <div className="rounded-xl overflow-hidden w-full h-[400px] md:h-[600px] xl:h-[800px]">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.419972449816!2d90.35562917615226!3d23.768054778658282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7bc71a75901%3A0xbc0de6971840e8ab!2sSannai%20Technology%20Limited!5e0!3m2!1sen!2sbd!4v1763270186535!5m2!1sen!2sbd"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Contact Cards Section */}
      <div className="w-full flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* CARD 1 - Office Address */}
          <Card
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            title="Office Address"
            text="Level 4, Techdyno BD LTD, Haq's Plaza, 4th Floor, 26 Kemal Ataturk Ave, Dhaka 1213"
          />

          {/* CARD 2 - Support Number */}
          <Card
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
            title="Support Number"
            text={["+88001925739100", "+88001925739100"]}
          />

          {/* CARD 3 - Support Email */}
          <Card
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="Support E-mail"
            text="info@phonemart.com"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================
   REUSABLE CARD COMPONENT
============================ */
function Card({ icon, title, text }: CardProps) {
  const lines = Array.isArray(text) ? text : text.split("\n");
  return (
    <div className="bg-white shadow-xl rounded-2xl flex flex-col items-center justify-center text-center w-full max-w-[445px] h-auto md:h-[300px] px-6 py-10 mx-auto">
      <div className="w-16 h-16 rounded-full bg-[#1e40af] flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="text-lg md:text-2xl font-semibold text-[#1e40af] mb-3">
        {title}
      </h3>

      <div className="text-sm md:text-base text-gray-700 leading-relaxed space-y-1">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
