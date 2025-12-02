# ☁️ Weather API Service

A simple RESTful API service to fetch current weather data for a specified city.

## 🚀 How to Use

The service exposes a single endpoint for retrieving weather information.

### Endpoint

You can make a `GET` request to the `/weather` path and provide a city name as a query parameter.

---

### Example Request

| Method | Path | Query Parameter |
| :--- | :--- | :--- |
| `GET` | `/weather` | `city` |

**Request URL Example:**
GET http://localhost:5000/weather?city=Dhaka


### Example Response

A successful request will return a JSON object containing the city information and the detailed weather data.

```json
{
  "success": true,
  "message": "Weather fetched successfully",
  "data": {
    "city": "Dhaka",
    "country": "Bangladesh",
    "latitude": 23.7104,
    "longitude": 90.40744,
    "weather": {
      "latitude": 23.75,
      "longitude": 90.375,
      "generationtime_ms": 0.06008148193359375,
      "utc_offset_seconds": 0,
      "timezone": "GMT",
      "timezone_abbreviation": "GMT",
      "elevation": 16,
      "hourly_units": {
        "time": "iso8601",
        "temperature_2m": "°C"
      },
      "hourly": {
        "time": [
          "...",
          "..."
        ],
        "temperature_2m": [
          "...",
          "..."
        ]
      }
    }
  }
}





URL to use from the client:
http://localhost:5000/weather?city=Berlin&userId=YOUR_USER_ID

To get the weather search history, make a GET request to:
http://localhost:5000/weather/history


You can now get weather search history for a specific user by making a GET request to:
http://localhost:5000/weather/history/user?userId=YOUR_USER_ID




















<!-- npm i --save-dev @types/express -->
 <!-- npm install -D typescript       -->
<!-- npm i -D tsx -->
<!-- npx tsc --init -->


<!-- DataBase  -->
<!-- npm install pg -->
<!-- npm i -D @types/pg -->
