import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationDot,
  faPhone,
  faEnvelope,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons'
import UserHeader from '../components/Userheader'
import emailjs from '@emailjs/browser';
import  { useRef } from 'react';
import { toast } from 'react-toastify';


function Contact() {
    const form = useRef();
    const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(import.meta.env.VITE_SERVICE_ID, import.meta.env.VITE_TEMPLATE_ID, form.current, {
        publicKey: import.meta.env.VITE_PUBLIC_KEY,
      })
      .then(
        () => {
          console.log('SUCCESS!');
          toast.success('Message sent successfully!', {
            position: "top-center"
          });
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };
  return (
    <>
    <UserHeader/>
    <div className="min-h-screen bg-[#f5f2eb] px-6 py-12">

      {/* ================= HEADING ================= */}
      <div className="max-w-5xl mx-auto text-center">

        <h1 className="text-3xl md:text-4xl font-semibold text-[#111111]">
          Contacts
        </h1>

        <p className="mt-4 text-sm leading-6 text-gray-600 max-w-4xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Esse ratione, officia delectus consequuntur, dicta libero magni
          omnis architecto voluptas culpa praesentium ipsum assumenda quae
          dolor, nihil rerum fugit expedita corrupti. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Optio maiores fuga, modi vel
          accusantium magnam ex, ratione aliquam eius odit consequuntur earum,
          itaque nulla labore veritatis quis aut atque!
        </p>

      </div>


      {/* ================= CONTACT DETAILS ================= */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Address */}
        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-[#b18400] text-xl"
            />
          </div>

          <div>
            <p className="text-sm text-gray-800">
              123 Main Street, Apt 4B,
            </p>
            <p className="text-sm text-gray-800">
              Anytown, CA 91234
            </p>
          </div>

        </div>


        {/* Phone */}
        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <FontAwesomeIcon
              icon={faPhone}
              className="text-[#b18400] text-xl"
            />
          </div>

          <p className="text-sm text-gray-800">
            +91 9874561230
          </p>

        </div>


        {/* Email */}
        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-[#b18400] text-xl"
            />
          </div>

          <p className="text-sm text-gray-800">
            Bookstore@gmail.com
          </p>

        </div>

      </div>


      {/* ================= FORM + MAP ================= */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ================= MESSAGE FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">

          <h2 className="text-center text-lg font-semibold text-[#111111] mb-6">
            Send me Message
          </h2>

          <form className="space-y-3">

            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm outline-none focus:border-[#d4a017] focus:ring-1 focus:ring-[#d4a017]"
            />

            <input
              type="email"
              placeholder="Email ID"
              className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm outline-none focus:border-[#d4a017] focus:ring-1 focus:ring-[#d4a017]"
            />

            <textarea
            name="title"
              rows="5"
              placeholder="Message"
              className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm outline-none resize-none focus:border-[#d4a017] focus:ring-1 focus:ring-[#d4a017]"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#d4a017] hover:bg-[#b18400] text-[#111111] font-semibold py-3 rounded-md transition flex items-center justify-center gap-2"
            >
              Send
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>

          </form>

        </div>


        {/* ================= MAP ================= */}
        <div className="rounded-lg overflow-hidden shadow-sm min-h-[350px]">

          <iframe
            title="Bookstore Location"
            src="https://www.google.com/maps?q=Kochi,Kerala&output=embed"
            className="w-full h-full min-h-[350px] border-0"
            loading="lazy"
          ></iframe>

        </div>

      </div>

    </div>
    
    </>
  )
}


export default Contact;