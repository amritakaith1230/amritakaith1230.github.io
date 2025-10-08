// Comprehensive state-to-city mapping for India and other countries
const stateCapitalMapping = {
  // Indian States and Union Territories
  "andhra pradesh": { city: "Amaravati", state: "Andhra Pradesh", country: "India", lat: 16.5062, lon: 80.648 },
  "arunachal pradesh": { city: "Itanagar", state: "Arunachal Pradesh", country: "India", lat: 27.0844, lon: 93.6053 },
  assam: { city: "Guwahati", state: "Assam", country: "India", lat: 26.1445, lon: 91.7362 },
  bihar: { city: "Patna", state: "Bihar", country: "India", lat: 25.5941, lon: 85.1376 },
  chhattisgarh: { city: "Raipur", state: "Chhattisgarh", country: "India", lat: 21.2514, lon: 81.6296 },
  goa: { city: "Panaji", state: "Goa", country: "India", lat: 15.4909, lon: 73.8278 },
  gujarat: { city: "Ahmedabad", state: "Gujarat", country: "India", lat: 23.0225, lon: 72.5714 },
  haryana: { city: "Chandigarh", state: "Haryana", country: "India", lat: 30.7333, lon: 76.7794 },
  "himachal pradesh": { city: "Shimla", state: "Himachal Pradesh", country: "India", lat: 31.1048, lon: 77.1734 },
  jharkhand: { city: "Ranchi", state: "Jharkhand", country: "India", lat: 23.3441, lon: 85.3096 },
  karnataka: { city: "Bangalore", state: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946 },
  kerala: { city: "Thiruvananthapuram", state: "Kerala", country: "India", lat: 8.5241, lon: 76.9366 },
  "madhya pradesh": { city: "Bhopal", state: "Madhya Pradesh", country: "India", lat: 23.2599, lon: 77.4126 },
  maharashtra: { city: "Mumbai", state: "Maharashtra", country: "India", lat: 19.076, lon: 72.8777 },
  manipur: { city: "Imphal", state: "Manipur", country: "India", lat: 24.817, lon: 93.9368 },
  meghalaya: { city: "Shillong", state: "Meghalaya", country: "India", lat: 25.5788, lon: 91.8933 },
  mizoram: { city: "Aizawl", state: "Mizoram", country: "India", lat: 23.7271, lon: 92.7176 },
  nagaland: { city: "Kohima", state: "Nagaland", country: "India", lat: 25.6751, lon: 94.1086 },
  odisha: { city: "Bhubaneswar", state: "Odisha", country: "India", lat: 20.2961, lon: 85.8245 },
  punjab: { city: "Chandigarh", state: "Punjab", country: "India", lat: 30.7333, lon: 76.7794 },
  rajasthan: { city: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lon: 75.7873 },
  sikkim: { city: "Gangtok", state: "Sikkim", country: "India", lat: 27.3389, lon: 88.6065 },
  "tamil nadu": { city: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lon: 80.2707 },
  telangana: { city: "Hyderabad", state: "Telangana", country: "India", lat: 17.385, lon: 78.4867 },
  tripura: { city: "Agartala", state: "Tripura", country: "India", lat: 23.8315, lon: 91.2868 },
  "uttar pradesh": { city: "Lucknow", state: "Uttar Pradesh", country: "India", lat: 26.8467, lon: 80.9462 },
  uttarakhand: { city: "Dehradun", state: "Uttarakhand", country: "India", lat: 30.3165, lon: 78.0322 },
  "west bengal": { city: "Kolkata", state: "West Bengal", country: "India", lat: 22.5726, lon: 88.3639 },

  // Union Territories
  delhi: { city: "New Delhi", state: "Delhi", country: "India", lat: 28.6139, lon: 77.209 },
  chandigarh: { city: "Chandigarh", state: "Chandigarh", country: "India", lat: 30.7333, lon: 76.7794 },
  puducherry: { city: "Puducherry", state: "Puducherry", country: "India", lat: 11.9416, lon: 79.8083 },
  "jammu and kashmir": { city: "Srinagar", state: "Jammu and Kashmir", country: "India", lat: 34.0837, lon: 74.7973 },
  ladakh: { city: "Leh", state: "Ladakh", country: "India", lat: 34.1526, lon: 77.5771 },

  // International States/Provinces
  california: { city: "Los Angeles", state: "California", country: "United States", lat: 34.0522, lon: -118.2437 },
  texas: { city: "Houston", state: "Texas", country: "United States", lat: 29.7604, lon: -95.3698 },
  "new york": { city: "New York", state: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
  florida: { city: "Miami", state: "Florida", country: "United States", lat: 25.7617, lon: -80.1918 },
  ontario: { city: "Toronto", state: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832 },
  quebec: { city: "Montreal", state: "Quebec", country: "Canada", lat: 45.5017, lon: -73.5673 },
}

// Major cities database for fuzzy matching
const majorCitiesDatabase = [
  // Indian Cities
  { name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.076, lon: 72.8777 },
  { name: "Delhi", state: "Delhi", country: "India", lat: 28.6139, lon: 77.209 },
  { name: "Bangalore", state: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946 },
  { name: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", state: "West Bengal", country: "India", lat: 22.5726, lon: 88.3639 },
  { name: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lon: 73.8567 },
  { name: "Hyderabad", state: "Telangana", country: "India", lat: 17.385, lon: 78.4867 },
  { name: "Ahmedabad", state: "Gujarat", country: "India", lat: 23.0225, lon: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lon: 75.7873 },
  { name: "Surat", state: "Gujarat", country: "India", lat: 21.1702, lon: 72.8311 },
  { name: "Lucknow", state: "Uttar Pradesh", country: "India", lat: 26.8467, lon: 80.9462 },
  { name: "Kanpur", state: "Uttar Pradesh", country: "India", lat: 26.4499, lon: 80.3319 },
  { name: "Nagpur", state: "Maharashtra", country: "India", lat: 21.1458, lon: 79.0882 },
  { name: "Indore", state: "Madhya Pradesh", country: "India", lat: 22.7196, lon: 75.8577 },
  { name: "Bhopal", state: "Madhya Pradesh", country: "India", lat: 23.2599, lon: 77.4126 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", country: "India", lat: 17.6868, lon: 83.2185 },
  { name: "Patna", state: "Bihar", country: "India", lat: 25.5941, lon: 85.1376 },
  { name: "Vadodara", state: "Gujarat", country: "India", lat: 22.3072, lon: 73.1812 },
  { name: "Ghaziabad", state: "Uttar Pradesh", country: "India", lat: 28.6692, lon: 77.4538 },
  { name: "Ludhiana", state: "Punjab", country: "India", lat: 30.901, lon: 75.8573 },
  { name: "Agra", state: "Uttar Pradesh", country: "India", lat: 27.1767, lon: 78.0081 },
  { name: "Nashik", state: "Maharashtra", country: "India", lat: 19.9975, lon: 73.7898 },
  { name: "Faridabad", state: "Haryana", country: "India", lat: 28.4089, lon: 77.3178 },
  { name: "Meerut", state: "Uttar Pradesh", country: "India", lat: 28.9845, lon: 77.7064 },
  { name: "Rajkot", state: "Gujarat", country: "India", lat: 22.3039, lon: 70.8022 },
  { name: "Kalyan", state: "Maharashtra", country: "India", lat: 19.2437, lon: 73.1355 },
  { name: "Vasai", state: "Maharashtra", country: "India", lat: 19.4911, lon: 72.806 },
  { name: "Varanasi", state: "Uttar Pradesh", country: "India", lat: 25.3176, lon: 82.9739 },
  { name: "Srinagar", state: "Jammu and Kashmir", country: "India", lat: 34.0837, lon: 74.7973 },
  { name: "Aurangabad", state: "Maharashtra", country: "India", lat: 19.8762, lon: 75.3433 },
  { name: "Dhanbad", state: "Jharkhand", country: "India", lat: 23.7957, lon: 86.4304 },
  { name: "Amritsar", state: "Punjab", country: "India", lat: 31.634, lon: 74.8723 },
  { name: "Navi Mumbai", state: "Maharashtra", country: "India", lat: 19.033, lon: 73.0297 },
  { name: "Allahabad", state: "Uttar Pradesh", country: "India", lat: 25.4358, lon: 81.8463 },
  { name: "Ranchi", state: "Jharkhand", country: "India", lat: 23.3441, lon: 85.3096 },
  { name: "Howrah", state: "West Bengal", country: "India", lat: 22.5958, lon: 88.2636 },
  { name: "Coimbatore", state: "Tamil Nadu", country: "India", lat: 11.0168, lon: 76.9558 },
  { name: "Jabalpur", state: "Madhya Pradesh", country: "India", lat: 23.1815, lon: 79.9864 },
  { name: "Gwalior", state: "Madhya Pradesh", country: "India", lat: 26.2183, lon: 78.1828 },
  { name: "Vijayawada", state: "Andhra Pradesh", country: "India", lat: 16.5062, lon: 80.648 },
  { name: "Jodhpur", state: "Rajasthan", country: "India", lat: 26.2389, lon: 73.0243 },
  { name: "Madurai", state: "Tamil Nadu", country: "India", lat: 9.9252, lon: 78.1198 },
  { name: "Raipur", state: "Chhattisgarh", country: "India", lat: 21.2514, lon: 81.6296 },
  { name: "Kota", state: "Rajasthan", country: "India", lat: 25.2138, lon: 75.8648 },
  { name: "Guwahati", state: "Assam", country: "India", lat: 26.1445, lon: 91.7362 },
  { name: "Chandigarh", state: "Chandigarh", country: "India", lat: 30.7333, lon: 76.7794 },
  { name: "Thiruvananthapuram", state: "Kerala", country: "India", lat: 8.5241, lon: 76.9366 },
  { name: "Solapur", state: "Maharashtra", country: "India", lat: 17.6599, lon: 75.9064 },
  { name: "Hubballi", state: "Karnataka", country: "India", lat: 15.3647, lon: 75.124 },
  { name: "Tiruchirappalli", state: "Tamil Nadu", country: "India", lat: 10.7905, lon: 78.7047 },
  { name: "Bareilly", state: "Uttar Pradesh", country: "India", lat: 28.367, lon: 79.4304 },
  { name: "Mysore", state: "Karnataka", country: "India", lat: 12.2958, lon: 76.6394 },
  { name: "Salem", state: "Tamil Nadu", country: "India", lat: 11.6643, lon: 78.146 },
  { name: "Bhiwandi", state: "Maharashtra", country: "India", lat: 19.3002, lon: 73.0635 },
  { name: "Saharanpur", state: "Uttar Pradesh", country: "India", lat: 29.968, lon: 77.5552 },
  { name: "Gorakhpur", state: "Uttar Pradesh", country: "India", lat: 26.7606, lon: 83.3732 },
  { name: "Bikaner", state: "Rajasthan", country: "India", lat: 28.0229, lon: 73.3119 },
  { name: "Amravati", state: "Maharashtra", country: "India", lat: 20.9374, lon: 77.7796 },
  { name: "Noida", state: "Uttar Pradesh", country: "India", lat: 28.5355, lon: 77.391 },
  { name: "Jamshedpur", state: "Jharkhand", country: "India", lat: 22.8046, lon: 86.2029 },
  { name: "Bhilai", state: "Chhattisgarh", country: "India", lat: 21.1938, lon: 81.3509 },
  { name: "Cuttack", state: "Odisha", country: "India", lat: 20.4625, lon: 85.8828 },
  { name: "Firozabad", state: "Uttar Pradesh", country: "India", lat: 27.1592, lon: 78.3957 },
  { name: "Kochi", state: "Kerala", country: "India", lat: 9.9312, lon: 76.2673 },
  { name: "Nellore", state: "Andhra Pradesh", country: "India", lat: 14.4426, lon: 79.9865 },
  { name: "Bhavnagar", state: "Gujarat", country: "India", lat: 21.7645, lon: 72.1519 },
  { name: "Dehradun", state: "Uttarakhand", country: "India", lat: 30.3165, lon: 78.0322 },
  { name: "Durgapur", state: "West Bengal", country: "India", lat: 23.5204, lon: 87.3119 },
  { name: "Asansol", state: "West Bengal", country: "India", lat: 23.6739, lon: 86.9524 },
  { name: "Rourkela", state: "Odisha", country: "India", lat: 22.2604, lon: 84.8536 },
  { name: "Nanded", state: "Maharashtra", country: "India", lat: 19.1383, lon: 77.321 },
  { name: "Kolhapur", state: "Maharashtra", country: "India", lat: 16.705, lon: 74.2433 },
  { name: "Ajmer", state: "Rajasthan", country: "India", lat: 26.4499, lon: 74.6399 },
  { name: "Akola", state: "Maharashtra", country: "India", lat: 20.7002, lon: 77.0082 },
  { name: "Gulbarga", state: "Karnataka", country: "India", lat: 17.3297, lon: 76.8343 },
  { name: "Jamnagar", state: "Gujarat", country: "India", lat: 22.4707, lon: 70.0577 },
  { name: "Ujjain", state: "Madhya Pradesh", country: "India", lat: 23.1765, lon: 75.7885 },
  { name: "Loni", state: "Uttar Pradesh", country: "India", lat: 28.7333, lon: 77.2833 },
  { name: "Siliguri", state: "West Bengal", country: "India", lat: 26.7271, lon: 88.3953 },
  { name: "Jhansi", state: "Uttar Pradesh", country: "India", lat: 25.4484, lon: 78.5685 },
  { name: "Ulhasnagar", state: "Maharashtra", country: "India", lat: 19.2215, lon: 73.1645 },
  { name: "Jammu", state: "Jammu and Kashmir", country: "India", lat: 32.7266, lon: 74.857 },
  { name: "Sangli", state: "Maharashtra", country: "India", lat: 16.8524, lon: 74.5815 },
  { name: "Mangalore", state: "Karnataka", country: "India", lat: 12.9141, lon: 74.856 },
  { name: "Erode", state: "Tamil Nadu", country: "India", lat: 11.341, lon: 77.7172 },
  { name: "Belgaum", state: "Karnataka", country: "India", lat: 15.8497, lon: 74.4977 },
  { name: "Ambattur", state: "Tamil Nadu", country: "India", lat: 13.1143, lon: 80.1548 },
  { name: "Tirunelveli", state: "Tamil Nadu", country: "India", lat: 8.7139, lon: 77.7567 },
  { name: "Malegaon", state: "Maharashtra", country: "India", lat: 20.5579, lon: 74.5287 },
  { name: "Gaya", state: "Bihar", country: "India", lat: 24.7914, lon: 85.0002 },
  { name: "Jalgaon", state: "Maharashtra", country: "India", lat: 21.0077, lon: 75.5626 },
  { name: "Udaipur", state: "Rajasthan", country: "India", lat: 24.5854, lon: 73.7125 },
  { name: "Maheshtala", state: "West Bengal", country: "India", lat: 22.5093, lon: 88.2482 },

  // International Cities
  { name: "London", state: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "New York", state: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
  { name: "Tokyo", state: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", state: "Île-de-France", country: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Sydney", state: "New South Wales", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Dubai", state: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", state: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Bangkok", state: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
  { name: "Los Angeles", state: "California", country: "United States", lat: 34.0522, lon: -118.2437 },
  { name: "Chicago", state: "Illinois", country: "United States", lat: 41.8781, lon: -87.6298 },
  { name: "Toronto", state: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832 },
  { name: "Berlin", state: "Berlin", country: "Germany", lat: 52.52, lon: 13.405 },
  { name: "Madrid", state: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
  { name: "Rome", state: "Lazio", country: "Italy", lat: 41.9028, lon: 12.4964 },
  { name: "Amsterdam", state: "North Holland", country: "Netherlands", lat: 52.3676, lon: 4.9041 },
  { name: "Moscow", state: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6176 },
  { name: "Beijing", state: "Beijing", country: "China", lat: 39.9042, lon: 116.4074 },
  { name: "Shanghai", state: "Shanghai", country: "China", lat: 31.2304, lon: 121.4737 },
  { name: "Hong Kong", state: "Hong Kong", country: "Hong Kong", lat: 22.3193, lon: 114.1694 },
  { name: "Seoul", state: "Seoul", country: "South Korea", lat: 37.5665, lon: 126.978 },
  { name: "Istanbul", state: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784 },
  { name: "Cairo", state: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357 },
  { name: "São Paulo", state: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333 },
  { name: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lon: -43.1729 },
  { name: "Buenos Aires", state: "Buenos Aires", country: "Argentina", lat: -34.6118, lon: -58.396 },
  { name: "Mexico City", state: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332 },
  { name: "Vancouver", state: "British Columbia", country: "Canada", lat: 49.2827, lon: -123.1207 },
  { name: "Montreal", state: "Quebec", country: "Canada", lat: 45.5017, lon: -73.5673 },
  { name: "Miami", state: "Florida", country: "United States", lat: 25.7617, lon: -80.1918 },
  { name: "Las Vegas", state: "Nevada", country: "United States", lat: 36.1699, lon: -115.1398 },
  { name: "San Francisco", state: "California", country: "United States", lat: 37.7749, lon: -122.4194 },
  { name: "Boston", state: "Massachusetts", country: "United States", lat: 42.3601, lon: -71.0589 },
  { name: "Washington", state: "District of Columbia", country: "United States", lat: 38.9072, lon: -77.0369 },
  { name: "Philadelphia", state: "Pennsylvania", country: "United States", lat: 39.9526, lon: -75.1652 },
  { name: "Houston", state: "Texas", country: "United States", lat: 29.7604, lon: -95.3698 },
  { name: "Phoenix", state: "Arizona", country: "United States", lat: 33.4484, lon: -112.074 },
  { name: "San Antonio", state: "Texas", country: "United States", lat: 29.4241, lon: -98.4936 },
  { name: "San Diego", state: "California", country: "United States", lat: 32.7157, lon: -117.1611 },
  { name: "Dallas", state: "Texas", country: "United States", lat: 32.7767, lon: -96.797 },
  { name: "San Jose", state: "California", country: "United States", lat: 37.3382, lon: -121.8863 },
  { name: "Austin", state: "Texas", country: "United States", lat: 30.2672, lon: -97.7431 },
  { name: "Jacksonville", state: "Florida", country: "United States", lat: 30.3322, lon: -81.6557 },
  { name: "Fort Worth", state: "Texas", country: "United States", lat: 32.7555, lon: -97.3308 },
  { name: "Columbus", state: "Ohio", country: "United States", lat: 39.9612, lon: -82.9988 },
  { name: "Charlotte", state: "North Carolina", country: "United States", lat: 35.2271, lon: -80.8431 },
  { name: "Indianapolis", state: "Indiana", country: "United States", lat: 39.7684, lon: -86.1581 },
  { name: "Seattle", state: "Washington", country: "United States", lat: 47.6062, lon: -122.3321 },
  { name: "Denver", state: "Colorado", country: "United States", lat: 39.7392, lon: -104.9903 },
  { name: "Nashville", state: "Tennessee", country: "United States", lat: 36.1627, lon: -86.7816 },
  { name: "Baltimore", state: "Maryland", country: "United States", lat: 39.2904, lon: -76.6122 },
  { name: "Louisville", state: "Kentucky", country: "United States", lat: 38.2527, lon: -85.7585 },
  { name: "Portland", state: "Oregon", country: "United States", lat: 45.5152, lon: -122.6784 },
  { name: "Oklahoma City", state: "Oklahoma", country: "United States", lat: 35.4676, lon: -97.5164 },
  { name: "Milwaukee", state: "Wisconsin", country: "United States", lat: 43.0389, lon: -87.9065 },
  { name: "Las Vegas", state: "Nevada", country: "United States", lat: 36.1699, lon: -115.1398 },
  { name: "Albuquerque", state: "New Mexico", country: "United States", lat: 35.0844, lon: -106.6504 },
  { name: "Tucson", state: "Arizona", country: "United States", lat: 32.2226, lon: -110.9747 },
  { name: "Fresno", state: "California", country: "United States", lat: 36.7378, lon: -119.7871 },
  { name: "Sacramento", state: "California", country: "United States", lat: 38.5816, lon: -121.4944 },
  { name: "Long Beach", state: "California", country: "United States", lat: 33.7701, lon: -118.1937 },
  { name: "Kansas City", state: "Missouri", country: "United States", lat: 39.0997, lon: -94.5786 },
  { name: "Mesa", state: "Arizona", country: "United States", lat: 33.4152, lon: -111.8315 },
  { name: "Virginia Beach", state: "Virginia", country: "United States", lat: 36.8529, lon: -75.978 },
  { name: "Atlanta", state: "Georgia", country: "United States", lat: 33.749, lon: -84.388 },
  { name: "Colorado Springs", state: "Colorado", country: "United States", lat: 38.8339, lon: -104.8214 },
  { name: "Raleigh", state: "North Carolina", country: "United States", lat: 35.7796, lon: -78.6382 },
  { name: "Omaha", state: "Nebraska", country: "United States", lat: 41.2565, lon: -95.9345 },
  { name: "Miami", state: "Florida", country: "United States", lat: 25.7617, lon: -80.1918 },
  { name: "Oakland", state: "California", country: "United States", lat: 37.8044, lon: -122.2711 },
  { name: "Minneapolis", state: "Minnesota", country: "United States", lat: 44.9778, lon: -93.265 },
  { name: "Tulsa", state: "Oklahoma", country: "United States", lat: 36.154, lon: -95.9928 },
  { name: "Cleveland", state: "Ohio", country: "United States", lat: 41.4993, lon: -81.6944 },
  { name: "Wichita", state: "Kansas", country: "United States", lat: 37.6872, lon: -97.3301 },
  { name: "Arlington", state: "Texas", country: "United States", lat: 32.7357, lon: -97.1081 },
]

// Fuzzy search algorithm using Levenshtein distance
function levenshteinDistance(str1, str2) {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Fuzzy search function
function fuzzySearch(query, database, maxResults = 10) {
  const normalizedQuery = query.toLowerCase().trim()

  if (normalizedQuery.length < 2) {
    return []
  }

  const results = database.map((item) => {
    const normalizedName = item.name.toLowerCase()
    const normalizedState = item.state.toLowerCase()
    const normalizedCountry = item.country.toLowerCase()

    // Calculate different types of matches
    const exactMatch = normalizedName === normalizedQuery
    const startsWithMatch = normalizedName.startsWith(normalizedQuery)
    const containsMatch = normalizedName.includes(normalizedQuery)
    const stateMatch = normalizedState.includes(normalizedQuery)
    const countryMatch = normalizedCountry.includes(normalizedQuery)

    // Calculate Levenshtein distance
    const distance = levenshteinDistance(normalizedQuery, normalizedName)
    const maxLength = Math.max(normalizedQuery.length, normalizedName.length)
    const similarity = 1 - distance / maxLength

    // Calculate score based on different factors
    let score = 0

    if (exactMatch) score += 100
    else if (startsWithMatch) score += 80
    else if (containsMatch) score += 60
    else if (stateMatch) score += 40
    else if (countryMatch) score += 20

    // Add similarity bonus
    score += similarity * 50

    // Bonus for shorter names (more likely to be what user wants)
    if (normalizedName.length <= normalizedQuery.length + 3) {
      score += 10
    }

    return {
      ...item,
      score,
      distance,
      similarity,
    }
  })

  // Filter and sort results
  return results
    .filter((item) => item.score > 20 || item.similarity > 0.6)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ score, distance, similarity, ...item }) => item)
}

// Get state capital or major city
function getStateCapital(stateName) {
  const normalizedState = stateName.toLowerCase().trim()
  return stateCapitalMapping[normalizedState] || null
}

// Validate if input is gibberish
function isValidLocationInput(input) {
  const trimmed = input.trim()

  // Check minimum length
  if (trimmed.length < 2) return false

  // Check if it contains only valid characters
  const validPattern = /^[a-zA-Z\s\-'.]+$/
  if (!validPattern.test(trimmed)) return false

  // Check vowel to consonant ratio
  const vowels = (trimmed.match(/[aeiouAEIOU]/g) || []).length
  const consonants = (trimmed.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length

  if (vowels === 0 || (consonants > 0 && vowels / consonants < 0.15)) return false

  // Check for repeated characters
  const repeatedPattern = /(.)\1{4,}/
  if (repeatedPattern.test(trimmed)) return false

  // Check if it's a common gibberish pattern
  const gibberishPatterns = [
    /^[qwrtypsdfghjklzxcvbnm]{5,}$/i, // Only consonants
    /^[aeiou]{4,}$/i, // Only vowels
    /^(.)\1{3,}/, // Repeated characters
    /^[^aeiou]*[aeiou][^aeiou]*$/i, // Single vowel surrounded by consonants
  ]

  for (const pattern of gibberishPatterns) {
    if (pattern.test(trimmed)) return false
  }

  return true
}

module.exports = {
  stateCapitalMapping,
  majorCitiesDatabase,
  fuzzySearch,
  getStateCapital,
  isValidLocationInput,
  levenshteinDistance,
}
