import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { userUpadateAPI } from '../../services/allApi';

function Edit() {
  const [editStatus, setEditStatus] = useState(false);

  const [userDetails, setUserDetails] = useState({_id:"",
    username: '',
    password: '',
    cPassword: '',
    picture: '',
    bio: '',
  });

  const [existingPicture, setExistingPicture] = useState('');
  const [imageFile, setImageFile] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [preview, setPreview] = useState('');
  const [selectedPicture, setSelectedPicture] = useState(null);

  // Load existing user details
  const loadUserDetails = () => {
    const userData = sessionStorage.getItem('user');

    if (!userData) {
      alert('Please login first.');
      return false;
    }

    try {
      const user = JSON.parse(userData);

      const picture =
        user.profileImage ||
        user.picture ||
        user.photoURL ||
        '';

      setUserDetails({...userDetails,_id:user._id,
        username: user.username || user.name || '',
        password: '',
        cPassword: '',
        picture,
        bio: user.Bio || user.bio || '',
      });

      setExistingPicture(picture);
      setSelectedPicture(null);
      setPreview('');
      setImageFile(true);
      setPasswordMatch(true);

      return true;
    } catch (error) {
      console.error('Error loading user details:', error);
      alert('Unable to load profile.');
      return false;
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Open edit modal
  const openEditModal = () => {
    if (loadUserDetails()) {
      setEditStatus(true);
    }
  };

  // Handle profile picture selection
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSelectedPicture(null);
      setImageFile(false);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5 MB.');
      e.target.value = '';
      return;
    }

    setImageFile(true);
    setSelectedPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle password change
  const handlePasswordChange = (value) => {
    setUserDetails((prev) => ({
      ...prev,
      password: value,
      cPassword: '',
    }));

    setPasswordMatch(true);
  };

  // Handle confirm password
  const checkPasswordMatch = (value) => {
    setUserDetails((prev) => ({
      ...prev,
      cPassword: value,
    }));

    setPasswordMatch(userDetails.password === value);
  };

  // Get profile image URL
  const getPictureUrl = () => {
    if (preview) return preview;

    if (!existingPicture) {
      return 'https://static.vecteezy.com/system/resources/thumbnails/048/926/084/small/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector.jpg';
    }

    if (
      existingPicture.startsWith('http://') ||
      existingPicture.startsWith('https://') ||
      existingPicture.startsWith('data:')
    ) {
      return existingPicture;
    }

    return `http://localhost:3000/uploads/${encodeURIComponent(
      existingPicture
    )}`;
  };

  // Reset form
  const resetProfileForm = () => {
    loadUserDetails();
  };

  // Save profile changes
  
const updateProfile = async (e) => {
  e.preventDefault();

  const { username, password, cPassword, bio } = userDetails;

  // Validate required fields
  if (!username.trim() || !bio.trim()) {
    toast.warning('Please fill in username and bio.');
    return;
  }

  // Password is optional
  if (password && password !== cPassword) {
    setPasswordMatch(false);
    toast.warning('Password and confirm password do not match.');
    return;
  }

  const storedUser = sessionStorage.getItem('user');

  if (!storedUser) {
    toast.warning('Please login first.');
    return;
  }

  try {
    const user = JSON.parse(storedUser);
    const userId = user._id || userDetails._id;

    if (!userId) {
      toast.error('User ID not found. Please login again.');
      return;
    }

    // Create FormData for the backend
    const reqbody = new FormData();

    reqbody.append('username', username.trim());
    reqbody.append('bio', bio.trim());

    // Send password only if the user entered one
    if (password.trim() !== '') {
      reqbody.append('password', password);
    }

    // Send actual image file only if selected
    if (selectedPicture) {
      reqbody.append('picture', selectedPicture);
    }

    // Call backend API
    const result = await userUpadateAPI(userId, reqbody);

    const updatedUser = result?.data?.user || result?.user;

    if (!updatedUser) {
      throw new Error('Server did not return updated user details.');
    }

    // Update saved user data using the server response
    const savedUser = {
      ...user,
      ...updatedUser,
      Bio: updatedUser.bio ?? updatedUser.Bio ?? bio,
      bio: updatedUser.bio ?? updatedUser.Bio ?? bio,
    };

    sessionStorage.setItem('user', JSON.stringify(savedUser));

    // Refresh components listening for this event
    window.dispatchEvent(new Event('loginStatusChanged'));

    setExistingPicture(
      savedUser.profileImage ||
      savedUser.picture ||
      savedUser.photoURL ||
      ''
    );

    setSelectedPicture(null);
    setPreview('');
    setEditStatus(false);

    toast.success('Profile updated successfully!');
  } catch (error) {
    console.error(
      'Profile update error:',
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.message ||
      error.message ||
      'Failed to update profile.'
    );
  }
};



  return (
    <>
      {/* EDIT BUTTON */}
      <button
        type="button"
        onClick={openEditModal}
        className="bg-blue-600 hover:bg-blue-700 text-white !px-6 !py-2 rounded-md"
      >
        Edit
      </button>

      {/* EDIT PROFILE MODAL */}
      {editStatus && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 !p-4"
          onClick={() => setEditStatus(false)}
        >
          <div
            className="bg-white w-full max-w-xl rounded-sm shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* BLACK HEADER */}
            <div className="bg-black text-white flex justify-between items-center !px-3 !py-3">
              <h2 className="text-sm">Edit User Details</h2>

              <button
                type="button"
                onClick={() => setEditStatus(false)}
                className="text-white text-xl"
              >
                ×
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={updateProfile}>
              <div className="max-h-[75vh] overflow-y-auto !p-4">
                <div className="bg-blue-200 !p-4 sm:p-6 rounded-sm">

                  {/* PROFILE PICTURE */}
                  <div className="rounded bg-blue-200 !p-5 flex justify-center items-center flex-col">
                    <input
                      type="file"
                      className="hidden"
                      id="userPic"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />

                    <label
                      htmlFor="userPic"
                      className="cursor-pointer relative"
                    >
                      <img
                        src={getPictureUrl()}
                        alt="Profile"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />

                      <span className="absolute bottom-0 right-0 bg-yellow-400 text-white rounded !p-1">
                        <FontAwesomeIcon icon={faPen} />
                      </span>
                    </label>

                    <p className="text-xs text-gray-600 !mt-2">
                      Choose an image (maximum 5 MB)
                    </p>

                    {!imageFile && (
                      <div className="!mt-3 text-red-500 text-sm">
                        *Only image files are allowed.
                      </div>
                    )}
                  </div>

                  {/* USERNAME */}
                  <input
                    type="text"
                    placeholder="User Name"
                    value={userDetails.username}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    required
                    className="w-full !mb-2 rounded !px-2 !py-2 text-sm outline-none bg-white"
                  />

                  {/* PASSWORD */}
                  <input
                    type="password"
                    placeholder="New Password (optional)"
                    autoComplete="new-password"
                    value={userDetails.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full !mb-2 rounded !px-2 !py-2 text-sm outline-none bg-white"
                  />

                  {/* CONFIRM PASSWORD */}
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    autoComplete="new-password"
                    value={userDetails.cPassword}
                    onChange={(e) => checkPasswordMatch(e.target.value)}
                    className="w-full !mb-2 rounded !px-2 !py-2 text-sm outline-none bg-white"
                  />

                  {userDetails.cPassword !== '' && !passwordMatch && (
                    <p className="text-red-500 text-sm !mb-2">
                      *Password and confirm password do not match.
                    </p>
                  )}

                  {/* BIO */}
                  <input
                    type="text"
                    placeholder="Bio"
                    value={userDetails.bio}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    className="w-full !mb-2 rounded !px-2 !py-2 text-sm outline-none bg-white"
                  />

                  {/* BUTTONS */}
                  <div className="flex justify-end gap-2 !mt-3">
                    <button
                      type="button"
                      onClick={resetProfileForm}
                      className="border border-gray-500 bg-yellow-500 !px-4 !py-2 rounded text-sm"
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      disabled={!imageFile}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white !px-4 !py-2 rounded text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Edit;