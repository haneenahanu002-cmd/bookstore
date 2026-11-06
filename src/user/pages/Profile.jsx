
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Userheader';
import Edit from '../components/Edit';

import {
  addBookAPI,
  getMyBooksAPI,
  removeBookAPI,
  getAbstractAPI
} from '../../services/allApi';

import useDebounce from '../../hooks/useDebounce';

const DEFAULT_IMAGE =
  'https://static.vecteezy.com/system/resources/thumbnails/048/926/084/small/silver-membership-icon-default-avatar-profile-icon-social-media-user-image-illustration-vector.jpg';

const initialForm = {
  title: '',
  author: '',
  pages: '',
  imageUrl: '',
  price: '',
  discountPrice: '',
  abstract: '',
  publisher: '',
  isbn: '',
  language: '',
  category: '',
};

const getProfileImageUrl = (picture) => {
  if (!picture) return DEFAULT_IMAGE;

  if (
    picture.startsWith('http://') ||
    picture.startsWith('https://') ||
    picture.startsWith('data:')
  ) {
    return picture;
  }

  return `http://localhost:3000/uploads/${encodeURIComponent(picture)}`;
};

const getBookImageUrl = (book) => {
  if (book.imageUrl) return book.imageUrl;

  const firstImage = book.images?.[0];

  if (!firstImage) return '';

  if (typeof firstImage === 'string') {
    if (
      firstImage.startsWith('http://') ||
      firstImage.startsWith('https://') ||
      firstImage.startsWith('data:')
    ) {
      return firstImage;
    }

    return `http://localhost:3000/uploads/${encodeURIComponent(firstImage)}`;
  }

  if (firstImage.url) return firstImage.url;

  if (firstImage.filename) {
    return `http://localhost:3000/uploads/${encodeURIComponent(firstImage.filename)}`;
  }

  return '';
};

function Profile() {
  const [activeTab, setActiveTab] = useState('sell');

  const [profile, setProfile] = useState({
    name: 'User Name',
    bio: 'This is my profile. I love reading books and discovering new stories.',
    image: DEFAULT_IMAGE,
  });

  const [form, setForm] = useState(initialForm);
  const [selectedImages, setSelectedImages] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booksLoading, setBooksLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [booksError, setBooksError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Debounce book title
  const debouncedTitleSearch = useDebounce(form.title, 500);

  // Load logged-in user's profile
  useEffect(() => {
    const loadUserProfile = () => {
      const userData = sessionStorage.getItem('user');

      if (!userData) return;

      try {
        const user = JSON.parse(userData);

        const picture =
          user.profileImage ||
          user.picture ||
          user.photoURL ||
          '';

        setProfile({
          name: user.username || user.name || 'User Name',
          image: getProfileImageUrl(picture),
          bio:
            user.Bio ||
            user.bio ||
            'This is my profile. I love reading books and discovering new stories.',
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadUserProfile();

    window.addEventListener('loginStatusChanged', loadUserProfile);

    return () => {
      window.removeEventListener('loginStatusChanged', loadUserProfile);
    };
  }, []);

  // Generate book abstract using API
  useEffect(() => {
    if (!debouncedTitleSearch.trim()) return;

    let cancelled = false;

    const generateBookAbstract = async () => {
      try {
        console.log('Generating book abstract...');

        const res = await getAbstractAPI(debouncedTitleSearch);

        if (!cancelled && res.status === 200) {
          setForm((prev) => ({
            ...prev,
            abstract: res.data.content,
          }));
        }
      } catch (error) {
        console.error('Abstract generation error:', error);
      }
    };

    generateBookAbstract();

    return () => {
      cancelled = true;
    };
  }, [debouncedTitleSearch]);

  // Fetch all books added by the logged-in user
  const fetchMyBooks = useCallback(async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      setBooks([]);
      setBooksError('Please login to view your books.');
      return;
    }

    try {
      setBooksLoading(true);
      setBooksError('');

      const response = await getMyBooksAPI();
      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error('Invalid books response from server.');
      }

      setBooks(data);
    } catch (error) {
      console.error('Fetch my books error:', error);

      setBooksError(
        error.response?.data?.message ||
        error.message ||
        'Unable to load your books.'
      );
    } finally {
      setBooksLoading(false);
    }
  }, []);

  // Load books when Book Status tab opens
  useEffect(() => {
    if (activeTab === 'status') {
      fetchMyBooks();
    }
  }, [activeTab, fetchMyBooks]);

  // Delete book
  const handleDeleteBook = async (bookId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this book?'
    );

    if (!confirmed) return;

    try {
      setDeletingId(bookId);
      setBooksError('');

      const response = await removeBookAPI(bookId);

      if (response.status === 200) {
        setBooks((previousBooks) =>
          previousBooks.filter((book) => book._id !== bookId)
        );

        setMessage('Book deleted successfully!');
      }
    } catch (error) {
      console.error(
        'Delete book error:',
        error.response?.data || error
      );

      setBooksError(
        error.response?.data?.message ||
        'Failed to delete book. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Form input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image selection
  const handleImageChange = (e) => {
    setSelectedImages(
      Array.from(e.target.files || []).slice(0, 3)
    );
  };

  // Add book
  const handleAddBook = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = sessionStorage.getItem('token');

    if (!token) {
      setMessage('Please login before adding a book.');
      return;
    }

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.price ||
      !form.discountPrice ||
      !form.category ||
      !form.language
    ) {
      setMessage('Please fill in all required fields.');
      return;
    }

    if (
      Number(form.price) < 0 ||
      Number(form.discountPrice) < 0
    ) {
      setMessage('Prices cannot be negative.');
      return;
    }

    if (Number(form.discountPrice) > Number(form.price)) {
      setMessage('Discount price cannot exceed the original price.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      selectedImages.forEach((file) => {
        formData.append('uploadImage', file);
      });

      await addBookAPI(formData);

      setMessage('Book added successfully!');
      setForm(initialForm);
      setSelectedImages([]);

      const fileInput = document.getElementById('uploadImage');

      if (fileInput) fileInput.value = '';

      setActiveTab('status');
      await fetchMyBooks();

    } catch (error) {
      console.error('Add book error:', error);

      setMessage(
        error.response?.data?.message ||
        error.message ||
        'Failed to add book.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500';

  const labelClass =
    'mb-1 block text-sm font-medium text-gray-700';

  return (
    <>
      <Header />

      {/* Cover */}
      <div className="h-[200px] bg-blue-950" />

      {/* Profile */}
      <div className="min-h-[500px] bg-white px-5 sm:px-10">
        <div className="relative -mt-[70px]">
          <img
            className="h-[200px] w-[200px] rounded-full border-4 border-white object-cover"
            src={profile.image}
            alt="Profile"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {profile.name}
            </h3>

            <p className="mt-2 break-words text-gray-500">
              {profile.bio}
            </p>
          </div>

          <div>
            <Edit />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex justify-center overflow-x-auto border-b border-gray-200">
          {[
            ['sell', 'Sell Books'],
            ['status', 'Book Status'],
            ['history', 'Purchase History'],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-semibold sm:px-8 ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-5xl py-10">

          {/* SELL BOOKS */}
          {activeTab === 'sell' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-xl font-bold text-gray-800">
                Add Book Details
              </h2>

              {message && (
                <p
                  role="status"
                  className={`mb-5 rounded-lg p-3 ${
                    message.toLowerCase().includes('successfully')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {message}
                </p>
              )}

              <form onSubmit={handleAddBook}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* Left side */}
                  <div className="space-y-4">

                    <div>
                      <label className={labelClass}>Title *</label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter book title"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Author *</label>
                      <input
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter author name"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>No. of Pages</label>
                      <input
                        name="pages"
                        type="number"
                        min="1"
                        value={form.pages}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter number of pages"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Book Cover Image URL
                      </label>
                      <input
                        name="imageUrl"
                        type="url"
                        value={form.imageUrl}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Paste book cover image URL"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Price (₹) *</label>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter original price"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Discount Price (₹) *
                      </label>
                      <input
                        name="discountPrice"
                        type="number"
                        min="0"
                        value={form.discountPrice}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter discounted price"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Abstract</label>
                      <textarea
                        name="abstract"
                        rows="4"
                        value={form.abstract}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Write a short book summary"
                      />
                    </div>

                  </div>

                  {/* Right side */}
                  <div className="space-y-4">

                    <div>
                      <label className={labelClass}>Publisher</label>
                      <input
                        name="publisher"
                        value={form.publisher}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter publisher name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Language *</label>
                      <select
                        name="language"
                        value={form.language}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="">Select language</option>
                        <option value="English">English</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>ISBN</label>
                      <input
                        name="isbn"
                        value={form.isbn}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter ISBN number"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Category *</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Academic">Academic</option>
                        <option value="Biography">Biography</option>
                        <option value="Children">Children</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Self-Help">Self-Help</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Upload Book Cover (optional)
                      </label>
                      <input
                        id="uploadImage"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className={inputClass}
                      />

                      <p className="mt-1 text-xs text-gray-500">
                        Select up to 3 images.
                      </p>

                      {selectedImages.length > 0 && (
                        <p className="mt-2 text-sm text-gray-600">
                          {selectedImages.length} image(s) selected
                        </p>
                      )}
                    </div>

                    {form.imageUrl && (
                      <div>
                        <p className={labelClass}>Image Preview</p>
                        <img
                          src={form.imageUrl}
                          alt="Book cover preview"
                          className="h-48 w-36 rounded-lg border object-contain"
                        />
                      </div>
                    )}

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full rounded-lg bg-blue-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Adding Book...' : 'Add Book'}
                </button>

              </form>
            </div>
          )}

          {/* BOOK STATUS */}
          {activeTab === 'status' && (
            <div>

              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-800">
                  Book Status
                </h2>

                <button
                  type="button"
                  onClick={fetchMyBooks}
                  disabled={booksLoading}
                  className="rounded-lg bg-blue-950 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  {booksLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {message && (
                <p className="mb-5 rounded-lg bg-green-100 p-3 text-green-700">
                  {message}
                </p>
              )}

              {booksLoading ? (
                <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                  Loading your books...
                </div>
              ) : booksError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                  <p>{booksError}</p>

                  <button
                    type="button"
                    onClick={fetchMyBooks}
                    className="mt-4 rounded-lg bg-blue-950 px-4 py-2 text-white"
                  >
                    Try Again
                  </button>
                </div>
              ) : books.length === 0 ? (
                <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-500">

                  <p className="text-lg font-semibold">
                    There are no books.
                  </p>

                  <p className="mt-2 text-sm">
                    Add a book using the Sell Books tab.
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveTab('sell')}
                    className="mt-4 rounded-lg bg-blue-950 px-5 py-2 text-white hover:bg-blue-800"
                  >
                    Sell a Book
                  </button>

                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm text-gray-500">
                    Total books added: {books.length}
                  </p>

                  <div className="grid grid-cols-1 gap-6">

                    {books.map((book) => {
                      const imageUrl = getBookImageUrl(book);

                      return (
                        <div
                          key={book._id}
                          className="grid grid-cols-1 gap-6 rounded-xl border border-gray-200 bg-gray-50 p-5 md:grid-cols-2"
                        >

                          <div className="py-3">

                            <h3 className="mb-4 text-2xl font-bold text-gray-800">
                              {book.title}
                            </h3>

                            <p className="mb-3 text-lg text-gray-600">
                              Author: {book.author}
                            </p>

                            <p className="mb-3 font-bold text-blue-950">
                              Price: ₹
                              {book.discountPrice ?? book.price}

                              {book.price != null &&
                                book.discountPrice != null &&
                                Number(book.discountPrice) <
                                  Number(book.price) && (
                                  <span className="ml-2 text-sm font-normal text-gray-500 line-through">
                                    ₹{book.price}
                                  </span>
                                )}
                            </p>

                            <p className="mb-4 leading-7 text-gray-700">
                              {book.abstract || 'No description available.'}
                            </p>

                            <p className="mb-2 text-sm text-gray-600">
                              Category: {book.category || 'Not provided'}
                            </p>

                            <p className="mb-2 text-sm text-gray-600">
                              Language: {book.language || 'Not provided'}
                            </p>

                            <p className="mb-2 text-sm text-gray-600">
                              ISBN: {book.isbn || 'Not provided'}
                            </p>

                            <p className="mb-2 text-sm text-gray-600">
                              Publisher: {book.publisher || 'Not provided'}
                            </p>

                            <p className="mb-2 text-sm text-gray-600">
                              Pages: {book.pages || 'Not provided'}
                            </p>

                            <p className="mt-4">
                              <span
                                className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                                  String(book.status || 'Pending').toLowerCase() ===
                                  'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : String(book.status || 'Pending').toLowerCase() ===
                                      'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                Status: {book.status || 'Pending'}
                              </span>
                            </p>

                            <button
                              type="button"
                              onClick={() => handleDeleteBook(book._id)}
                              disabled={deletingId === book._id}
                              className="mt-5 w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === book._id
                                ? 'Deleting...'
                                : 'Delete Book'}
                            </button>

                          </div>

                          <div className="flex flex-col items-center justify-center gap-4">

                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={book.title || 'Book cover'}
                                className="h-64 w-48 rounded-lg bg-white object-contain shadow-md"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="flex h-64 w-48 items-center justify-center rounded-lg bg-white text-gray-400">
                                No book cover
                              </div>
                            )}

                            <p className="text-sm text-gray-500">
                              Your submitted book
                            </p>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                </>
              )}

            </div>
          )}

          {/* PURCHASE HISTORY */}
          {activeTab === 'history' && (
            <div className="rounded-xl border border-gray-200 p-8 text-center">

              <h2 className="mb-3 text-xl font-bold text-gray-800">
                Purchase History
              </h2>

              <p className="text-gray-500">
                Your purchased books will appear here when purchase
                history is connected to the backend.
              </p>

            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Profile;
