import { useState } from 'react';
import '../../components/css/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    emailSubject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName) tempErrors.fullName = 'Name is required';
    if (!formData.emailAddress) {
      tempErrors.emailAddress = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      tempErrors.emailAddress = 'Email is invalid';
    }
    if (!formData.message) tempErrors.message = 'Message is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form data submitted:', formData);
      setSubmitted(true);
      // Reset form
      setFormData({ fullName: '', mobileNumber: '', emailAddress: '', emailSubject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title reveal">Contact <span>Me!</span></h2>
        
        <div className="contact-form-container reveal">
          {submitted ? (
            <div className="success-message">
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={errors.emailAddress ? 'error' : ''}
                  />
                  {errors.emailAddress && <span className="error-text">{errors.emailAddress}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="emailSubject"
                    value={formData.emailSubject}
                    onChange={handleChange}
                    placeholder="Email subject"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <textarea
                  name="message"
                  rows="10"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message..."
                  className={errors.message ? 'error' : ''}
                ></textarea>
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              <div className="form-submit">
                <button type="submit" className="primary-btn submit-btn">Send</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
