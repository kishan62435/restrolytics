# Restrolytics Codebase

[🚀 Live Demo](https://restrolytics.vercel.app/)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Running the Project Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restrolytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` and configure your API endpoints if needed.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

---

[🚀 Live Demo](https://restrolytics.vercel.app/)
## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Running the Project Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restrolytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` and configure your API endpoints if needed.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

---

## Project Overview

**Restrolytics** is a modern, professional restaurant analytics dashboard built with Next.js 15, React 19, and Tailwind CSS. The application provides comprehensive analytics for restaurant chains, including order tracking, revenue analysis, performance trends, and detailed filtering capabilities.

## Technology Stack

- **Frontend Framework**: Next.js 15.5.0 with App Router
- **React Version**: 19.1.0
- **Styling**: Tailwind CSS 4 with custom enterprise design system
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Hooks (useState, useEffect, useMemo, useCallback)
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React
- **Theme**: Light/Dark mode support with next-themes
- **Build Tool**: Turbopack for development

## Project Structure

```
restrolytics/
├── src/
│   ├── api/                    # API configuration and services
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utility functions and constants
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
└── components.json             # UI components configuration
```

## Core Architecture

### 1. API Layer (`src/api/`)

#### Configuration (`config.js`)
- Centralized API configuration with environment variable support
- Configurable base URL, timeout, and headers
- Default fallback to localhost:8000 for development

#### Services
- **AnalyticsService** (`analyticsService.js`): Handles restaurant trends, top restaurants, and orders data
- **RestaurantService** (`restaurantService.js`): Manages restaurant listing and basic operations

### 2. Application Layer (`src/app/`)

#### Main Dashboard (`page.js`)
- Single-page application with comprehensive restaurant analytics
- State management for filters, pagination, and restaurant selection
- Integration of all major components and data flows

#### Layout (`layout.js`)
- Root layout with theme provider integration
- Google Fonts (Geist) integration
- Global CSS and theme context setup

### 3. Component Architecture (`src/components/`)

#### Core Dashboard Components
- **DashboardHeader**: Displays loading states and summary metrics
- **FilterBar**: Comprehensive filtering system with date, restaurant, amount, and hour filters
- **FilterSummary**: Visual representation of active filters
- **KeyMetricsCards**: KPI display (restaurants, orders, revenue, AOV)
- **TopRestaurants**: Top 3 performing restaurants by revenue
- **RestaurantsList**: Searchable, sortable restaurant listing with pagination
- **RestaurantTrends**: Detailed analytics for selected restaurant
- **OrdersList**: Order management with pagination and filtering

#### UI Components (`src/components/ui/`)
- **Button**: Customizable button component with variants
- **Card**: Card container with header, content, and title
- **Input**: Form input component
- **Select**: Dropdown selection component
- **Tabs**: Tab navigation component

#### Theme System
- **ThemeProvider**: Context provider for light/dark theme management
- **ThemeToggle**: Theme switching component with emoji indicators

### 4. Custom Hooks (`src/hooks/`)

#### Data Management Hooks
- **useAnalytics**: Manages analytics data fetching and computation
- **useRestaurants**: Handles restaurant data with search and sorting
- **useOrders**: Manages order data with pagination and filtering
- **useMobile**: Responsive design utilities

### 5. Utility Layer (`src/lib/`)

#### Filter Mappings (`filterMappings.js`)
- Date range mappings (Today, Last 7 days, Last 30 days, etc.)
- Amount range mappings (₹100-₹200, ₹200-₹500, etc.)
- Hour range mappings (Breakfast, Lunch, Dinner, etc.)
- Filter validation and transformation utilities

#### Utilities (`utils.js`)
- Common utility functions for data processing and formatting

## Key Features

### 1. Advanced Filtering System
- **Date Ranges**: Predefined periods + custom date picker with calendar interface
- **Restaurant Selection**: Single or multiple restaurant selection
- **Amount Filtering**: Revenue-based filtering with predefined ranges
- **Hour Filtering**: Time-based filtering for order analysis
- **Filter Persistence**: Active filter state management

### 2. Restaurant Management
- **Search & Sort**: Real-time search by name, location, cuisine
- **Pagination**: Configurable items per page (2, 5, 10, All)
- **View Modes**: Card and table view options
- **Selection System**: Interactive restaurant selection with visual feedback

### 3. Analytics Dashboard
- **Key Metrics**: Total restaurants, orders, revenue, average order value
- **Top Performers**: Top 3 restaurants by revenue
- **Trend Analysis**: Daily and hourly performance trends
- **Order Management**: Detailed order listing with pagination

### 4. User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: Light/dark mode with system preference detection
- **Loading States**: Comprehensive loading indicators and skeleton states
- **Error Handling**: Graceful error handling with retry mechanisms
- **Animations**: Smooth transitions and hover effects

## Data Flow Architecture

### 1. Data Fetching Pattern
```
User Action → Filter Change → Hook Update → API Call → State Update → UI Re-render
```

### 2. State Management
- **Local State**: Component-level state for UI interactions
- **Derived State**: Computed values using useMemo for performance
- **Shared State**: Filter state managed at dashboard level
- **API State**: Loading, error, and data states in custom hooks

### 3. Performance Optimizations
- **Memoization**: useMemo for expensive computations
- **Callback Optimization**: useCallback for stable function references
- **Debounced Updates**: Efficient filter parameter handling
- **Pagination**: Server-side pagination for large datasets

## API Integration

### 1. Endpoints
- `POST /api/analytics/restaurant-trends`: Restaurant performance trends
- `POST /api/analytics/top-restaurants`: Top performing restaurants
- `POST /api/orders`: Order listing with filters
- `GET /api/restaurants`: Restaurant listing

### 2. Request Structure
- **Analytics**: Date ranges, restaurant IDs, amount ranges, hour ranges
- **Orders**: Restaurant ID, date filters, amount filters, pagination
- **Restaurants**: Pagination, search, and sorting parameters

### 3. Response Handling
- **Success Responses**: Data extraction and state updates
- **Error Handling**: User-friendly error messages with retry options
- **Loading States**: Comprehensive loading indicators

## Styling System

### 1. Tailwind CSS Configuration
- **Custom Color Palette**: Enterprise-focused color scheme
- **Component Variants**: Consistent button, card, and input styles
- **Responsive Design**: Mobile-first responsive utilities
- **Dark Mode**: Comprehensive dark theme support

### 2. Custom CSS Classes
- **Enterprise Styling**: Professional dashboard aesthetics
- **Gradient Effects**: Subtle gradients for visual hierarchy
- **Animation Classes**: Smooth transitions and hover effects
- **Component-Specific**: Specialized styling for metric cards and filters

## Responsive Design

### 1. Mobile-First Approach
- **Breakpoint System**: Tailwind's responsive utilities
- **Touch-Friendly**: Optimized for mobile interactions
- **Flexible Layouts**: Adaptive grid and flexbox systems

### 2. Component Adaptability
- **Filter Bar**: Responsive filter layout with wrapping
- **Data Tables**: Horizontal scrolling for mobile devices
- **Navigation**: Mobile-optimized navigation patterns

## Theme System

### 1. Light/Dark Mode
- **System Preference**: Automatic theme detection
- **Local Storage**: Theme persistence across sessions
- **Smooth Transitions**: CSS transitions for theme switching
- **Context Provider**: React Context for theme state management

### 2. Color Variables
- **CSS Custom Properties**: Dynamic color theming
- **Semantic Naming**: Meaningful color variable names
- **Accessibility**: High contrast ratios for both themes

## Performance Considerations

### 1. Code Splitting
- **Next.js Optimization**: Automatic code splitting by route
- **Component Lazy Loading**: Dynamic imports for heavy components
- **Bundle Optimization**: Efficient dependency management

### 2. Rendering Optimization
- **React 19 Features**: Latest React optimizations
- **Memoization**: Strategic use of useMemo and useCallback
- **State Updates**: Efficient state update patterns

## Security Features

### 1. API Security
- **Environment Variables**: Secure API configuration
- **Request Validation**: Input sanitization and validation
- **Error Handling**: Secure error message handling

### 2. Frontend Security
- **XSS Prevention**: Safe HTML rendering
- **Input Sanitization**: Form input validation
- **Secure Storage**: Local storage security considerations

## Development Workflow

### 1. Scripts
- `npm run dev`: Development server with Turbopack
- `npm run build`: Production build with Turbopack
- `npm run start`: Production server
- `npm run lint`: ESLint code quality check

### 2. Development Tools
- **ESLint**: Code quality and consistency
- **Turbopack**: Fast development builds
- **Hot Reload**: Instant feedback during development

## Deployment Considerations

### 1. Environment Configuration
- **API Endpoints**: Configurable backend URLs
- **Build Optimization**: Production-ready builds
- **Static Assets**: Optimized public assets

### 2. Platform Support
- **Vercel**: Optimized for Next.js deployment
- **Static Export**: Support for static hosting
- **API Routes**: Backend API integration support

## Future Enhancements

### 1. Potential Features
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Charts**: More sophisticated data visualizations
- **Export Functionality**: Data export to CSV/PDF
- **User Authentication**: Multi-user support with roles

### 2. Technical Improvements
- **TypeScript Migration**: Enhanced type safety
- **Testing Suite**: Comprehensive testing coverage
- **Performance Monitoring**: Analytics and performance tracking
- **PWA Support**: Progressive web app capabilities

## Conclusion

Restrolytics represents a well-architected, modern restaurant analytics dashboard that demonstrates best practices in React development, state management, and user experience design. The codebase is structured for maintainability, performance, and scalability, making it an excellent foundation for future enhancements and enterprise deployment.

The application successfully combines complex data management with intuitive user interfaces, providing restaurant managers with powerful analytical tools while maintaining excellent usability across all device types.
