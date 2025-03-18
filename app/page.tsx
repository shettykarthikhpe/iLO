"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FiWifi, FiUser, FiLock, FiX, FiArrowRight, 
  FiShield, FiHelpCircle, FiAlertCircle, FiCheckCircle 
} from "react-icons/fi"
import ilo from "../public/ilo.png"
import axios from "axios"

export default function Home() {
  const [ip, setIp] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [ipError, setIpError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  const validateIP = (ip: string) => {
    const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ipPattern.test(ip)
  }

  const handleProceed = () => {
    if (!ip) {
      setIpError("IP address is required")
      return
    }
    
    if (!validateIP(ip)) {
      setIpError("Please enter a valid IP address")
      return
    }
    
    setIpError("")
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      setModalOpen(true)
    }, 800)
  }

  const handleSubmit = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      setFormSubmitted(true)
      
      setTimeout(() => {
        setModalOpen(false)
      }, 1500)
    }, 1000)
  }


  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleEsc)
    
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const handleLogin = async() =>{
    try{
      const response = await axios.get(`https://${ip}`,{
        
      });
    }catch(err){
      console.log("Errror occured while login", err);
    }
  }


  if (pageLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 z-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-transparent border-t-blue-300 rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">iLO Secure Portal</h2>
          <p className="text-blue-200">Initializing secure connection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='dark'>
      <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 flex items-center justify-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-900 dark:to-indigo-950 opacity-90"></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10 max-w-md text-center px-8 py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              className="mb-8"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-700"></div>
                <Image
                  src={ilo || "/placeholder.svg?height=500&width=500"}
                  alt="Secure Network Access"
                  width={500}
                  height={500}
                  className="relative z-10 transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">Secure iLO Portal</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Access your iLO with enterprise-grade security and real-time monitoring capabilities.
              </p>
              
              <div className="pt-6">
                <div className="flex items-center justify-center space-x-8">
                  <motion.div 
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-lg shadow-blue-500/20">
                      <FiShield className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm text-white">Encrypted</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-lg shadow-blue-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-sm text-white">Secure</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-lg shadow-blue-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-white">Fast</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center md:text-left"
            >
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">Welcome Back</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Enter your IP address to proceed with secure access</p>
            </motion.div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="ip-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IP Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiWifi className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="ip-address"
                    type="text"
                    value={ip}
                    onChange={(e) => {
                      setIp(e.target.value);
                      if (ipError) setIpError("");
                    }}
                    placeholder="192.168.1.1"
                    className={`pl-10 w-full px-4 py-3 rounded-lg border ${ipError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm`}
                  />
                </div>
                <AnimatePresence>
                  {ipError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400"
                    >
                      <FiAlertCircle className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      {ipError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceed}
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Proceed <FiArrowRight className="ml-2" />
                  </div>
                )}
              </motion.button>
            </div>
            
            <div className="mt-16 text-center">
              <div className="flex items-center justify-center">
                <FiHelpCircle className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Need help? <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">Contact support</a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {modalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex min-h-screen items-center justify-center p-4 text-center">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity"
                  onClick={() => !isLoading && !formSubmitted && setModalOpen(false)}
                ></motion.div>

                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-left shadow-xl transition-all w-full max-w-md"
                >
                  {!formSubmitted ? (
                    <>
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => !isLoading && setModalOpen(false)}
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                          disabled={isLoading}
                        >
                          <FiX className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="text-center mb-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            <FiUser className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </motion.div>
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">Authentication Required</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Please enter your credentials to continue</p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                              id="username"
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Enter your username"
                              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
                              >
                                {showPassword ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center">
                            <input
                              id="remember-me"
                              name="remember-me"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Remember me
                            </label>
                          </div>
                          <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            Forgot password?
                          </a>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => !isLoading && setModalOpen(false)}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                          disabled={isLoading}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200 font-medium flex items-center"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Authenticating...
                            </>
                          ) : (
                            <>Login</>
                          )}
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 mb-4"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 0, 0]
                          }}
                          transition={{ 
                            duration: 0.5,
                            times: [0, 0.2, 0.5],
                            repeat: 0
                          }}
                        >
                          <FiCheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </motion.div>
                      </motion.div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Login Successful</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">You will be redirected shortly...</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                        <motion.div 
                          className="bg-green-600 dark:bg-green-500 h-1.5 rounded-full" 
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
