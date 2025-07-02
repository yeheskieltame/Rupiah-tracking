# IDRT Wallet Tracking & Analysis Queries

## Comprehensive Query Guide untuk Analisis Transaksi IDRT

### 1. 📊 **Query Transfer dari Wallet Tertentu**

**Semua transfer yang dikirim oleh wallet:**
```graphql
query GetTransfersFrom($walletAddress: Bytes!) {
  transfers(
    where: { from: $walletAddress }
    orderBy: blockTimestamp
    orderDirection: desc
    first: 100
  ) {
    id
    to
    value
    blockTimestamp
    transactionHash
    blockNumber
  }
  
  # Summary account info
  account(id: $walletAddress) {
    totalSent
    transferCount
    firstTransactionTimestamp
    lastTransactionTimestamp
  }
}
```

**Variabel:**
```json
{
  "walletAddress": "0x..."
}
```

### 2. 📥 **Query Transfer ke Wallet Tertentu**

**Semua transfer yang diterima wallet:**
```graphql
query GetTransfersTo($walletAddress: Bytes!) {
  transfers(
    where: { to: $walletAddress }
    orderBy: blockTimestamp
    orderDirection: desc
    first: 100
  ) {
    id
    from
    value
    blockTimestamp
    transactionHash
    blockNumber
  }
  
  # Summary account info
  account(id: $walletAddress) {
    totalReceived
    transferCount
    firstTransactionTimestamp
    lastTransactionTimestamp
  }
}
```

### 3. 🔄 **Query Complete Wallet Activity**

**Semua aktivitas wallet (in/out):**
```graphql
query GetWalletActivity($walletAddress: Bytes!) {
  account(id: $walletAddress) {
    id
    transferCount
    approvalCount
    totalSent
    totalReceived
    firstTransactionHash
    firstTransactionTimestamp
    lastTransactionHash
    lastTransactionTimestamp
    
    # Outgoing transfers
    transfersFrom(
      orderBy: blockTimestamp
      orderDirection: desc
      first: 50
    ) {
      id
      to
      value
      blockTimestamp
      transactionHash
    }
    
    # Incoming transfers
    transfersTo(
      orderBy: blockTimestamp
      orderDirection: desc
      first: 50
    ) {
      id
      from
      value
      blockTimestamp
      transactionHash
    }
    
    # Approvals given
    approvalsGiven(
      orderBy: blockTimestamp
      orderDirection: desc
      first: 20
    ) {
      id
      spender
      value
      blockTimestamp
      transactionHash
    }
  }
}
```

### 4. 🤝 **Query Interaksi Antar 2 Wallet**

**Tracking semua transaksi antara 2 wallet specific:**
```graphql
query GetWalletInteraction($fromWallet: Bytes!, $toWallet: Bytes!) {
  # Direct interaction A -> B
  walletInteractionA: walletInteraction(
    id: {fromWallet}-{toWallet}  # Replace dengan actual addresses
  ) {
    transferCount
    totalVolume
    firstTransactionHash
    firstTransactionTimestamp
    lastTransactionHash
    lastTransactionTimestamp
  }
  
  # Direct interaction B -> A  
  walletInteractionB: walletInteraction(
    id: {toWallet}-{fromWallet}  # Replace dengan actual addresses
  ) {
    transferCount
    totalVolume
    firstTransactionHash
    firstTransactionTimestamp
    lastTransactionHash
    lastTransactionTimestamp
  }
  
  # All transfers between these wallets
  transfersAtoB: transfers(
    where: { 
      from: $fromWallet, 
      to: $toWallet 
    }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    value
    blockTimestamp
    transactionHash
  }
  
  transfersBtoA: transfers(
    where: { 
      from: $toWallet, 
      to: $fromWallet 
    }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    value
    blockTimestamp
    transactionHash
  }
}
```

### 5. 💰 **Query Transfer Berdasarkan Nilai**

**Transfer besar (> 1 juta IDRT):**
```graphql
query GetLargeTransfers($minAmount: BigInt!) {
  transfers(
    where: { value_gte: $minAmount }
    orderBy: value
    orderDirection: desc
    first: 100
  ) {
    id
    from
    to
    value
    blockTimestamp
    transactionHash
    
    # Account info
    fromAccount {
      id
      transferCount
    }
    toAccount {
      id
      transferCount
    }
  }
}
```

**Variabel untuk 1M IDRT:**
```json
{
  "minAmount": "1000000000000000000000000"
}
```

### 6. ⏰ **Query Transfer Berdasarkan Waktu**

**Transfer dalam range waktu tertentu:**
```graphql
query GetTransfersByTime($startTime: BigInt!, $endTime: BigInt!) {
  transfers(
    where: { 
      blockTimestamp_gte: $startTime,
      blockTimestamp_lte: $endTime
    }
    orderBy: blockTimestamp
    orderDirection: desc
    first: 1000
  ) {
    id
    from
    to
    value
    blockTimestamp
    transactionHash
  }
}
```

### 7. 📈 **Query Top Wallets**

**Top senders berdasarkan total volume:**
```graphql
query GetTopSenders {
  accounts(
    orderBy: totalSent
    orderDirection: desc
    first: 100
    where: { totalSent_gt: "0" }
  ) {
    id
    totalSent
    transferCount
    lastTransactionTimestamp
  }
}
```

**Top receivers berdasarkan total volume:**
```graphql
query GetTopReceivers {
  accounts(
    orderBy: totalReceived
    orderDirection: desc
    first: 100
    where: { totalReceived_gt: "0" }
  ) {
    id
    totalReceived
    transferCount
    lastTransactionTimestamp
  }
}
```

### 8. 🔍 **Query berdasarkan Transaction Hash**

**Cari transfer berdasarkan tx hash:**
```graphql
query GetTransferByTxHash($txHash: Bytes!) {
  transfers(where: { transactionHash: $txHash }) {
    id
    from
    to
    value
    blockTimestamp
    blockNumber
    transactionHash
    
    fromAccount {
      id
      transferCount
      totalSent
    }
    
    toAccount {
      id
      transferCount
      totalReceived
    }
  }
}
```

### 9. 📊 **Query Daily Statistics**

**Volume transaksi harian:**
```graphql
query GetDailyStats($days: Int!) {
  dailyTransferSummaries(
    first: $days
    orderBy: date
    orderDirection: desc
  ) {
    date
    transferCount
    totalVolume
    uniqueSenders
    uniqueReceivers
  }
}
```

### 10. 🌐 **Query Global Statistics**

**Overall network statistics:**
```graphql
query GetGlobalStats {
  globalStat(id: "global") {
    totalTransfers
    totalVolume
    totalAccounts
    largestTransfer
    largestTransferHash
  }
}
```

### 11. 🔗 **Query Connection Pattern**

**Siapa saja yang pernah berinteraksi dengan wallet tertentu:**
```graphql
query GetWalletConnections($walletAddress: Bytes!) {
  # Who this wallet sent to
  sentTo: walletInteractions(
    where: { from: $walletAddress }
    orderBy: totalVolume
    orderDirection: desc
    first: 100
  ) {
    to
    transferCount
    totalVolume
    lastTransactionTimestamp
    toAccount {
      id
      transferCount
    }
  }
  
  # Who sent to this wallet
  receivedFrom: walletInteractions(
    where: { to: $walletAddress }
    orderBy: totalVolume
    orderDirection: desc
    first: 100
  ) {
    from
    transferCount
    totalVolume
    lastTransactionTimestamp
    fromAccount {
      id
      transferCount
    }
  }
}
```

## 🚀 **Contoh Penggunaan JavaScript/TypeScript**

```javascript
// Example: Get wallet activity
const query = `
  query GetWalletActivity($walletAddress: Bytes!) {
    account(id: $walletAddress) {
      totalSent
      totalReceived
      transferCount
      transfersFrom(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        to
        value
        blockTimestamp
        transactionHash
      }
    }
  }
`;

const variables = {
  walletAddress: "0x998ffe1e43facffb941dc337dd0468d52ba5b48a"
};

// Using fetch
fetch('YOUR_SUBGRAPH_ENDPOINT', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 📝 **Tips Penggunaan:**

1. **Pagination**: Gunakan `first`, `skip` untuk pagination
2. **Filtering**: Gunakan `where` dengan berbagai kondisi
3. **Sorting**: Gunakan `orderBy` dan `orderDirection`
4. **Time Range**: Convert timestamp ke BigInt format
5. **Amount**: IDRT menggunakan 18 decimals, jadi 1 IDRT = 1000000000000000000

Dengan query-query ini, Anda bisa melakukan analisis mendalam terhadap alur transaksi IDRT, tracking wallet activity, dan mendapatkan insights yang comprehensive!
