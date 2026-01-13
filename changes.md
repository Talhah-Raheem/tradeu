# TradeU - Changes & Roadmap

## Recent Changes (January 13, 2026)

### Phase 1: Authentication & Signup Fixes ✅

#### 1. Custom University Entry
**Problem:** Students from universities not in the predefined dropdown had no way to sign up.

**Solution:**
- Added conditional text input that appears when "Other" is selected
- Validates custom university name (minimum 2 characters)
- Stores custom value in database instead of "Other"

**Files Modified:**
- `src/app/signup/page.tsx`
  - Added `customUniversity` field to form state (line 17)
  - Added validation logic (lines 68-74)
  - Created conditional input field (lines 214-225)
  - Updated submission to use custom value (lines 107-109)

---

#### 2. Improved Duplicate Email Error Messaging
**Problem:** Users reported seeing "load failed" or generic errors when email already exists.

**Solution:**
- Enhanced error detection to identify duplicate email scenarios
- Changed message from generic to specific: "This email is already in use"
- Added fallback for other errors: "Sign up failed. Please try again."

**Files Modified:**
- `src/app/signup/page.tsx`
  - Updated error handling (lines 123-131)
  - Checks for keywords: "already", "exists", "registered"

---

#### 3. Password Reset Flow (CRITICAL FIX)
**Problem:** Forgot password sent email successfully, but reset link led to 404 page. Flow was completely broken.

**Solution:**
- Created missing `/reset-password` page with full functionality
- Implemented three UI states:
  1. Invalid/expired token error screen
  2. Password reset form with validation
  3. Success confirmation with auto-redirect
- Added password validation matching signup (8+ chars, uppercase, lowercase, number)
- Added `updatePassword()` API function for consistency

**Files Created:**
- `src/app/reset-password/page.tsx` (253 lines)
  - Token validation on page load
  - Password reset form
  - Error handling for expired/invalid tokens
  - Success state with 3-second redirect to login

**Files Modified:**
- `src/lib/api/users.ts`
  - Added `updatePassword()` function (lines 80-98)

---

## Testing Checklist (Requires Supabase Running)

### Signup Flow
- [ ] Test standard signup with predefined university (e.g., "UCLA")
- [ ] Test selecting "Other" option
  - [ ] Verify text input appears
  - [ ] Leave custom field empty - should show error
  - [ ] Enter 1 character - should show error
  - [ ] Enter valid university name - should work
- [ ] Test duplicate email error
  - [ ] Sign up with existing email
  - [ ] Verify message shows "This email is already in use"
- [ ] Test existing validations still work
  - [ ] Non-.edu email rejected
  - [ ] Weak password rejected
  - [ ] Password mismatch rejected

### Password Reset Flow
- [ ] Test forgot password page
  - [ ] Enter valid .edu email
  - [ ] Verify success message appears
  - [ ] Check email inbox for reset link
- [ ] Test reset password page
  - [ ] Click link from email
  - [ ] Verify redirects to `/reset-password` (not 404)
  - [ ] Enter new password (weak) - should show validation error
  - [ ] Enter valid password and confirm
  - [ ] Submit form
  - [ ] Verify success message appears
  - [ ] Verify auto-redirect to login after 3 seconds
- [ ] Test login with new password
  - [ ] Login should work with new password
  - [ ] Old password should no longer work
- [ ] Test error scenarios
  - [ ] Try accessing `/reset-password` without token - should show error
  - [ ] Try using expired token (if possible) - should show error

---

## Next Steps (High Priority)

### 1. Review System Implementation
**Current State:** All reviews are hardcoded/fake data

**What's Broken:**
- `src/app/profile/[id]/page.tsx` (lines 110-149) - Mock review data
- All users show fake 4.8 rating with identical reviews

**What Needs to Be Done:**
- Create reviews table in Supabase database
- Add `getReviews(userId)` API function in `src/lib/api/users.ts`
- Add `createReview(orderId, rating, comment)` API function
- Update profile page to fetch and display real reviews
- Calculate actual average rating from reviews
- Add review form after completed orders

**Files to Modify:**
- `src/app/profile/[id]/page.tsx` - Replace mock data with API calls
- `src/lib/api/users.ts` - Add review functions
- Database - Create reviews schema

---

### 2. Fix Hardcoded Seller Ratings
**Current State:** All sellers show 4.8 rating

**What's Broken:**
- `src/app/listings/[id]/page.tsx` (line 220) - Hardcoded 4.8 rating
- `src/app/profile/[id]/page.tsx` (line 102) - Hardcoded overall rating

**What Needs to Be Done:**
- Calculate rating from actual reviews
- Update listing detail to show seller's real rating
- Update profile to show user's real rating
- Handle users with no reviews (show "No rating yet")

**Files to Modify:**
- `src/app/listings/[id]/page.tsx`
- `src/app/profile/[id]/page.tsx`
- `src/lib/api/users.ts` - Add rating calculation

---

### 3. Fix Hardcoded Response Rate
**Current State:** All users show 95% response rate

**What's Broken:**
- `src/lib/api/users.ts` (line 37) - Hardcoded 95
- `src/app/profile/[id]/page.tsx` (line 21) - Hardcoded fallback

**What Needs to Be Done:**
- Implement actual calculation based on message data
- Calculate: (messages responded to / messages received) × 100
- Consider time window (e.g., within 24 hours)
- Handle edge cases (new users with no messages)

**Files to Modify:**
- `src/lib/api/users.ts` - Implement response rate calculation
- Potentially `src/lib/api/messages.ts` - Helper for response metrics

---

### 4. Error Handling Improvements
**Current State:** Several pages fail silently

**What's Broken:**
- Profile page - No error handling if API fails (lines 30-76)
- Orders page - No error state display
- Messages - Real-time subscription has no error recovery

**What Needs to Be Done:**
- Add error states to profile and orders pages
- Show error messages to users when API calls fail
- Add retry buttons for failed operations
- Implement reconnection logic for messaging subscription
- Show connection status indicator in messages

**Files to Modify:**
- `src/app/profile/[id]/page.tsx`
- `src/app/orders/page.tsx`
- `src/app/messages/page.tsx`

---

### 5. Image Upload Error Feedback
**Current State:** Image uploads fail silently

**What's Broken:**
- `src/lib/api/storage.ts` (lines 68-72, 179) - Returns `{ error: null }` even on failure
- Users don't know when images fail to upload

**What Needs to Be Done:**
- Return actual error from storage functions
- Show warning to user when upload fails
- Add retry mechanism for failed uploads
- Show upload progress indicators

**Files to Modify:**
- `src/lib/api/storage.ts`
- `src/app/listings/create/page.tsx`
- `src/app/profile/[id]/edit/page.tsx`

---

### 6. Performance - N+1 Query Fix
**Current State:** Loading seller listings makes N+1 database queries

**What's Broken:**
- `src/lib/api/listings.ts` (lines 135-191) - Checks orders table N times

**What Needs to Be Done:**
- Batch the sold listing checks into single query
- Use SQL join instead of N individual queries
- Significant performance improvement for profiles with many listings

**Files to Modify:**
- `src/lib/api/listings.ts` - Optimize `getListingsBySeller()`

---

## File Summary

### Files Modified This Session
| File | Lines Changed | Status |
|------|---------------|--------|
| `src/app/signup/page.tsx` | ~30 lines | ✅ Complete |
| `src/app/reset-password/page.tsx` | 253 lines (new) | ✅ Complete |
| `src/lib/api/users.ts` | ~18 lines | ✅ Complete |

### Files Requiring Changes Next
| File | Priority | Issue |
|------|----------|-------|
| `src/app/profile/[id]/page.tsx` | 🔴 High | Hardcoded reviews, ratings, response rate |
| `src/lib/api/users.ts` | 🔴 High | Need review functions, rating calc, response rate |
| `src/app/listings/[id]/page.tsx` | 🔴 High | Hardcoded seller rating |
| `src/app/orders/page.tsx` | 🟡 Medium | Missing error handling |
| `src/app/messages/page.tsx` | 🟡 Medium | No subscription error recovery |
| `src/lib/api/listings.ts` | 🟡 Medium | N+1 query performance issue |
| `src/lib/api/storage.ts` | 🟠 Low | Silent image upload failures |

---

## Notes
- All auth changes are backwards compatible
- No database schema changes made
- Existing user accounts continue to work
- Custom university entries use existing string field
- Password reset follows Supabase's standard security flow
