# FinTrack — Payment Transaction Dashboard

A small Angular dashboard for viewing, searching, filtering, checking, and viewing payment transactions.

The UI follows the provided Figma design as the main visual reference, with some adjustments for responsiveness and accessibility.

## Requirements

The project was developed and tested with:

```text
Angular CLI       : 22.1.5
Angular           : 22.1.3
Node.js           : 22.23.2
Package Manager   : npm 10.9.8
```

## Run the application

Clone the repository:

```bash
git clone https://github.com/Mohitupa/FinTrack-assignment.git
cd FinTrack-assignment
```

## Run the application

```bash
npm install
ng serve
````

Open `http://localhost:4200`.

Create a production build:

```bash
npm run build
```

## Features

* 18 mock transactions with different statuses, payment methods, amounts, and dates.
* Search by transaction ID or customer name.
* Status filter that works together with search.
* Summary cards for displayed transactions, successful transactions, pending transactions, and successful amount.
* Pagination with 5 transactions per page.
* Check Status action for pending transactions.
* Independent loading and error state for each status check.
* Transaction details modal with loading, success, error, and retry states.
* Responsive transaction layout for smaller screens.
* Keyboard-accessible modal with focus management.
* URL query parameters for search and status filters.

## Project Structure

```text
src/
├── app/
│   ├── app.config.ts
│   │   # Application-level Angular configuration.
│   │
│   ├── app.routes.ts
│   │   # Defines the application routes, including the transactions page.
│   │
│   ├── app.ts
│   │   # Root Angular component.
│   │
│   ├── app.html
│   │   # Root component template.
│   │
│   ├── app.scss
│   │   # Styles for the root component.
│   │
│   ├── core/
│   │   # Application data, models, services, and transaction-related logic.
│   │
│   │   ├── constants/
│   │   │   └── app.constants.ts
│   │   │       # Search debounce time, mock API delay, and failure rates.
│   │   │
│   │   ├── mock-data/
│   │   │   └── transactions.mock.ts
│   │   │       # Mock transaction records used by the mock API service.
│   │   │
│   │   ├── models/
│   │   │   ├── transaction.model.ts
│   │   │   │   # Transaction types, status types, and status-specific
│   │   │   │   # transaction detail models.
│   │   │   │
│   │   │   └── transaction-ui-state.model.ts
│   │   │       # Types for per-row loading and error state.
│   │   │
│   │   ├── services/
│   │   │   ├── transaction-api.service.ts
│   │   │   │   # Mock API layer. Returns transactions and simulates
│   │   │   │   # delays, failures, details, and status checks.
│   │   │   │
│   │   │   └── transaction-store.service.ts
│   │   │       # Holds transaction and UI state and handles search,
│   │   │       # filtering, status updates, and list loading.
│   │   │
│   │   └── utils/
│   │       ├── transaction-display.utils.ts
│   │       │   # Maps payment method values to their display labels.
│   │       │
│   │       ├── transaction-filter.utils.ts
│   │       │   # Search and status-filtering logic.
│   │       │
│   │       └── transaction-summary.utils.ts
│   │           # Calculates the values shown in the summary cards.
│   │
│   ├── features/
│   │   └── transactions/
│   │       # Contains the UI for the transaction dashboard.
│   │
│   │       ├── components/
│   │       │   ├── transaction-summary/
│   │       │   │   # Displays total, successful, pending, and
│   │       │   │   # successful-amount summary cards.
│   │       │   │
│   │       │   ├── transaction-filters/
│   │       │   │   # Search field and status filter controls.
│   │       │   │
│   │       │   ├── transaction-table/
│   │       │   │   # Displays the transaction list and coordinates
│   │       │   │   # transaction rows.
│   │       │   │
│   │       │   ├── transaction-row/
│   │       │   │   # Displays one transaction and its available actions.
│   │       │   │
│   │       │   └── transaction-details-modal/
│   │       │       # Accessible modal used to load and display
│   │       │       # transaction details.
│   │       │
│   │       ├── transactions.component.ts
│   │       │   # Main page component. Connects the UI components
│   │       │   # with the transaction store.
│   │       │
│   │       ├── transactions.component.html
│   │       │   # Dashboard page layout and UI states.
│   │       │
│   │       └── transactions.component.scss
│   │           # Dashboard page styles.
│   │
│   └── shared/
│       # Reusable UI components that are not specific to transactions.
│
│       └── components/
│           ├── modal/
│           │   # Generic accessible modal shell.
│           │
│           ├── loading-spinner/
│           │   # Reusable loading indicator.
│           │
│           ├── status-badge/
│           │   # Displays transaction status consistently.
│           │
│           ├── empty-state/
│           │   # Displays empty and no-results states.
│           │
│           └── pagination/
│               # Reusable Previous/Next pagination controls.
│
├── assets/
│   └── icons/
│       # Icons used by the dashboard UI.
│
├── main.ts
│   # Application entry point.
│
├── index.html
│   # Main HTML document.
│
└── styles.scss
    # Global application styles.
```

The application keeps data handling in the `core` services and keeps transaction-specific UI components inside the `transactions` feature.

## Architecture

### TransactionApiService

`TransactionApiService` acts as the mock backend for the assignment.

It returns transaction data through RxJS Observables and adds a 500–1000 ms delay to simulate a real API. It also simulates occasional request failures and random status responses for the Check Status action.

### TransactionStoreService

`TransactionStoreService` manages the transaction list and UI state used by the transaction page.

It handles:

* Loading transactions.
* Search and status filter values.
* Filtering transactions.
* List loading/error state.
* Per-row loading/error state.
* Updating a transaction after a status check.

The store updates transactions immutably instead of changing the original transaction object or array.

The page component consumes the store's Observable data using Angular `toSignal()` and uses `computed()` for values derived from that state, such as pagination.

## RxJS

RxJS is mainly used for the search/filter flow and mock API requests.

* `BehaviorSubject` keeps the current transaction and filter state.
* `debounceTime()` waits until the user stops typing before processing a search.
* `distinctUntilChanged()` prevents processing the same search or status value repeatedly.
* `map()` transforms search values and creates filtered transaction and summary data.
* `combineLatest()` combines the current transactions, search value, and status filter.
* `catchError()` handles API errors and updates the relevant UI state.
* `delay()` simulates the mock API response time.
* `of()` creates successful mock responses.
* `throwError()` simulates failed requests.
* `takeUntilDestroyed()` cleans up the subscription used for URL filter synchronization.

## Concurrent Status Updates

Each transaction has its own UI state:

```ts
{
  checking: boolean;
  error: string | null;
}
```

The transaction ID is used to keep this state separate for each row.

When Check Status is clicked:

1. Only that row enters the loading state.
2. A mock API request is started.
3. The same row cannot start another request while it is already checking.
4. The returned status updates only the selected transaction.
5. Other rows can continue to be checked independently.
6. If the request fails, only that row displays the error.

The transaction list is not reloaded after a status update.

## Transaction Details Modal

The View Details action opens the modal immediately and loads the transaction details separately from the transaction list.

The modal handles:

* Loading state
* Loaded state
* Error state
* Retry action
* Status-specific information

For example, successful transactions can show a bank reference, failed transactions can show a failure reason, and refunded transactions can show refund information.

The modal also supports:

* Escape to close
* Keyboard focus trapping
* Moving focus into the modal when opened
* Returning focus to the View Details button when closed
* A visible Close button

## Summary and Filtering

The summary is calculated from the currently displayed transactions.

This means the summary changes automatically when:

* The search value changes.
* The status filter changes.
* A transaction status is updated.

The same filtered transaction data is also used for pagination and the transaction table.

## Responsive Design and Accessibility

The dashboard follows the Figma visual direction for the overall layout, typography, spacing, cards, filters, table, and status badges.

The layout is adapted for smaller screens instead of copying the desktop design exactly.

Accessibility considerations include:

* Labels for form controls.
* Native buttons for actions.
* Keyboard-accessible controls.
* Visible focus states.
* Accessible modal dialog.
* Escape-to-close support.
* Status text in addition to status colors.
* Semantic HTML where appropriate.
* Accessible loading and error states.

## Figma Deviations

The implementation follows the overall Figma direction but is not a pixel-perfect copy.

A few intentional changes were made:

* The status filter contains all five statuses required by the assignment.
* Pagination was added to keep the transaction list manageable.
* Summary values are calculated from the current transaction data rather than using static values from the design.
* The transaction list adapts to smaller screens.
* The profile image is static because account functionality is outside the scope of the assignment.

## Bonus Feature

Bonus Option 1 is implemented: search text and the selected status are stored in the URL.

Example:

```text
/transactions?search=acme&status=SUCCESS
```

Refreshing or sharing the URL preserves the selected filters.

Empty search and the `ALL` status are omitted from the URL.

## Future Improvements

With more development time, I would consider:

* Adding transaction sorting by date, amount, or customer name.
* Adding a refresh action for the transaction list.
* Replacing the mock API with real HTTP endpoints.
* Adding more automated tests for the store and transaction components.



