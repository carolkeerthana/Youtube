import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa';

const FieldValidation = ({formData, fieldErrors, handleChange}) => {
  return (
    <>
    <input 
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleChange} 
        placeholder="Email"
        required
    /><br/>
    {fieldErrors.email && <p className="error"><FaExclamationCircle /> {fieldErrors.email}</p>}
    <input 
        type="text" 
        name="channel"
        value={formData.channel}
        onChange={handleChange}  
        placeholder="Channel Name"
        required
    /><br/>
    {fieldErrors.channel && <p className="error"><FaExclamationCircle /> {fieldErrors.channel}</p>}
    <input  
        type="password" 
        name="password"
        value={formData.password}
        onChange={handleChange}  
        placeholder="Password"
        required
    /><br/>
    {fieldErrors.password && <p className="error"><FaExclamationCircle /> {fieldErrors.password}</p>}
    <input 
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
    /><br/>
    {fieldErrors.confirmPassword && <p className="error"><FaExclamationCircle /> {fieldErrors.confirmPassword}</p>}
    </>
  )
}

export default FieldValidation
