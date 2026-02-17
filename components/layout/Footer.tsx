"use client";

import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface FooterData {
  footer_logo?: string;
  about_us_description?: string;
  frontend_copyright_text?: string;
  app_store_link?: string | null;
  play_store_link?: string | null;
  show_social_links?: string;
  facebook_link?: string;
  twitter_link?: string;
  instagram_link?: string;
  youtube_link?: string;
  widget_one?: string;
  widget_one_labels?: string;
  widget_one_links?: string;
  widget_two?: string;
  widget_two_labels?: string;
  widget_two_links?: string;
  helpline_number?: string;
  contact_address?: string;
  payment_method_images?: string;
  contact_email?: string;
}

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/api/business-settings');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Data is already an object format from the API route
          const settings = result.data;
          
          // Map backend settings to footer data format
          const mappedData: FooterData = {
            footer_logo: settings.footer_logo || undefined,
            about_us_description: settings.about_us_description || '',
            frontend_copyright_text: settings.frontend_copyright_text || '© 2024 Like Telecom. All rights reserved.',
            contact_email: settings.contact_email || undefined,
            contact_address: settings.contact_address || '',
            helpline_number: settings.contact_phone || undefined, // Map contact_phone to helpline_number
            facebook_link: settings.facebook_link || undefined,
            twitter_link: settings.twitter_link || undefined,
            instagram_link: settings.instagram_link || undefined,
            youtube_link: settings.youtube_link || undefined,
            show_social_links: settings.facebook_link || settings.twitter_link || settings.instagram_link || settings.youtube_link ? 'on' : 'off',
            // Widgets can be added later if needed
            widget_one: undefined,
            widget_one_labels: undefined,
            widget_one_links: undefined,
            widget_two: undefined,
            widget_two_labels: undefined,
            widget_two_links: undefined,
            payment_method_images: undefined,
            app_store_link: undefined,
            play_store_link: undefined,
          };
          
          setFooterData(mappedData);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);



  if (loading) {
    return (
      <footer className="bg-black text-white pt-20 pb-6">
        <div className="w-10/12 mx-auto text-center py-10">
          <p className="text-gray-400">Loading...</p>
        </div>
      </footer>
    );
  }

  // Default data if API call fails or returns no data
  const defaultFooterData: FooterData = {
    footer_logo: undefined,
    about_us_description: '',
    frontend_copyright_text: '© 2024 Like Telecom. All rights reserved.',
    contact_email: undefined,
    contact_address: '',
    helpline_number: undefined,
    facebook_link: undefined,
    twitter_link: undefined,
    instagram_link: undefined,
    youtube_link: undefined,
    show_social_links: 'off',
    widget_one: undefined,
    widget_one_labels: undefined,
    widget_one_links: undefined,
    widget_two: undefined,
    widget_two_labels: undefined,
    widget_two_links: undefined,
    payment_method_images: undefined,
    app_store_link: undefined,
    play_store_link: undefined,
  };

  const data = footerData || defaultFooterData;
  const showSocialLinks = data?.show_social_links === "on" || 
    (data?.facebook_link || data?.twitter_link || data?.instagram_link || data?.youtube_link);

  return (
    <footer className="bg-gray-200 text-black pt-20 pb-6">
      {/* Outer Wrapper */}
      <div className="w-10/12 mx-auto border-b border-gray-700 pb-10">
        <div className="grid grid-cols-1 text-black md:grid-cols-12 gap-10">
          {/* LEFT SECTION (4/12) */}
          <div className="md:col-span-4">
            {/* Logo */}
            {data?.footer_logo && (
              <div className="mb-4">
                <Image
                  src={data.footer_logo}
                  alt="Footer Logo"
                  width={150}
                  height={50}
                  className="object-fill w-32 h-24"
                />
              </div>
            )}

            {/* About Description */}
            {data?.about_us_description && (
              <p
                className="text-black text-sm leading-relaxed mb-4"
                dangerouslySetInnerHTML={{
                  __html: data.about_us_description,
                }}
              />
            )}

            {/* Social Icons */}
            {showSocialLinks && (
              <div className="flex items-center gap-3 mb-4">
                {data?.facebook_link && (
                  <a
                    href={data.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaFacebookF className="text-white text-sm" />
                  </a>
                )}
                {data?.instagram_link && (
                  <a
                    href={data.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaInstagram className="text-white text-sm" />
                  </a>
                )}
                {data?.youtube_link && (
                  <a
                    href={data.youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaYoutube className="text-white text-sm" />
                  </a>
                )}
                {data?.twitter_link && (
                  <a
                    href={data.twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <FaTwitter className="text-white text-sm" />
                  </a>
                )}
              </div>
            )}

            {/* Payment Method Image - Can be added later if needed */}
            {data?.payment_method_images && (
              <div className="flex flex-row items-center gap-2">
                <p className="text-sm font-medium mb-2">Pay With</p>
                <div className="relative h-12 w-48">
                  <Image
                    src={data.payment_method_images}
                    alt="Payment Methods"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SECTION (8/12) */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* About Us - Static */}
            <div>
              <h3 className="text-md font-semibold mb-3">About Us</h3>
              <ul className="space-y-2 text-black text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="hover:text-white transition">
                    Career
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links - Static */}
            <div>
              <h3 className="text-md font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-black text-sm">
                <li>
                  <Link href="/flash-deals" className="hover:text-white transition">
                    Flash Deals
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="hover:text-white transition">
                    Offers
                  </Link>
                </li>
                <li>
                  <Link href="/newarrival" className="hover:text-white transition">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-white transition">
                    Compare Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service - Static */}
            <div>
              <h3 className="text-md font-semibold mb-3">Customer Service</h3>
              <ul className="space-y-2 text-black text-sm">
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/registration" className="hover:text-white transition">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-md font-semibold mb-3">Contact Us</h3>
              <ul className="space-y-2 text-black text-sm mb-4">
                {data?.helpline_number && (
                  <li>
                    <a
                      href={`tel:${data.helpline_number}`}
                      className="hover:text-white transition"
                    >
                      {data.helpline_number}
                    </a>
                  </li>
                )}
                {data?.contact_email && (
                  <li>
                    <a
                      href={`mailto:${data.contact_email}`}
                      className="hover:text-white transition"
                    >
                      {data.contact_email}
                    </a>
                  </li>
                )}
                {data?.contact_address && (
                  <li className="text-xs leading-relaxed">
                    {data.contact_address}
                  </li>
                )}
              </ul>

              {/* Store Locator with Google Map */}
              <div className="rounded-md overflow-hidden w-full h-[150px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902087158993!2d90.42027327536774!3d23.750857288811812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b89832a89a67%3A0x9b4a955a8ed6f9b4!2sJamuna%20Future%20Park!5e0!3m2!1sen!2sbd!4v1699786046284!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div
        className="text-center text-gray-500 text-sm mt-6"
        dangerouslySetInnerHTML={{
          __html: data?.frontend_copyright_text || '© 2024 Like Telecom. All rights reserved.',
        }}
      />
    </footer>
  );
};

export default Footer;