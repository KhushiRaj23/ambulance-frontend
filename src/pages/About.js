import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Truck,
  Building2,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      title: "Quick Ambulance Dispatch",
      description: "Emergency response within minutes, connecting you to the nearest available ambulance"
    },
    {
      icon: <Building2 className="w-8 h-8 text-green-600" />,
      title: "Hospital Network",
      description: "Extensive network of hospitals and medical facilities across the region"
    },
    {
      icon: <Clock className="w-8 h-8 text-yellow-600" />,
      title: "24/7 Availability",
      description: "Round-the-clock emergency medical services, always ready when you need us"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Professional Crew",
      description: "Licensed paramedics and trained medical professionals on every ambulance"
    },
    {
      icon: <MapPin className="w-8 h-8 text-red-600" />,
      title: "Real-time Tracking",
      description: "Live GPS tracking so you know exactly when help will arrive"
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      title: "Patient Care",
      description: "Comprehensive emergency care and safe transportation to medical facilities"
    }
  ];

  const stats = [
    { number: "1000+", label: "Lives Saved", icon: <Heart className="w-6 h-6 text-red-500" /> },
    { number: "50+", label: "Partner Hospitals", icon: <Building2 className="w-6 h-6 text-blue-500" /> },
    { number: "100+", label: "Ambulances", icon: <Truck className="w-6 h-6 text-green-500" /> },
    { number: "24/7", label: "Availability", icon: <Clock className="w-6 h-6 text-yellow-500" /> }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Medical Director",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
      description: "Leading our medical operations with 15+ years of emergency medicine experience"
    },
    {
      name: "Michael Chen",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      description: "Ensuring seamless coordination between hospitals, ambulances, and patients"
    },
    {
      name: "Priya Sharma",
      role: "Technology Lead",
      image: "https://static.vecteezy.com/system/resources/thumbnails/040/220/340/small_2x/ai-generated-emotional-portrait-of-happy-indian-woman-ai-generated-photo.jpeg",
      description: "Developing innovative solutions to improve emergency response times"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              About PulseRide
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Revolutionizing emergency medical response through innovative technology and compassionate care. 
              We're committed to saving lives by connecting patients with the fastest available ambulance services.
            </p>
          </div>
          
          {/* Project Status Banner */}
          <div className="bg-yellow-500 bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-yellow-400">
            <div className="flex items-center justify-center space-x-3">
              <Zap className="w-6 h-6 text-yellow-800" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-yellow-900">🚧 Project Under Development</h3>
                <p className="text-yellow-800 text-sm">
                  This is a demonstration project. Full functionality will be available soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              To provide immediate, reliable, and professional emergency medical transportation services, 
              ensuring that every patient receives timely care when it matters most. We believe that 
              every second counts in an emergency, and our technology-driven approach helps save precious time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Choose PulseRide?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Instant Response</h4>
                    <p className="text-gray-600">Our advanced system connects you to the nearest available ambulance in seconds</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Precision Technology</h4>
                    <p className="text-gray-600">GPS-enabled tracking and real-time updates ensure optimal routing and transparency</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Expert Team</h4>
                    <p className="text-gray-600">Licensed medical professionals and certified paramedics on every call</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8">
                <div className="w-full h-64 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-blue-600">
                    <Truck className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">Ambulance Image</p>
                    <p className="text-xs opacity-75">(Replace with actual image)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive emergency medical services designed to provide the fastest and most reliable care possible
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Impact</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Numbers that reflect our commitment to saving lives and serving communities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals committed to excellence in emergency medical services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or need assistance? We're here to help 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Emergency Hotline</h4>
                    <p className="text-gray-600">911 (Emergency Services)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Support Line</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">support@pulseride.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Headquarters</h4>
                    <p className="text-gray-600">123 Medical Center Dr, Healthcare City, HC 12345</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8">
                <div className="w-full h-64 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-blue-600">
                    <Building2 className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">Office/Contact Image</p>
                    <p className="text-xs opacity-75">(Replace with actual image)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">PulseRide</span>
            </div>
            <p className="text-gray-400 mb-6">
              Saving lives, one emergency at a time. Professional emergency medical services you can trust.
            </p>
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <span>© 2024 PulseRide. All rights reserved.</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
