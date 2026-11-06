
import React, { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faUser
} from '@fortawesome/free-solid-svg-icons'

import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getHomeBookAPI } from '../../services/allApi'
import { searchContext } from '../../context/SearchContext'

function Home() {
  const [homeBooks, setHomeBooks] = useState([])
  const { searchKey, setSearchKey } = useContext(searchContext)
  const navigate = useNavigate()

  // Fetch books from backend
  useEffect(() => {
    getBooks()
  }, [])

  const getBooks = async () => {
    try {
      const res = await getHomeBookAPI()

      if (res.status === 200) {
        const books = Array.isArray(res.data)
          ? res.data
          : res.data.books || []

        setHomeBooks(books)
      }
    } catch (error) {
      console.error('Error fetching home books:', error)
    }
  }

  // Filter Home page books while typing
  const filteredBooks = homeBooks.filter((book) =>
    `${book.title || ''} ${book.author || ''}`
      .toLowerCase()
      .includes(searchKey.toLowerCase())
  )

  // Search button
  const handleSearch = () => {
    if (!searchKey.trim()) {
      toast.warning('Please enter a book title or author!')
      return
    }

    if (!sessionStorage.getItem('token')) {
      toast.warning('Please login first!')

      setTimeout(() => {
        navigate('/login')
      }, 1500)

      return
    }

    // Search value is shared through SearchContext
    navigate('/all-books')
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-[#182337] text-white flex items-center justify-center gap-8 py-3">
        <Link to="/" className="text-xs font-semibold">
          Home
        </Link>

        <Link to="/all-books" className="text-xs font-semibold">
          Books
        </Link>

        <Link to="/careers" className="text-xs font-semibold">
          Careers
        </Link>

        <Link to="/contact" className="text-xs font-semibold">
          Contact
        </Link>
      </nav>

      {/* HERO SECTION */}
      <div
        style={{
          height: '500px',
          backgroundImage: "url('/book.webp')"
        }}
        className="bg-cover bg-center flex items-center justify-center flex-col"
      >
        <div
          className="text-white w-full flex items-center justify-center flex-col"
          style={{
            height: '500px',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}
        >
          <h1
            className="text-6xl font-bold text-center"
            style={{ fontFamily: 'Dancing Script' }}
          >
            Wonderful Gifts
          </h1>

          <p className="mt-5">
            Give your family and friends a book
          </p>

          {/* SEARCH */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
            className="mt-9 flex items-center bg-white rounded-3xl p-2"
          >
            <input
              type="text"
              placeholder="Search book title or author..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="bg-white px-3 py-2 rounded-3xl text-black outline-none w-64"
            />

            <button
              type="submit"
              aria-label="Search books"
              className="bg-blue-900 text-white px-5 py-2 rounded-3xl hover:bg-blue-700"
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="mr-2"
              />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <section className="flex items-center justify-center flex-col my-10">
        <h1 className="text-3xl font-bold">
          NEW ARRIVALS
        </h1>

        <h2 className="text-xl mt-4 text-center">
          Explore Our Latest Collections
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 m-5 w-full px-5">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Link
                to={`/view-book/${book._id}`}
                key={book._id}
                className="block text-inherit no-underline"
              >
                <div className="p-3 h-full cursor-pointer">
                  <div className="shadow p-3 rounded text-center h-full hover:shadow-lg transition">
                    <img
                      style={{ height: '300px' }}
                      className="w-full object-contain"
                      src={
                        book.imageUrl ||
                        (book.uploadImage?.[0]
                          ? `http://localhost:3000/uploads/${book.uploadImage[0]}`
                          : 'https://placehold.co/200x300?text=Book')
                      }
                      alt={book.title || 'Book cover'}
                    />

                    <h4 className="text-blue-800 mt-3">
                      {book.author}
                    </h4>

                    <h3 className="font-bold mt-2">
                      {book.title}
                    </h3>

                    <h4 className="mt-2">
                      ₹{book.discountPrice || book.price}
                    </h4>

                    {book.discountPrice && (
                      <p className="text-gray-500 line-through">
                        ₹{book.price}
                      </p>
                    )}

                    {book.category && (
                      <p className="text-sm text-gray-500 mt-2">
                        {book.category}
                      </p>
                    )}

                    <p className="text-blue-800 text-sm font-semibold mt-3">
                      View Details →
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">
              {searchKey
                ? 'No matching books found.'
                : 'No books available.'}
            </p>
          )}
        </div>

        {/* EXPLORE MORE */}
        <div className="text-center my-10">
          <Link
            to="/all-books"
            className="bg-blue-900 p-3 text-white rounded inline-block"
          >
            Explore More
          </Link>
        </div>
      </section>

      {/* FEATURED AUTHORS */}
      <section className="py-8 px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-center text-sm font-bold">
              FEATURED AUTHORS
            </h1>

            <h2 className="text-center text-xs font-bold mb-8">
              Captivates with every word
            </h2>

            <p className="text-xs font-semibold leading-relaxed text-justify">
              Authors are the visionaries behind the books that fill
              the shelves. They contribute their own unique voice,
              creativity, and perspective to literature. Whether writing
              fiction, non-fiction, poetry, or educational works, authors
              bring stories, ideas, and knowledge to life.
            </p>

            <p className="text-xs font-semibold leading-relaxed text-justify mt-5">
              Their work spans a wide array of genres, from thrilling
              mysteries and heartwarming romances to thought-provoking
              memoirs and insightful self-help books. Their words entertain,
              inspire, and help readers explore new ideas and grow.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              className="w-full md:w-[90%] h-[280px] object-cover"
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
              alt="Authors"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-8 px-8 flex items-center justify-center flex-col">
        <h1 className="text-sm font-bold">
          TESTIMONIALS
        </h1>

        <h2 className="text-xs font-bold">
          See What Others Are Saying
        </h2>

        <div className="mt-3">
          <div className="w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
            <FontAwesomeIcon
              icon={faUser}
              className="text-white text-3xl"
            />
          </div>
        </div>

        <h4 className="text-xs font-bold mt-2">
          Teresa Joseph
        </h4>

        <p className="text-xs font-semibold text-center max-w-5xl mt-5 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Consequuntur impedit similique ea voluptas. Optio fuga magni,
          enim, molestiae nemo molestias deserunt reprehenderit reiciendis
          qui cupiditate, velit similique mollitia!
        </p>
      </section>

      {/* BOTTOM LINE */}
      <div className="border-b-4 border-gray-800 mt-5"></div>
    </>
  )
}

export default Home
