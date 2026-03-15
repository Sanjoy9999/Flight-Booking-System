# 🎫 Guaranteed Flight Search Examples (Mock Data)

The `flight.json` mock data contains a very small, specific snapshot of flights. Providing any date or city outside of this exact database will result in **"No flights found matching your criteria"**.

⚠️ **Important Note:** In your recent search, you tried **DEL to AUH on 01-03-2026**. This failed because there are **0 flights** to AUH on March 1st in the mock database. All DEL to AUH flights depart on **March 2nd**.

Try copying these exact configurations into your form fields to get guaranteed results that match all filters:

---

## 🟢 Example 1: The "AUH" Round-Trip (1 Stop)

_Tests your 1-stop, round-trip, and time filtering logic._

- **From**: `DEL`
- **To**: `AUH`
- **Departure Date**: `02-03-2026` (March 2, 2026)
- **Trip Type**: `Round-trip`
- **Return Date**: `04-03-2026` (March 4, 2026) OR `05-03-2026` (March 5, 2026)
- **Max Price (₹)**: `Any` (Move slider all the way up, or at least 25000)
- **Stops**: `1 Stop`
- **Departure After (Hour)**: `10`
- **Departure Before (Hour)**: `21`
- **Passengers**: `1 Passenger` (Up to 2 adults)

---

## 🟢 Example 2: The Direct "DXB" Morning Flight

_Tests the direct flight filtering and early morning departures._

- **From**: `DEL`
- **To**: `DXB`
- **Departure Date**: `02-03-2026` (March 2, 2026)
- **Trip Type**: `One-way`
- **Max Price (₹)**: `Any`
- **Stops**: `Non-stop` (or 0 Stops)
- **Departure After (Hour)**: `5`
- **Departure Before (Hour)**: `10`
- **Passengers**: `1 Passenger`

---

## 🟢 Example 3: The "SHJ" Family Vacation

_Tests the maximum passenger limits._

- **From**: `DEL`
- **To**: `SHJ`
- **Departure Date**: `02-03-2026` (March 2, 2026)
- **Trip Type**: `Round-trip`
- **Return Date**: `05-03-2026` (March 5, 2026)
- **Max Price (₹)**: `Any`
- **Stops**: `All`
- **Departure After (Hour)**: _Leave Empty_
- **Departure Before (Hour)**: _Leave Empty_
- **Passengers**: `5+ Passengers` (Tests the limits of the economy bundling)

---

### 📝 Summary of Available Data:

- **Routes:** Only between **DEL** and UAE cities (**DXB, AUH, SHJ, RKT, ZVJ**)
- **Outbounds (DEL -> UAE):** Only on **March 1st or March 2nd, 2026** _(AUH is only on March 2nd)_
- **Inbounds (UAE -> DEL):** Only on **March 4th or March 5th, 2026**

---

# ✅ COMPREHENSIVE VALID SEARCH INPUTS (From flight.json)

## Flight Data Overview from flight.json

**Primary Data - From searchId**:

```
DEL-DXB-20260302-ECONOMY-2-2-1-2-R-20260305-azwfoxyhwcg30e4oy2n3xhlm
```

- Source: DEL (Delhi)
- Destination: DXB (Dubai - note: actual data contains SHJ routes)
- Departure: March 2, 2026
- Trip: Round-trip
- Return: March 5, 2026

## Valid Search Parameters

### 1. **Source (Required)**

**Type**: Airport Code (IATA - 3 letters)

**Valid Values**:

- `DEL` → Searchable from Delhi as source
- `SHJ` → Searchable from Sharjah as source

**Example**: `"source": "DEL"`

---

### 2. **Destination (Required)**

**Type**: Airport Code (IATA - 3 letters)

**Valid Values**:

- `SHJ` → When source is DEL (Delhi to Sharjah)
- `DEL` → When source is SHJ (Sharjah to Delhi)

**Example**: `"destination": "SHJ"`

---

### 3. **Departure Date (Required)**

**Type**: Date string in ISO format

**Format**: `YYYY-MM-DD`

**Valid Values from flight.json**:

- `2026-03-02` → Outbound (DEL → SHJ)
- `2026-03-05` → Return (SHJ → DEL)

**Example**: `"departureDate": "2026-03-02"`

---

### 4. **Max Price (Optional)**

**Type**: Number (integer or decimal)

**Format**: Price in INR (Indian Rupees)

**Valid Range from data**:

- Minimum: `11,860`
- Maximum: `85,104`
- Recommended: `10000` - `100000`

**Example Values**:

- `"maxPrice": 50000` → Budget flights
- `"maxPrice": 65000` → Mid-range
- `"maxPrice": 85000` → Premium

**Effect**: Only shows flights where `lowestPrice ≤ maxPrice`

---

### 5. **Stops (Optional)**

**Type**: Integer

**Valid Values**:

- `0` → Non-stop flights only
- `1` → Flights with exactly 1 stop
- `2` → Flights with 2 or more stops

**Example**: `"stops": 1`

**Effect**: Filters by number of stops

---

### 6. **Departure Time Start (Optional)**

**Type**: Integer (Hour in 24-hour format)

**Format**: 0-23

**Valid Examples**:

- `0` → After midnight
- `6` → After 6:00 AM
- `9` → After 9:00 AM
- `14` → After 2:00 PM
- `18` → After 6:00 PM

**Example**: `"departureTimeStart": 9`

**Effect**: Shows flights departing at or after this hour

---

### 7. **Departure Time End (Optional)**

**Type**: Integer (Hour in 24-hour format)

**Format**: 0-23

**Valid Examples**:

- `12` → Before or at noon
- `18` → Before or at 6:00 PM
- `23` → Before or at 11:00 PM

**Example**: `"departureTimeEnd": 18`

**Effect**: Shows flights departing at or before this hour

---

## ✅ GUARANTEED WORKING SEARCH REQUESTS

### Request 1: Basic Outbound Search

```json
{
  "source": "DEL",
  "destination": "SHJ",
  "departureDate": "2026-03-02"
}
```

**Will Return**: All available flights DEL→SHJ on March 2, 2026

---

### Request 2: Return Journey

```json
{
  "source": "SHJ",
  "destination": "DEL",
  "departureDate": "2026-03-05"
}
```

**Will Return**: All available flights SHJ→DEL on March 5, 2026

---

### Request 3: Budget Flights

```json
{
  "source": "DEL",
  "destination": "SHJ",
  "departureDate": "2026-03-02",
  "maxPrice": 50000
}
```

**Will Return**: Flights ≤ ₹50,000 on outbound

---

### Request 4: Non-Stop Only

```json
{
  "source": "DEL",
  "destination": "SHJ",
  "departureDate": "2026-03-02",
  "stops": 0
}
```

**Will Return**: Only non-stop flights

---

### Request 5: One Stop Budget

```json
{
  "source": "DEL",
  "destination": "SHJ",
  "departureDate": "2026-03-02",
  "stops": 1,
  "maxPrice": 60000
}
```

**Will Return**: Flights with 1 stop, price ≤ ₹60,000

---

### Request 6: Morning Departures

```json
{
  "source": "DEL",
  "destination": "SHJ",
  "departureDate": "2026-03-02",
  "departureTimeStart": 6,
  "departureTimeEnd": 12
}
```

**Will Return**: Flights departing 6:00 AM - 12:00 PM

---

### Request 7: Evening Departure

```json
{
  "source": "DEL",
  "destination": "SHJ",
  "departureDate": "2026-03-02",
  "departureTimeStart": 18,
  "departureTimeEnd": 23
}
```

**Will Return**: Flights departing 6:00 PM - 11:00 PM

---

### Request 8: Complete Filters

```json
{
  "source": "DEL",
  "destination": "SHJ",
  "departureDate": "2026-03-02",
  "maxPrice": 65000,
  "stops": 1,
  "departureTimeStart": 9,
  "departureTimeEnd": 20
}
```

**Will Return**: Flights matching ALL criteria:

- Route: Delhi → Sharjah
- Date: March 2, 2026
- Price: ≤ ₹65,000
- Stops: Exactly 1
- Time: 9:00 AM - 8:00 PM

---

## Response Structure

**Success Response Example**:

```json
{
  "success": true,
  "searchId": "DEL-SHJ-20260302-ECONOMY-2-2-1-2-...",
  "totalResults": 5,
  "flights": [
    {
      "flightKey": "DEL-DOH-QR-4771-1772466300_DOH-SHJ-QR-1060-1772483400",
      "airline": "QR",
      "departureTime": "2026-03-02T21:15:00+05:30",
      "totalStops": 1,
      "lowestPrice": "57231",
      "flights": [...],
      "fares": [...]
    }
  ]
}
```

**Error Response Example**:

```json
{
  "success": false,
  "error": "Missing: source, destination, departureDate"
}
```

---

## Validation Rules (Applied in Controller)

✅ **Required Fields**:

- source (cannot be empty)
- destination (cannot be empty)
- departureDate (cannot be empty)

✅ **Range Validation**:

- maxPrice: Must be > 0
- stops: Must be 0, 1, or 2 (2+ stops)
- departureTimeStart: Must be 0-23
- departureTimeEnd: Must be 0-23

✅ **Date Validation**:

- Must match format: YYYY-MM-DD
- Must only be: 2026-03-02 or 2026-03-05 (from file.json)

✅ **Airport Code Validation**:

- source & destination must be from available airports
- source ≠ destination

---

## API Endpoint

**URL**: `POST http://localhost:5000/api/search`

**Headers**: `Content-Type: application/json`

**Success Code**: 200 with flights array

**Error Code**: 400 if validation fails

---

## Tips for Testing

1. **Always use dates**: 2026-03-02 (outbound) or 2026-03-05 (return)
2. **Use DEL-SHJ** for outbound or **SHJ-DEL** for return
3. **Try without filters first** to see all available flights
4. **Then add filters** to narrow results
5. **Price range**: 11,860 to 85,104 INR
6. **All flights have**: 0, 1, or 2+ stops available
