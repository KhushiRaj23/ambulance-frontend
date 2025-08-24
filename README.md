# 🚑 PulseRide - Emergency Ambulance Services

A comprehensive web application for emergency ambulance booking and management, built with React and Spring Boot.

![PulseRide Logo](https://img.shields.io/badge/PulseRide-Emergency%20Services-red?style=for-the-badge&logo=ambulance)
![React](https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0+-green?style=for-the-badge&logo=spring)
![Status](https://img.shields.io/badge/Status-Under%20Development-yellow?style=for-the-badge)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Project Snapshots](#-project-snapshots)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Changelog](#-changelog)
- [Known Issues](#-known-issues)
- [Support](#-support)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Future Roadmap](#-future-roadmap)


## 🎯 Overview

PulseRide is a modern, responsive web application designed to revolutionize emergency medical response by connecting patients with the fastest available ambulance services. The system provides real-time ambulance tracking, hospital management, and comprehensive booking lifecycle management.

### 🎯 **Project Goals**
- **Immediate Response**: Connect patients to ambulances within minutes
- **Real-time Tracking**: GPS-enabled ambulance location tracking
- **Hospital Network**: Extensive network of medical facilities
- **Professional Service**: Licensed paramedics and medical professionals
- **24/7 Availability**: Round-the-clock emergency medical services

## ✨ Features

### 🚨 **Core Functionality**
- **Emergency Ambulance Booking**: Quick and reliable ambulance dispatch
- **Hospital Management**: Comprehensive hospital and facility management
- **Real-time Tracking**: Live GPS tracking with ETA updates
- **User Authentication**: Secure login and registration system
- **Booking Management**: Complete booking lifecycle tracking
- **Admin Dashboard**: Comprehensive administrative controls

### 👥 **User Roles & Permissions**
- **Patients**: Book ambulances, view booking history
- **Hospital Staff**: Manage hospital information and ambulances
- **Administrators**: Full system control and oversight
- **Emergency Responders**: Real-time dispatch and status updates

### 📱 **User Experience Features**
- **Responsive Design**: Works seamlessly on all devices
- **Intuitive Interface**: Clean, medical industry-focused design
- **Real-time Updates**: Live status updates and notifications
- **Emergency Hotline**: Direct access to emergency services
- **Multi-language Support**: Accessibility for diverse communities

## 🛠️ Technology Stack

### **Frontend**
- **React 18**: Modern JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Client-side routing for single-page applications
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API communication

### **Backend**
- **Spring Boot 3**: Java-based framework for building web applications
- **Spring Security**: Authentication and authorization framework
- **Spring Data JPA**: Data access layer with JPA/Hibernate
- **JWT**: JSON Web Tokens for secure authentication
- **CORS**: Cross-Origin Resource Sharing configuration

### **Database**
- **PostgreSQL**: Robust, open-source relational database
- **Neon**: Serverless PostgreSQL for cloud deployment

### **Deployment**
- **Frontend**: Vercel/Netlify (React build)
- **Backend**: Render.com (Spring Boot application)
- **Database**: Neon (PostgreSQL cloud service)

## 📁 Project Structure

```
ambulance-frontend-main/
├── public/                 # Static assets
│   ├── index.html         # Main HTML file
│   ├── favicon.ico        # Application icon
│   └── manifest.json      # PWA manifest
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   ├── Loader.js      # Loading spinner component
│   │   ├── Navbar.js      # Navigation bar component
│   │   ├── Notification.js # Alert/notification component
│   │   └── ProtectedRoute.js # Route protection component
│   ├── context/           # React context providers
│   │   └── AuthContext.js # Authentication context
│   ├── pages/             # Application pages
│   │   ├── Home.js        # Landing page
│   │   ├── About.js       # About page
│   │   ├── Login.js       # User authentication
│   │   ├── Register.js    # User registration
│   │   ├── Profile.js     # User profile management
│   │   ├── HospitalSearch.js # Hospital search and selection
│   │   ├── HospitalAmbulances.js # Hospital ambulance view
│   │   ├── AmbulanceBooking.js # Ambulance booking form
│   │   ├── BookingHistory.js # User booking history
│   │   ├── AdminDashboard.js # Administrative dashboard
│   │   ├── ManageHospitals.js # Hospital management
│   │   ├── ManageAmbulances.js # Ambulance management
│   │   └── AdminBookings.js # Booking administration
│   ├── api.js             # API service functions
│   ├── App.js             # Main application component
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Node.js dependencies
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # Project documentation
```
## 📷 Project Snapshots
<img width="1903" height="2785" alt="image" src="https://github.com/user-attachments/assets/4bb88141-88f0-4845-ae3b-951bf4112a24" />


## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser
- Git for version control

### **Frontend Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ambulance-frontend-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```bash
   REACT_APP_PULSERIDE_APP_API_URL=https://your-backend-url.com
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

### **Backend Setup**

1. **Clone the backend repository**
   ```bash
   git clone <backend-repository-url>
   cd ambulance-backend
   ```

2. **Configure database**
   - Set up PostgreSQL database
   - Update `application.properties` with database credentials

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   # or
   mvn spring-boot:run
   ```

## 📚 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### **Ambulance Endpoints**
- `GET /api/ambulances/available` - Get available ambulances
- `GET /api/ambulances/hospital/{id}` - Get all ambulances for a hospital
- `GET /api/ambulances/counts` - Get ambulance statistics
- `PATCH /api/admin/ambulance/status` - Update ambulance status

### **Hospital Endpoints**
- `GET /api/hospitals/all` - Get all hospitals
- `GET /api/hospitals/nearest` - Find nearest hospitals
- `POST /api/admin/hospitals/add` - Add new hospital
- `DELETE /api/admin/hospitals/remove` - Remove hospital

### **Booking Endpoints**
- `POST /api/booking/book` - Create new booking
- `GET /api/booking/history` - Get user booking history
- `PATCH /api/booking/complete/{id}` - Complete booking
- `PATCH /api/booking/cancel/{id}` - Cancel booking

### **Admin Endpoints**
- `GET /api/admin/bookings/all` - Get all bookings
- `PATCH /api/admin/bookings/status` - Update booking status

## 📖 Usage Guide

### **For Patients**

1. **Registration & Login**
   - Create an account with email and password
   - Log in to access ambulance booking services

2. **Finding Hospitals**
   - Use the hospital search to find nearby medical facilities
   - View hospital details and available ambulances

3. **Booking Ambulances**
   - Select hospital and ambulance
   - Fill in patient information
   - Confirm booking and receive tracking updates

4. **Tracking & History**
   - Monitor ambulance arrival in real-time
   - View complete booking history

### **For Hospital Staff**

1. **Hospital Management**
   - Update hospital information
   - Manage ambulance fleet
   - Monitor booking requests

2. **Ambulance Operations**
   - Update ambulance status (Available/On Duty/Maintenance)
   - Track active bookings
   - Manage driver assignments

### **For Administrators**

1. **System Overview**
   - Dashboard with key metrics
   - User management and role assignment
   - System-wide statistics

2. **Content Management**
   - Add/remove hospitals and ambulances
   - Manage user accounts
   - Monitor system performance

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `REACT_APP_PULSERIDE_APP_API_URL` | Backend API base URL | `http://localhost:8080` |

### **Tailwind CSS Configuration**

The project uses Tailwind CSS with custom configuration for:
- Color schemes matching medical industry standards
- Responsive breakpoints for mobile-first design
- Custom component classes for consistent UI

### **API Configuration**

- **Base URL**: Configurable via environment variables
- **Authentication**: JWT token-based authentication
- **CORS**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling and user feedback

## 🧪 Testing

### **Frontend Testing**
```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### **Backend Testing**
```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify

# Generate test coverage report
mvn jacoco:report
```

## 🚀 Deployment

### **Frontend Deployment**

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to hosting service**
   - **Vercel**: Connect GitHub repository for automatic deployment
   - **Netlify**: Drag and drop build folder or connect repository
   - **AWS S3**: Upload build files to S3 bucket

### **Backend Deployment**

1. **Build JAR file**
   ```bash
   mvn clean package
   ```

2. **Deploy to cloud platform**
   - **Render**: Upload JAR file or connect GitHub repository
   - **Heroku**: Use Heroku CLI or GitHub integration
   - **AWS EC2**: Deploy to EC2 instance

## 🤝 Contributing

We welcome contributions to improve PulseRide! Here's how you can help:

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Contribution Guidelines**
- Follow existing code style and conventions
- Write clear commit messages
- Include tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting

### **Code Standards**
- **JavaScript**: ESLint configuration with React hooks rules
- **CSS**: Tailwind CSS utility classes
- **React**: Functional components with hooks
- **API**: RESTful design principles

## 📝 Changelog

### **Version 1.0.0 (Current)**
- ✅ User authentication and registration
- ✅ Hospital search and selection
- ✅ Ambulance booking system
- ✅ Real-time status tracking
- ✅ Admin dashboard and management
- ✅ Responsive design for all devices
- ✅ Comprehensive error handling
- ✅ Professional medical industry UI

### **Planned Features**
- 🔄 Push notifications for real-time updates
- 🔄 Multi-language support
- 🔄 Advanced analytics and reporting
- 🔄 Integration with emergency services APIs
- 🔄 Mobile app development

## 🐛 Known Issues

- **CORS Configuration**: Backend CORS settings need to be updated for production deployment
- **Image Placeholders**: Some images are currently using placeholder URLs
- **Environment Variables**: Frontend environment configuration required for production

## 📞 Support

### **Getting Help**
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join project discussions for questions and ideas

### **Emergency Support**
- **Emergency Services**: Call 911 for immediate medical emergencies
- **Project Issues**: Use GitHub Issues for technical problems
- **Feature Requests**: Submit via GitHub Discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Medical Professionals**: For domain expertise and guidance
- **Open Source Community**: For the amazing tools and libraries
- **Contributors**: Everyone who has helped improve PulseRide
- **Users**: For feedback and suggestions that drive improvements

## 🔮 Future Roadmap

### **Phase 2: Enhanced Features**
- Advanced booking algorithms
- Integration with medical records systems
- Real-time communication between patients and responders
- Advanced analytics and reporting

### **Phase 3: Platform Expansion**
- Mobile application development
- API marketplace for third-party integrations
- Multi-tenant architecture for healthcare organizations
- International deployment and localization

### **Phase 4: AI & Machine Learning**
- Predictive demand forecasting
- Intelligent ambulance routing
- Automated emergency response coordination
- Machine learning for service optimization

---

**PulseRide** - Saving lives, one emergency at a time. 🚑✨

*Built with ❤️ for the medical community and emergency responders worldwide.*
