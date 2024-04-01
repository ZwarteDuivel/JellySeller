import React, { useRef, useEffect, useState } from 'react';
import SignaturePad from 'signature_pad';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Register = () => {
  const signatureRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signatureWidth, setSignatureWidth] = useState(0);
  const [showToast, setShowToast] = useState(false); // State to control toast visibility
  const [uid, setUid] = useState(null); // State to hold UID
  const [licenseAccepted, setLicenseAccepted] = useState(false); // State to hold license acceptance
  const navigate = useNavigate(); // useNavigate hook for navigation

  useEffect(() => {
    const signaturePad = new SignaturePad(signatureRef.current, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)',
    });

    // Adjust signature pad width based on card width
    const cardWidth = signatureRef.current.parentElement.offsetWidth;
    setSignatureWidth(cardWidth);
    signaturePad.penWidth = cardWidth / 15; // Adjust pen width based on card width

    return () => signaturePad.off(); // Cleanup signature pad
  }, []);

  const generateUID = () => {
    // Function to generate a random UID
    return Math.random().toString(36).substr(2, 10); // Generates a 10-character random string
  };

  const handleRegisterClick = async () => {
    if (!name || !email || !phone || !licenseAccepted) {
      alert('Please fill in all fields and accept the license terms');
      return;
    }

    // Get signature data
    const signatureData = signatureRef.current.toDataURL();
    console.log('Signature Data:', signatureData);

    // Generate random UID
    const newUid = generateUID();
    setUid(newUid);

    try {
      // Send user data, signature data, and UID to backend for registration
      const response = await fetch('https://jellybackend.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, signature: signatureData, uid: newUid, licenseAccepted }),
      });

      if (response.ok) {
        setShowToast(true); // Show toast message on successful registration

        // Hide toast message after 10 seconds
        setTimeout(() => {
          setShowToast(false);
          navigate('/login'); // Navigate to login page
        }, 10000);
        
        // Redirect to dashboard or login page
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl mb-4">Register</h1>
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone"
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="mb-4">
          {/* Signature field */}
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signature">Signature</label>
          <canvas id="signature" ref={signatureRef} width={signatureWidth} height="200" className="border border-gray-300 rounded-md"></canvas>
        </div>
        <div className="mb-4">
          {/* License terms checkbox */}
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <input
              type="checkbox"
              className="mr-2 leading-tight"
              checked={licenseAccepted}
              onChange={() => setLicenseAccepted(!licenseAccepted)}
            />
            <span className="text-sm">
              I agree to the license terms
            </span>
          </label>
        </div>
        <div className="flex justify-center">
          <button 
            className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none hover:bg-blue-600"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </div>
      {/* Toast message */}
      {showToast && (
        <div className="toast">
          <span role="img" aria-label="checkmark">✅</span> Registration successful! UID: {uid}
        </div>
      )}
    </div>
  );
}

export default Register;
