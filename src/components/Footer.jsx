
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {
  faInstagram,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'
function Footer() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 bg-gray-900 text-white p-10">
        <div>
          <h4 className='font-bold'>ABOUT US</h4>

          <p className='mt-4 text-justify'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptates adipisci vitae autem rem ducimus quo reiciendis.
            Ea excepturi exercitationem a sapiente molestiae, dolores in
            esse, totam fugit maxime animi repudiandae facere.
          </p>
        </div>

        <div>
          <h4 className='font-bold'>NEWSLETTER</h4>

          <p className='mt-4'>
            Stay updated with our latest trends
          </p>

          <div className='mt-4'>
            <input
              className='p-2 bg-white placeholder-gray-500'
              type='text'
              placeholder='email id'
            />

            <button className='bg-yellow-400 p-2'>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        <div>
          <h4 className='font-bold'>FOLLOW US</h4>

          <p className='mt-4'>
            Let us be social
          </p>

          <div className='mt-5'>
<a href="#" className="hover:text-pink-500">
      <FontAwesomeIcon icon={faInstagram} />
    </a>

    <a href="#" className="hover:text-blue-400">
      <FontAwesomeIcon icon={faTwitter} />
    </a>          </div>
        </div>

      </div>

      <div className='bg-black text-white text-center p-5'>
        <p>
          Copyright ©2026 All rights reserved | This website is made with
          &#10084; by Anna Steef
        </p>
      </div>
    </>
  )
}

export default Footer