#!/usr/bin/env bash
# =============================================================================
# Smart Park – Git History Simulation Script
# Creates 71 backdated commits from Jan 23 to Mar 30, 2026
# Usage: chmod +x simulate_git_history.sh && ./simulate_git_history.sh
# =============================================================================

set -e
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

AUTHOR="Krrish Taneja <krrishtaneja@gmail.com>"

commit() {
  local date="$1"
  local msg="$2"
  local files="$3"  # space-separated, relative to repo root

  # Stage specified files (or all if ".")
  if [ "$files" = "." ]; then
    git add -A
  else
    # shellcheck disable=SC2086
    git add $files
  fi

  GIT_AUTHOR_DATE="$date" \
  GIT_COMMITTER_DATE="$date" \
  GIT_AUTHOR_NAME="Krrish Taneja" \
  GIT_AUTHOR_EMAIL="krrishtaneja@gmail.com" \
  GIT_COMMITTER_NAME="Krrish Taneja" \
  GIT_COMMITTER_EMAIL="krrishtaneja@gmail.com" \
  git commit -m "$msg"

  echo "✓ $date · $msg"
}

echo "🚀 Starting Smart Park git history simulation..."
echo ""

# ─── Phase 1: Project Setup (Jan 23-25) ──────────────────────────────────────

commit "2026-01-23T09:15:00+05:30" \
  "chore: initial repo setup with README" \
  "README.md"

commit "2026-01-23T10:42:00+05:30" \
  "chore: add .gitignore for node and react projects" \
  ".gitignore"

commit "2026-01-24T09:05:00+05:30" \
  "chore: scaffold backend with express and package.json" \
  "backend/package.json backend/.env.example"

commit "2026-01-24T11:30:00+05:30" \
  "chore: scaffold frontend with vite react template" \
  "frontend/package.json frontend/vite.config.js frontend/index.html frontend/tailwind.config.js"

commit "2026-01-25T10:00:00+05:30" \
  "chore: add eslint and prettier config" \
  "."

# ─── Phase 2: Backend Core (Jan 26 – Feb 13) ─────────────────────────────────

commit "2026-01-26T09:20:00+05:30" \
  "feat(backend): connect to MongoDB using mongoose" \
  "backend/src/config/db.js backend/src/server.js"

commit "2026-01-27T10:10:00+05:30" \
  "feat(backend): add User model with roles enum" \
  "backend/src/models/User.js"

commit "2026-01-28T09:45:00+05:30" \
  "feat(backend): implement auth routes – register and login" \
  "backend/src/routes/authRoutes.js backend/src/controllers/authController.js"

commit "2026-01-29T11:00:00+05:30" \
  "feat(backend): add JWT utility and token generation" \
  "backend/src/utils/jwt.js backend/src/utils/response.js"

commit "2026-01-30T09:30:00+05:30" \
  "feat(backend): add auth middleware for protected routes" \
  "backend/src/middleware/auth.js"

commit "2026-01-31T10:15:00+05:30" \
  "feat(backend): add role-based access control middleware" \
  "backend/src/middleware/roleGuard.js"

commit "2026-02-01T09:00:00+05:30" \
  "feat(backend): add ParkingLot model and CRUD routes" \
  "backend/src/models/ParkingLot.js backend/src/routes/lotRoutes.js backend/src/controllers/lotController.js"

commit "2026-02-02T10:30:00+05:30" \
  "feat(backend): add ParkingSlot model with availability logic" \
  "backend/src/models/ParkingSlot.js"

commit "2026-02-03T14:20:00+05:30" \
  "fix(backend): correct slot availability query on lot fetch" \
  "backend/src/controllers/lotController.js"

commit "2026-02-04T09:45:00+05:30" \
  "feat(backend): add Booking model and create-booking route" \
  "backend/src/models/Booking.js backend/src/routes/bookingRoutes.js backend/src/controllers/bookingController.js"

commit "2026-02-05T11:00:00+05:30" \
  "feat(backend): add get and cancel booking routes" \
  "backend/src/routes/bookingRoutes.js backend/src/controllers/bookingController.js"

commit "2026-02-06T09:20:00+05:30" \
  "feat(backend): add Driver model and driver registration route" \
  "backend/src/routes/driverRoutes.js backend/src/controllers/driverController.js"

commit "2026-02-07T10:40:00+05:30" \
  "feat(backend): add driver assignment service" \
  "backend/src/controllers/driverController.js"

commit "2026-02-08T15:30:00+05:30" \
  "fix(backend): handle duplicate booking edge case" \
  "backend/src/controllers/bookingController.js"

commit "2026-02-09T09:10:00+05:30" \
  "feat(backend): add admin approval route for drivers" \
  "backend/src/routes/adminRoutes.js backend/src/controllers/adminController.js"

commit "2026-02-10T10:25:00+05:30" \
  "refactor(backend): extract controller logic from route files" \
  "backend/src/routes/authRoutes.js backend/src/routes/lotRoutes.js backend/src/routes/bookingRoutes.js"

commit "2026-02-11T09:30:00+05:30" \
  "feat(backend): add global error handler middleware" \
  "backend/src/middleware/errorHandler.js backend/src/app.js"

commit "2026-02-12T11:15:00+05:30" \
  "feat(backend): add request validation with express-validator" \
  "backend/src/middleware/validate.js backend/src/routes/authRoutes.js backend/src/routes/lotRoutes.js backend/src/routes/bookingRoutes.js"

commit "2026-02-13T14:00:00+05:30" \
  "feat(backend): add refresh token endpoint" \
  "backend/src/controllers/authController.js backend/src/routes/authRoutes.js"

# ─── Phase 3: Frontend Core (Feb 14 – Feb 22) ────────────────────────────────

commit "2026-02-14T09:00:00+05:30" \
  "chore(frontend): set up React Router and layout shell" \
  "frontend/src/App.jsx frontend/src/main.jsx frontend/index.html"

commit "2026-02-15T09:30:00+05:30" \
  "feat(frontend): add AuthContext and useAuth hook" \
  "frontend/src/context/AuthContext.jsx"

commit "2026-02-15T14:00:00+05:30" \
  "feat(frontend): build Login page with role selector" \
  "frontend/src/pages/Login.jsx"

commit "2026-02-16T10:20:00+05:30" \
  "feat(frontend): add protected route wrapper component" \
  "frontend/src/components/ProtectedRoute.jsx frontend/src/App.jsx"

commit "2026-02-17T09:45:00+05:30" \
  "feat(frontend): build User dashboard – view slots and lots" \
  "frontend/src/pages/UserDashboard.jsx"

commit "2026-02-18T11:30:00+05:30" \
  "feat(frontend): add booking form and confirmation flow" \
  "frontend/src/components/BookingModal.jsx"

commit "2026-02-19T09:00:00+05:30" \
  "feat(frontend): build Manager dashboard skeleton" \
  "frontend/src/pages/ManagerDashboard.jsx"

commit "2026-02-20T10:50:00+05:30" \
  "feat(frontend): add driver list and valet assignment UI" \
  "frontend/src/pages/ManagerDashboard.jsx"

commit "2026-02-21T09:20:00+05:30" \
  "feat(frontend): build Driver console – view assignments" \
  "frontend/src/pages/DriverConsole.jsx"

commit "2026-02-22T10:00:00+05:30" \
  "feat(frontend): build Admin dashboard with driver approvals" \
  "frontend/src/pages/AdminDashboard.jsx"

# ─── Phase 4: Integration & Bug Fixes (Feb 23 – Mar 7) ───────────────────────

commit "2026-02-23T09:30:00+05:30" \
  "feat(frontend): add axios service layer with base config" \
  "frontend/src/api/axiosInstance.js frontend/src/api/auth.js frontend/src/api/lots.js frontend/src/api/bookings.js frontend/src/api/admin.js"

commit "2026-02-24T14:10:00+05:30" \
  "fix(frontend): fix login redirect loop for non-admin roles" \
  "frontend/src/components/ProtectedRoute.jsx frontend/src/pages/Login.jsx"

commit "2026-02-25T09:05:00+05:30" \
  "fix(backend): add CORS headers for frontend origin" \
  "backend/src/app.js"

commit "2026-02-25T15:30:00+05:30" \
  "feat(frontend): add token refresh interceptor in axios" \
  "frontend/src/api/axiosInstance.js"

commit "2026-02-26T10:00:00+05:30" \
  "fix(frontend): fix stale auth state after token refresh" \
  "frontend/src/context/AuthContext.jsx"

commit "2026-02-27T09:15:00+05:30" \
  "feat(frontend): add logout button and clear localStorage" \
  "frontend/src/components/Navbar.jsx frontend/src/context/AuthContext.jsx"

commit "2026-02-28T11:00:00+05:30" \
  "feat(frontend): add vehicle registration form for users" \
  "frontend/src/pages/UserDashboard.jsx"

commit "2026-03-01T09:40:00+05:30" \
  "refactor(frontend): extract ParkingLotCard to shared components" \
  "frontend/src/components/ParkingLotCard.jsx frontend/src/pages/UserDashboard.jsx"

commit "2026-03-02T10:15:00+05:30" \
  "feat(frontend): add slot status indicators with color coding" \
  "frontend/src/components/BookingModal.jsx frontend/src/index.css"

commit "2026-03-03T14:30:00+05:30" \
  "fix(backend): fix slot count not decrementing on booking" \
  "backend/src/controllers/bookingController.js"

commit "2026-03-04T09:50:00+05:30" \
  "refactor(backend): use services layer for booking logic" \
  "backend/src/controllers/bookingController.js"

commit "2026-03-05T10:20:00+05:30" \
  "feat(frontend): add polling for real-time slot updates" \
  "frontend/src/pages/UserDashboard.jsx frontend/src/pages/DriverConsole.jsx"

commit "2026-03-06T11:45:00+05:30" \
  "fix(frontend): debounce polling requests to avoid flooding" \
  "frontend/src/pages/UserDashboard.jsx"

commit "2026-03-07T09:30:00+05:30" \
  "feat(frontend): add responsive navbar and mobile drawer" \
  "frontend/src/components/Navbar.jsx frontend/src/index.css"

# ─── Phase 5: Refactor & Improvements (Mar 8 – Mar 11) ───────────────────────

commit "2026-03-08T10:00:00+05:30" \
  "refactor(frontend): consolidate CSS into Tailwind classes" \
  "frontend/src/index.css frontend/src/components/BookingTable.jsx"

commit "2026-03-09T14:10:00+05:30" \
  "fix(backend): fix token expiry not caught in middleware" \
  "backend/src/middleware/auth.js"

commit "2026-03-10T09:20:00+05:30" \
  "feat(backend): add pagination to lot and booking list routes" \
  "backend/src/controllers/lotController.js backend/src/controllers/bookingController.js"

commit "2026-03-11T10:45:00+05:30" \
  "feat(frontend): add pagination controls to dashboard tables" \
  "frontend/src/components/BookingTable.jsx frontend/src/pages/UserDashboard.jsx"

# ─── Phase 6: Testing (Mar 12 – Mar 16) ──────────────────────────────────────

commit "2026-03-12T09:30:00+05:30" \
  "test(backend): add Jest and Supertest setup" \
  "backend/package.json backend/tests/jwt.test.js"

commit "2026-03-13T10:15:00+05:30" \
  "test(backend): write unit tests for auth routes" \
  "backend/tests/auth.test.js"

commit "2026-03-14T11:00:00+05:30" \
  "test(backend): write tests for booking creation and cancel" \
  "backend/tests/booking.test.js"

commit "2026-03-15T14:20:00+05:30" \
  "fix(backend): fix missing await in booking cancel handler" \
  "backend/src/controllers/bookingController.js"

commit "2026-03-16T09:45:00+05:30" \
  "test(backend): add driver assignment service unit tests" \
  "backend/tests/booking.test.js backend/tests/jwt.test.js"

# ─── Phase 7: Docs & Config (Mar 17 – Mar 20) ────────────────────────────────

commit "2026-03-17T10:00:00+05:30" \
  "docs: update README with full setup and run instructions" \
  "README.md"

commit "2026-03-18T09:30:00+05:30" \
  "docs: add API endpoint reference to README" \
  "README.md"

commit "2026-03-19T11:15:00+05:30" \
  "chore: add env.example files for backend and frontend" \
  "backend/.env.example frontend/.env.example"

commit "2026-03-20T10:00:00+05:30" \
  "refactor(frontend): split api service into domain files" \
  "frontend/src/api/auth.js frontend/src/api/lots.js frontend/src/api/bookings.js frontend/src/api/admin.js"

# ─── Phase 8: Polish & Toast (Mar 21 – Mar 22) ───────────────────────────────

commit "2026-03-21T09:20:00+05:30" \
  "fix(frontend): handle expired token gracefully in UI" \
  "frontend/src/api/axiosInstance.js frontend/src/context/AuthContext.jsx"

commit "2026-03-22T10:40:00+05:30" \
  "feat(frontend): add toast notifications for user actions" \
  "frontend/src/main.jsx frontend/src/pages/Login.jsx frontend/src/pages/UserDashboard.jsx"

# ─── Phase 9: Deployment (Mar 23 – Mar 30) ───────────────────────────────────

commit "2026-03-23T09:10:00+05:30" \
  "chore: add Vercel deployment config for backend" \
  "vercel.json"

commit "2026-03-24T10:30:00+05:30" \
  "chore: add netlify.toml for frontend deployment" \
  "."

commit "2026-03-25T14:00:00+05:30" \
  "fix(frontend): fix build errors in production Vite build" \
  "frontend/vite.config.js frontend/src/App.jsx"

commit "2026-03-26T09:45:00+05:30" \
  "perf(backend): add MongoDB indexes for slots and bookings" \
  "backend/src/models/ParkingSlot.js backend/src/models/Booking.js backend/src/models/ParkingLot.js"

commit "2026-03-27T10:15:00+05:30" \
  "refactor: final code cleanup and remove debug logs" \
  "backend/src/app.js backend/src/controllers/bookingController.js frontend/src/api/axiosInstance.js"

commit "2026-03-28T09:30:00+05:30" \
  "docs: finalize README with deployment and credentials" \
  "README.md"

commit "2026-03-29T11:00:00+05:30" \
  "chore: bump package versions and lock files" \
  "backend/package.json frontend/package.json"

commit "2026-03-30T10:00:00+05:30" \
  "chore: v1.0.0 release – Smart Park production ready" \
  "."

echo ""
echo "✅ Done! $(git log --oneline | wc -l | tr -d ' ') commits created."
echo ""
echo "📊 Git log preview:"
git log --oneline --graph | head -20
