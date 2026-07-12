# Advanced Search & Filtering System

## Overview

The search and filtering system allows users to quickly find and filter their e-waste pickup history with powerful search capabilities.

## Features

- 🔍 **Full-text Search** - Search across device names, categories, addresses, and notes
- 🏷️ **Filter Chips** - Visual display of active filters
- 📊 **Filter Panel** - Collapsible panel with status, category, condition, and date filters
- 📄 **Paginated Results** - Navigate through large result sets
- ✨ **Match Highlighting** - See where your search terms match
- 📱 **Responsive Design** - Works on all devices

## File Structure

```
lib/
└── search/
    ├── types.ts              # TypeScript types and constants
    └── query-builder.ts      # Database query logic

components/
└── search/
    ├── search-bar.tsx        # Search input with debounce
    ├── filter-panel.tsx      # Collapsible filter panel
    ├── filter-chips.tsx      # Active filter indicators
    └── search-results.tsx    # Results list with pagination

app/
├── dashboard/
│   └── search/
│       └── page.tsx          # Dedicated search page
└── api/
    └── search/
        ├── route.ts          # Search API endpoint
        └── stats/
            └── route.ts      # Statistics API endpoint
```

## Usage

### Accessing Search

Navigate to `/dashboard/search` to access the full search interface.

### Search Features

#### Text Search
Type in the search bar to search across:
- Device names (e.g., "iPhone", "laptop")
- Categories (e.g., "Phones", "Computers")
- Addresses
- Notes

#### Filters
Click "Filters" to expand the filter panel:

**Status Filters:**
- Scheduled
- Completed
- Cancelled

**Category Filters:**
- Dynamic based on your pickups
- Shows count for each category

**Condition Filters:**
- Working
- Broken
- Damaged
- Old/Outdated

**Date Range:**
- Select start and end dates
- Filter pickups within a specific time period

**Sort Options:**
- Sort by Date, Device Name, or Status
- Toggle ascending/descending order

#### Filter Chips
Active filters appear as colored chips above the results. Click the X to remove individual filters or "Clear all" to reset.

### Pagination
Navigate through results using the pagination controls at the bottom.

## API Reference

### POST /api/search

Search pickups with filters.

**Request Body:**
```json
{
  "filters": {
    "query": "iPhone",
    "status": ["completed"],
    "categories": ["Phones"],
    "condition": ["working"],
    "dateFrom": "2024-01-01",
    "dateTo": "2024-12-31",
    "sortBy": "date",
    "sortOrder": "desc"
  },
  "page": 1,
  "limit": 10
}
```

**Response:**
```json
{
  "results": [...],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### GET /api/search/stats

Get search statistics for filters.

**Response:**
```json
{
  "byStatus": {
    "scheduled": 5,
    "completed": 20,
    "cancelled": 3
  },
  "byCategory": {
    "Phones": 15,
    "Computers": 10,
    "Other": 3
  },
  "byCondition": {
    "working": 18,
    "broken": 8,
    "damaged": 2
  },
  "totalPickups": 28
}
```

## Customization

### Adding New Filter Types

1. Add to `lib/search/types.ts`:
   ```tsx
   export const NEW_FILTER_OPTIONS = [
     { value: "option1", label: "Option 1" },
     { value: "option2", label: "Option 2" },
   ]
   ```

2. Update `SearchFilters` interface:
   ```tsx
   export interface SearchFilters {
     // ... existing filters
     newFilter: string[]
   }
   ```

3. Add filter logic in `query-builder.ts`

### Customizing Search Fields

Edit the `searchPickups` function in `query-builder.ts` to:
- Add/remove searchable fields
- Change search behavior
- Add fuzzy matching

### Styling

All components use Tailwind CSS classes. Customize by:
- Modifying color classes in filter chips
- Adjusting spacing in layout components
- Changing border/shadow styles

## Performance Notes

- Search is debounced (300ms) to reduce API calls
- Pagination limits results to 50 per page maximum
- Database queries use indexes for fast lookups
- Stats are cached and fetched separately

## Future Enhancements

Potential improvements:
- [ ] Client-side search for instant results
- [ ] Search history and saved searches
- [ ] Advanced date range picker
- [ ] Export search results
- [ ] Search suggestions/autocomplete
- [ ] Fuzzy matching for typo tolerance
