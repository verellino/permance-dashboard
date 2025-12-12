# BACKEND SPEC

**Posts Collection:**

**Fields WE update (backend jobs):**

- **url** (string) - required, unique identifier
- **post_id** (string) - extracted from URL
- **username** (string) - the account that posted it
- **platform** (string: Instagram, TikTok, YouTube) - auto-detected from URL
- **post_date** (datetime) - when post was created
- **views** (number)
- **likes** (number)
- **comments** (number)
- **shares** (number)
- **engagement_rate** (percentage)
- **base_format** (string: Video/Reels, Single Photo, Carousel) - auto-detected
- **content_type** (string: Video – Short (9:16), Video – Long (16:9), Photo – Single, Carousel – Image/Text) - auto-detected
- **idea_concept** (text) - AI generated
- **category** (string) - AI generated
- **subcategory** (array of strings) - AI generated, multi-label
- **reel_style** (string: Talking Head, Lifestyle/B-roll, Hybrid, Other) - AI generated, only for videos
- **processing_status** (string: pending, processing, completed, failed)
- **last_updated** (datetime) - last stats update
- **created_at** (datetime)
- **updated_at** (datetime)

**Fields FRONTEND stores (for their queries/linking):**

- **is_trial** (boolean) - true for trial reels, false for published posts
- **client** (string) - which client this post belongs to
- **editor** (string) - which clipper/editor created this
- **type** (string) - e.g., "Main Account", "Clip / Side Account"
- **belongs_to** (array of strings) - e.g., ["Finance", "Clipping"]
- **finance_item_id** (string) - to group posts under same finance entry
- **assignee** (string) - who's assigned to this content
- **added_by** (string) - who added this trial reel
- **added_date** (datetime) - when trial reel was added
- Any other field frontend needs for their business logic

---

**Users Collection:**

**Fields WE update (backend jobs):**

- **url** (string) - required, unique identifier
- **username** (string) - required
- **platform** (string: Instagram, TikTok, YouTube)
- **followers** (number)
- **following** (number)
- **total_media_count** (number)
- **video_count** (number) - reels/shorts count
- **photo_count** (number)
- **carousel_count** (number)
- **total_views** (number) - aggregated from all posts
- **total_likes** (number) - aggregated from all posts
- **total_comments** (number) - aggregated from all posts
- **total_shares** (number) - aggregated from all posts
- **avg_views** (number)
- **avg_engagement_rate** (percentage)
- **views_last_7d** (number)
- **views_last_30d** (number)
- **views_last_90d** (number)
- **views_last_365d** (number)
- **views_last_calendar_week** (number)
- **views_last_calendar_month** (number)
- **views_since_1st_of_month** (number)
- **followers_since_1st_of_month** (number)
- **followers_since_monday** (number)
- **followers_since_start_of_growth** (number) - calculated from earliest snapshot
- **full_name** (string)
- **biography** (text)
- **profile_pic_url** (string)
- **is_verified** (boolean)
- **is_private** (boolean)
- **tracking_enabled** (boolean) - controls whether we check for new posts
- **disabled_reason** (string) - why scraping is disabled
- **last_tracked_at** (datetime) - last time we checked for new posts
- **last_stats_update** (datetime) - last time stats were updated
- **processing_status** (string: pending, processing, completed, failed)
- **created_at** (datetime)
- **updated_at** (datetime)

**Payment-related fields WE update (from** `process_creator_payments`):

- **this_month_posting_volume** (number)
- **last_month_posting_volume** (number)
- **this_month_views_generated** (number)
- **last_month_views_generated** (number)
- **kpi_status** (string)

**Fields FRONTEND stores (for their queries/linking):**

- **base_monthly_pay** (number)
- **amount_due_eom** (number)
- **expected_monthly_posting_volume** (number)
- **client** (string) - which client this user belongs to
- **editor** (string) - which clipper/editor manages this account
- **type** (string) - e.g., "Main Account", "Clip / Side Account"
- **belongs_to** (array of strings) - e.g., ["Finance", "Clients", "Clipping"]
- **finance_item_id** (string) - to group multiple user URLs under same finance entry
- **started_date** (datetime) - when they started
- **last_paid_date** (datetime)
- **paid_amount** (number)
- **phone_number** (string)
- **payment_method** (string)
- Any other field frontend needs for their business logic

---

## ✅ **1. Page Structure You Should Build (Based on Backend Fields)**

Your frontend must expose **3 major functional areas**:

---

## **A. POSTS MODULE (Trial + Published)**

This is your biggest module.

### **Pages to build**

1. **Trial Reels Dashboard**
2. **All Published Posts**
3. **Posts by Board (Finance, Clip, Client, etc.)**
4. **Post Detail Page**
5. **Post Performance History (AI, stats timeline)**

### **Primary queries to support**

- All posts where `is_trial = true`
- All posts where `is_trial = false`
- Posts grouped by `belongs_to` (Finance, Clipping, Clients, etc.)
- Posts by user URL (`editor` or `client`)
- Posts by platform
- Posts by category / subcategory / reel_style
- Posts by processing_status (AI job status)

### **Minimum frontend model**

You fully manage these:

```ts
client;
editor;
type;
belongs_to;
finance_item_id;
is_trial;
assignee;
added_by;
added_date;
```

Backend manages stats, AI, metadata.

---

## **B. USERS MODULE (Creators / Accounts)**

### **Pages to build here**

1. **Creators List**
2. **Creator Detail Page**

   - Profile info
   - Performance metrics
   - Recent posts

3. **Creator Finance Dashboard**

   - Posting volume
   - Views generated
   - Payment status

4. **Creator Growth History**

   - time-series graph using user_stats_history

### **Frontend-driven fields**

- base_monthly_pay
- amount_due_eom
- expected_monthly_posting_volume
- editor
- client
- belongs_to
- started_date
- finance_item_id
- payment_method
- phone_number

Backend manages scraped/aggregated performance fields.

---

## **C. OPERATIONS MODULE (Internal ops)**

### **Pagess to build**

1. **Post AI Processing Monitor**

   - View posts with processing_status: pending, processing, failed

2. **New Post Detector Activity**

   - “Latest new posts detected” feed

3. **Job Status Dashboard**

   - Show last run timestamps (from health endpoint)

4. **Error / Uptime Dashboard**

   - Failed URLs
   - Disabled users
   - DLQ counts

This is how your team monitors system reliability.

---

## **D. FINANCE MODULE**

### **Pages**

1. Finance Items (Grouped by finance_item_id)
2. Creator Payment View
3. Post Monetization Breakdown

---

## **E. SETTINGS MODULE**

- Users & Roles
- Clients
- Editors
- Boards (Finance board, Clipping board, Client board mapping)
- API Keys

---

## 🚀 **2. How to Handle TRIAL REELS (Frontend)**

The backend gave you a simple rule:

> Trial reels are just posts with `is_trial = true`

### Which means your frontend should do this

### **CREATE FLOW**

When user adds trial reel:

- Set `is_trial = true`
- Set `client`, `editor`, `assignee`, `belongs_to`, `type`, `added_by`, `added_date`
- Save into posts collection

### **VIEW FLOW**

Create a page: **/trial-reels**

Query:

```bash
GET /posts?is_trial=true&client={clientId}
```

### **PUBLISH FLOW**

When client approves the trial:

- Set `is_trial = false`
- Keep all other fields
- AI processors + stats jobs will now treat it as a real post

### **ARCHIVE FLOW**

If trial is rejected:

- Mark status: `processing_status = failed`
- Or delete

### **Frontend Tables Needed**

- Trial Reels Table (ShadCN)
- Trial Detail Page
- Approve / Reject actions

Straightforward.

---

## 🚀 **3. What Your Frontend Should Actually RENDER (Important)**

These aren't just pages — they are **data views**.

## **A. Posts Table (ShadCN)**

Columns derived from backend:

- Thumbnail
- Platform
- Username
- Views
- Likes
- Engagement Rate
- Base Format
- Content Type
- Category
- Subcategories
- Reel Style
- Assignee
- Client
- Belongs To
- AI Status
- Last Updated
- Added By (if trial)

All mapped directly to backend fields.

---

## **B. Creator Table**

Fields to show:

- Profile Picture
- Username
- Platform
- Followers
- Avg Views
- Posts Last 7/30/90 days
- Tracking Enabled
- Disabled Reason
- Editor
- Client
- Finance Item

---

## **C. Finance Table**

Fields:

- Finance Item ID
- Creator count
- Monthly posting volume
- Views generated
- Amount Due
- Last Paid Date
- Payment Method

---

## **D. Job Status + Uptime Table**

- Job name
- Last run
- Next run
- Last error
- DLQ count

---

## 🧱 **4. Folder Structure Recommendation (Next.js App Router)**

```bash
app/
  posts/
    page.tsx
    [id]/
      page.tsx
    trial/
      page.tsx
  creators/
    page.tsx
    [id]/
      page.tsx
  finance/
    page.tsx
  operations/
    jobs/
      page.tsx
    errors/
      page.tsx
  settings/
    clients/
    editors/
    boards/
    roles/
  components/
    data-tables/
    charts/
    forms/
```

---

## ⭐ RECAP: What You Should Build in Frontend

### **1. Posts Module**

- Trial Reels
- Published Posts
- Post Details
- Post Insights

### **2. Users Module**

- Creator List
- Creator Details
- Finance View

### **3. Operations**

- AI Monitor
- New Post Detector Activity
- Uptime Monitor

### **4. Finance**

- Finance Items
- Payment Tracking

### **5. Settings**

- Clients
- Editors
- Boards & Mappings
- RBAC

---

If you want, I can now:

### 🔧 Build ShadCN data tables for ALL pages

### 📊 Create page wireframes

### 🧭 Build a full sidebar + routing tree

### 🧮 Generate example JSON schemas for both collections

### 🔍 Produce API endpoint design (REST or tRPC / Next.js server actions)

Just tell me what you want next.
