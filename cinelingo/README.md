# CineLingo Frontend

Production-ready React frontend for the CineLingo cinema-based English learning platform.

## Tech Stack

| Layer         | Technology                     |
|---------------|-------------------------------|
| Framework     | React 18 + Vite                |
| Routing       | React Router v6                |
| Styling       | TailwindCSS 3                  |
| HTTP Client   | Axios + Interceptors           |
| Real-time     | SignalR (@microsoft/signalr)   |
| Charts        | Recharts                       |
| Icons         | Lucide React                   |
| Toast         | React Hot Toast                |
| Fonts         | Playfair Display + DM Sans     |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Edit .env — set your backend URL
VITE_API_BASE_URL=http://localhost:5000
VITE_SIGNALR_HUB_URL=http://localhost:5000/hubs/chat

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

## Project Structure

```
src/
├── api/
│   └── axiosConfig.js        # Axios instance + JWT interceptors + 401/403 handling
├── components/
│   ├── ui/                   # Reusable UI: Button, Input, Modal, Table, Card, Badge, Avatar
│   ├── common/               # App-level: NotificationsDropdown, ProfileDropdown, PaywallModal
│   ├── chat/                 # ChatSidebar (SignalR real-time)
│   └── ErrorBoundary.jsx
├── context/
│   └── AuthContext.jsx       # Global auth state (login, register, logout, selectLevel)
├── hooks/
│   ├── useApi.js             # Generic data fetching hook + useMutation
│   └── useChat.js            # SignalR connection hook
├── layouts/
│   ├── ClientLayout.jsx      # Top navbar + chat sidebar shell
│   └── AdminLayout.jsx       # Collapsible sidebar shell
├── pages/
│   ├── client/               # Login, Register, LevelSelection, Dashboard, Units,
│   │                         # UnitDetail, Quiz, QuizHistory, Vocabulary, Flashcards,
│   │                         # Leaderboard, Profile
│   └── admin/                # Dashboard, Users, Units, Levels, Quizzes
├── routes/
│   └── ProtectedRoute.jsx    # Role-based route guard
├── services/
│   ├── authService.js        # Auth API calls
│   └── index.js              # All domain service calls
└── utils/
    └── helpers.js            # Formatting, cn(), debounce, etc.
```

## Key Features

### Authentication
- JWT stored in `localStorage` under `cinelingo_token`
- Axios request interceptor auto-attaches `Authorization: Bearer <token>`
- Response interceptor catches 401 → clears storage, fires `auth:logout` event
- Response interceptor catches 403 → shows toast notification
- `AuthContext` exposes: `user`, `isAuthenticated`, `isAdmin`, `hasLevel`, `login`, `register`, `logout`, `selectLevel`

### Role-Based Routing
```
/login, /register          → Public (anyone)
/select-level              → requireAuth (no level check)
/dashboard, /units, etc.   → requireAuth + requireLevel
/admin/**                  → requireAuth + requireAdmin (role === "Admin")
```

### Freemium / Paywall
- Units with `requiresPremium: true` show a lock overlay
- Clicking a locked unit opens `PaywallModal`
- After successful payment, user's `isPremium` flag is updated

### Real-Time Chat (SignalR)
- `useChat(roomId)` manages the hub connection lifecycle
- `ChatSidebar` slides in from the right edge (collapsible drawer)
- Auto-opens when user starts watching a video or takes a quiz
- `roomId` can be dynamic (set to unit ID for unit-specific rooms)

### Flashcards
- CSS 3D flip animation (no JS library needed)
- Correct / Again buttons call `flashcardService.markResult` for spaced repetition tracking

## Backend CORS Configuration

Your .NET backend must allow the frontend origin:

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:3000", "https://yourdomain.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()); // required for SignalR
});

app.UseCors("Frontend");
```

## SignalR Hub (Expected Server-Side)

```csharp
public class ChatHub : Hub
{
    public async Task JoinRoom(string roomId) =>
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

    public async Task SendMessage(SendMessageDto dto) =>
        await Clients.Group(dto.RoomId).SendAsync("ReceiveMessage", new {
            userId   = Context.UserIdentifier,
            userName = Context.User?.Identity?.Name,
            content  = dto.Content,
            sentAt   = DateTime.UtcNow,
        });
}
```

## Expected API Response Shapes

### Auth
```json
POST /api/auth/login
→ { "token": "eyJ...", "user": { "id", "firstName", "lastName", "email", "role", "levelId", "englishLevel", "isPremium", "streak" } }
```

### Units
```json
GET /api/units
→ { "units": [{ "id", "title", "levelName", "wordCount", "isCompleted", "thumbnailUrl", "requiresPremium" }] }

GET /api/units/:id
→ { "unit": { ...all fields, "videoUrl", "posterUrl", "vocabulary": [], "quizId" } }
```

### Quiz
```json
GET /api/quiz/unit/:unitId
→ { "questions": [{ "id", "text", "options": [{ "id", "text" }] }] }

POST /api/quiz/:quizId/submit
→ { "score", "correctAnswers", "totalQuestions" }
```

## Production Build

```bash
npm run build
# Output in /dist — deploy to any static host (Vercel, Netlify, S3+CloudFront, etc.)
```

For Nginx:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
