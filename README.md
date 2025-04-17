## Important Implementation Details

### Deposit Status Management

**Critical:** Properly updating deposit status is crucial for managing sBTC liquidity in the pool. The Styx protocol dynamically tracks available liquidity including pending transactions.

After transaction broadcast:
```typescript
// When transaction is successful
const updateResult = await styxSDK.updateDepositStatus({
  id: depositId,
  data: {
    btcTxId: txid,
    status: "broadcast",  // Mark as broadcast when TX is sent
  },
});
```

If the transaction fails:
```typescript
// When wallet interaction fails
await styxSDK.updateDepositStatus({
  id: depositId,
  data: {
    status: "canceled",  // Release the allocated liquidity back to the pool
  },
});
```

Failing to properly update deposit status can lead to:
- Liquidity accounting issues in the pool
- Poor user experience if available sBTC amounts are reported incorrectly

This repository demonstrates how to integrate the @faktoryfun/styx-sdk into a web application to enable trustless Bitcoin-to-Stacks deposits. The Styx protocol allows for rapid (1 Bitcoin block) deposits of BTC and receive sBTC (Bitcoin representation on Stacks) with no trusted intermediaries.

## Overview

The Styx protocol allows users to:
- Deposit BTC and receive sBTC (Bitcoin representation on Stacks) in a trustless manner
- Track deposit history and status
- View pool status and available capacity

This integration example shows a complete implementation with:
- Wallet connection (Leather and Xverse wallets supported)
- Deposit form with amount validation
- Transaction confirmation with fee selection
- Deposit history tracking
- Pool status monitoring

## Features

- **React/TypeScript** - Built with modern React patterns and full TypeScript support
- **Chakra UI** - Styled with the Chakra UI component library for a clean, responsive interface
- **React Query** - Data fetching and caching via React Query
- **Bitcoin Transaction Handling** - Complete BTC transaction creation, signing, and broadcasting
- **Wallet Integration** - Support for popular Bitcoin and Stacks wallets

## Key Components

### Bitcoin Deposit Component

The main Bitcoin deposit component (`BitcoinDeposit/index.tsx`) provides a tabbed interface for:
1. Deposit form - For initiating new deposits
2. My History - For viewing the user's deposit history
3. All Deposits - For viewing all deposits in the system

### Transaction Confirmation

The `TransactionConfirmation` component (`BitcoinDeposit/TransactionConfirmation.tsx`):
- Displays transaction details for user confirmation
- Allows selection of transaction fee priority
- Handles wallet-specific flows for transaction signing
- Manages the deposit lifecycle with the Styx SDK

### SDK Hooks

The example provides custom React hooks that encapsulate Styx SDK functionality:

```typescript
// Import the hooks in your components
import useSdkDepositHistory from "../hooks/useSdkDepositHistory";
import useSdkPoolStatus from "../hooks/useSdkPoolStatus";
import useSdkAllDepositsHistory from "../hooks/useSdkAllDepositsHistory";
import { useFormattedBtcPrice } from "../hooks/useSdkBtcPrice";
```

These hooks simplify integration and provide proper query caching via React Query:

- `useSdkPoolStatus` - Fetches the current pool status
- `useSdkBtcPrice` - Gets the current BTC price
- `useSdkDepositHistory` - Retrieves deposit history for a user
- `useSdkAllDepositsHistory` - Fetches all deposits in the system

## Setup and Installation

1. Clone this repository:
   ```
   git clone https://github.com/Rapha-btc/styx-integration-example.git
   cd styx-integration-example
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Integration Steps

To integrate Styx into your own application:

1. **Install the SDK**:
   ```
   npm install @faktoryfun/styx-sdk
   ```

2. **Import the SDK in your components**:
   ```typescript
   // Basic SDK import
   import { styxSDK } from '@faktoryfun/styx-sdk';
   
   // Type imports
   import { Deposit, TransactionPriority } from '@faktoryfun/styx-sdk';
   
   // Constants
   import { MIN_DEPOSIT_SATS, MAX_DEPOSIT_SATS } from '@faktoryfun/styx-sdk';
   ```

3. **Set up the React Query client**:
   ```typescript
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

   const queryClient = new QueryClient();

   function App() {
     return (
       <QueryClientProvider client={queryClient}>
         <YourAppComponents />
       </QueryClientProvider>
     );
   }
   ```

4. **Use the Styx hooks in your components**:
   ```typescript
   import useSdkPoolStatus from './hooks/useSdkPoolStatus';
   import { useFormattedBtcPrice } from './hooks/useSdkBtcPrice';

   function YourComponent() {
     const { data: poolStatus } = useSdkPoolStatus();
     const { price: btcUsdPrice } = useFormattedBtcPrice();
     
     // Use the data in your UI
   }
   ```

## Wallet Support

The example includes integration with:
- **Leather Wallet** - For Stacks and Bitcoin
- **Xverse Wallet** - For Bitcoin with special handling for different address types

For Leather, the app uses `window.LeatherProvider.request` methods.
For Xverse, it uses the `request` method from the `sats-connect` package.

## Advanced Usage

### Bitcoin Transaction Flow

The example demonstrates how to use the SDK to handle the complete Bitcoin transaction flow:

1. **Transaction Preparation**: Using `styxSDK.prepareTransaction` to handle:
   - UTXO selection and management
   - OP_RETURN data generation for protocol communication
   - Fee calculation and estimation

2. **Wallet Integration**: Wallet-specific code for:
   - Leather wallet interaction through `window.LeatherProvider.request`
   - Xverse wallet integration through `sats-connect`
   - Handling different address types (P2SH, SegWit)

3. **Transaction Execution and Broadcasting**: 
   - Using `styxSDK.executeTransaction` to prepare the final transaction data
   - Implementing wallet-specific broadcasting:
     - Leather: Manual broadcasting via Mempool API after signing
     - Xverse: Using the wallet's built-in broadcasting functionality

4. **Status Management**: Properly updating deposit status with:
   - `styxSDK.updateDepositStatus({ status: "broadcast" })` for successful broadcasts
   - `styxSDK.updateDepositStatus({ status: "canceled" })` for failed attempts

### State Management

The example uses React Query for data fetching and local state hooks for UI state, demonstrating best practices for managing:
- User session data
- Transaction state
- Loading/error states
- Refresh intervals for price and pool data

## Security Considerations

- The example includes proper error handling for wallet interactions
- Demonstrates transaction verification before signing
- Shows how to manage the deposit lifecycle (creation, update, cancellation)
- Implements proper fee estimation and user confirmation

## License

MIT

## Links

- [Styx Protocol Documentation](https://docs.styx.network)
- [Styx SDK on NPM](https://www.npmjs.com/package/@faktoryfun/styx-sdk)
- [Faktoryfun Github](https://github.com/faktoryfun)

---

*This example is maintained by Rapha-btc and the Faktoryfun team.*
