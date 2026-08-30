# CityPulse AI Frontend Backend Connection Patch

Copy these files into your existing `frontend` folder, preserving the same paths.

## Required backend URL
Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then restart Vite:

```bash
npm run dev
```

## Connected features
- Register page: `/register`
- Login page: `/login`
- Auth token saved in localStorage
- Protected Report, Track and Dashboard pages
- Complaint submission connected to `POST /api/complaints`
- Complaint tracking connected to `GET /api/complaints/:id`
- Dashboard connected to `GET /api/complaints`

## Backend must be running
Run backend first:

```bash
cd backend
npm run dev
```

Backend expected base URL:

```txt
http://localhost:5000/api
```
