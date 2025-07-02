# IDRT Transaction Analysis with The Graph

**Repository:** https://github.com/yeheskieltame/Rupiah-tracking

Subgraph untuk menganalisis transaksi IDRT (Indonesian Rupiah Token) menggunakan The Graph Protocol dengan kemampuan tracking wallet yang comprehensive.

## 🌟 **Open Source & Community Driven**

Project ini adalah **open source** dan terbuka untuk kontribusi dari komunitas blockchain Indonesia. Mari bersama-sama membangun tools analisis yang powerful untuk ekosistem IDRT!

### 🤝 **Contributing**
Kami sangat welcome kontribusi dalam bentuk:
- 🐛 **Bug Reports** - Laporkan issues yang ditemukan
- 💡 **Feature Requests** - Suggest fitur baru
- 🔧 **Pull Requests** - Code contributions
- 📖 **Documentation** - Improve docs & tutorials
- 🧪 **Testing** - Help test across different scenarios

**How to Contribute:**
1. Fork repository ini
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)  
5. Open Pull Request

### 💖 **Support the Project**

Jika project ini membantu analisis Anda dan ingin mendukung development:

**🏦 Donation Address (EVM):**
```
0x86979D26A14e17CF2E719dcB369d559f3ad41057
```

**Supported tokens:** ETH, USDC, USDT, IDRT, atau token EVM lainnya

**💰 Donasi akan digunakan untuk:**
- 🚀 **Publishing ke Mainnet** (memerlukan GRT tokens)
- ⚡ **Server infrastructure** untuk hosting additional tools
- 🔧 **Development** fitur-fitur baru
- 📚 **Documentation** dan tutorial lengkap

---

## 🎯 Features

### ✅ **Complete Transaction Tracking**
- **Transfer Events** - Track semua alur dana dari address ke address
- **Approval Events** - Track izin spending token
- **Transaction Hash & Timestamp** - Data lengkap untuk analisis temporal
- **Block Information** - Block number dan timestamp untuk tracking

### ✅ **Advanced Wallet Analytics**
- **Individual Wallet Activity** - Total sent, received, transfer count
- **Wallet Interactions** - Track hubungan antar wallet specific
- **First & Last Transaction** - Timeline aktivitas wallet
- **Connection Patterns** - Siapa berinteraksi dengan siapa

### ✅ **Query Capabilities**
- **From/To Wallet Queries** - Track transfer dari/ke wallet tertentu
- **Transaction Hash Lookup** - Cari transaksi berdasarkan hash
- **Time Range Analysis** - Filter berdasarkan waktu
- **Amount Filtering** - Filter berdasarkan nilai transfer
- **Top Wallets** - Ranking berdasarkan volume/activity

## 📊 Data Structure Overview

### Core Entities

**Transfer Entity:**
```graphql
type Transfer {
  id: Bytes!                    # Unique ID (txHash + logIndex)
  from: Bytes!                  # Sender address
  to: Bytes!                    # Receiver address  
  value: BigInt!                # Amount transferred
  blockNumber: BigInt!          # Block number
  blockTimestamp: BigInt!       # Timestamp
  transactionHash: Bytes!       # Transaction hash
  fromAccount: Account!         # Link to sender account
  toAccount: Account!           # Link to receiver account
}
```

**Account Entity:**
```graphql
type Account {
  id: Bytes!                    # Wallet address
  transferCount: BigInt!        # Total transfers made
  totalSent: BigInt!           # Total amount sent
  totalReceived: BigInt!       # Total amount received
  firstTransactionHash: Bytes  # First transaction
  lastTransactionHash: Bytes   # Latest transaction
  transfersFrom: [Transfer!]!  # All outgoing transfers
  transfersTo: [Transfer!]!    # All incoming transfers
}
```

**WalletInteraction Entity:**
```graphql
type WalletInteraction {
  id: Bytes!                    # fromAddress-toAddress
  from: Bytes!                  # Sender address
  to: Bytes!                    # Receiver address
  transferCount: BigInt!        # Number of transfers between them
  totalVolume: BigInt!          # Total volume transferred
  firstTransactionHash: Bytes!  # First interaction
  lastTransactionHash: Bytes!   # Latest interaction
}
```

## 🔥 Key Query Examples

### 1. **Complete Wallet Analysis**
```graphql
query GetWalletAnalysis($wallet: Bytes!) {
  account(id: $wallet) {
    id
    transferCount
    totalSent
    totalReceived
    firstTransactionTimestamp
    lastTransactionTimestamp
    
    transfersFrom(first: 50, orderBy: blockTimestamp, orderDirection: desc) {
      to
      value
      blockTimestamp
      transactionHash
    }
    
    transfersTo(first: 50, orderBy: blockTimestamp, orderDirection: desc) {
      from
      value
      blockTimestamp
      transactionHash
    }
  }
}
```

### 2. **Track Money Flow Between Wallets**
```graphql
query GetWalletFlow($fromWallet: Bytes!, $toWallet: Bytes!) {
  transfers(
    where: { from: $fromWallet, to: $toWallet }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    value
    blockTimestamp
    transactionHash
  }
  
  walletInteraction(id: "fromWallet-toWallet") {
    transferCount
    totalVolume
    firstTransactionTimestamp
    lastTransactionTimestamp
  }
}
```

### 3. **Find Large Transfers**
```graphql
query GetLargeTransfers {
  transfers(
    where: { value_gte: "1000000000000000000000000" }  # > 1M IDRT
    orderBy: value
    orderDirection: desc
    first: 100
  ) {
    from
    to
    value
    blockTimestamp
    transactionHash
  }
}
```

### 4. **Transaction Hash Lookup**
```graphql
query GetTransactionDetails($txHash: Bytes!) {
  transfers(where: { transactionHash: $txHash }) {
    id
    from
    to
    value
    blockTimestamp
    blockNumber
    
    fromAccount {
      totalSent
      transferCount
    }
    
    toAccount {
      totalReceived
      transferCount
    }
  }
}
```

## 🚀 **Quick Start**

### 1. **Clone & Setup**
```bash
git clone https://github.com/yeheskieltame/Rupiah-tracking.git
cd Rupiah-tracking
npm install
```

### 2. **Deploy to Subgraph Studio**
### 2. **Deploy to Subgraph Studio**
```bash
npm install -g @graphprotocol/graph-cli
graph auth --studio YOUR_DEPLOY_KEY
npm run codegen
npm run build
graph deploy --studio idrt-transaction-analyzer
```

### 3. **Query your data:**
```javascript
const query = `
  query GetWalletActivity($wallet: Bytes!) {
    account(id: $wallet) {
      totalSent
      totalReceived
      transferCount
    }
  }
`;

fetch('YOUR_SUBGRAPH_ENDPOINT', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query, 
    variables: { wallet: "0x..." }
  })
});
```

## 📈 **Analysis Use Cases**

### Financial Intelligence
- **🕵️ AML Compliance**: Track suspicious transfer patterns
- **🐋 Whale Monitoring**: Monitor large holders activities
- **💱 Exchange Analysis**: Track flows to/from exchanges
- **📊 Volume Analysis**: Daily/weekly transaction trends

### Wallet Forensics  
- **🔍 Address Investigation**: Complete wallet history
- **🤝 Relationship Mapping**: Find connected wallets
- **⏰ Timeline Analysis**: Transaction sequences
- **💰 Balance Tracking**: Historical balance changes

### Network Analytics
- **📈 Growth Metrics**: User adoption and activity
- **🔗 Network Effects**: Wallet interaction patterns
- **📊 Distribution Analysis**: Token concentration
- **⚡ Transaction Velocity**: Money flow speed

## 🔧 **Advanced Features**

### Real-time Tracking
- Block-by-block indexing
- Real-time wallet updates
- Live transaction monitoring
- Automatic relationship detection

### Comprehensive Data
- Full transaction history
- Gas usage tracking
- Timestamp precision
- Block context

### Scalable Queries
- Efficient pagination
- Complex filtering
- Multi-wallet analysis
- Historical data access

## 📂 **Project Structure**
```
rupiah-track/
├── schema.graphql          # Data schema definitions
├── subgraph.yaml          # Subgraph configuration  
├── src/idrt.ts            # Event handlers & mapping logic
├── abis/IDRT.json         # Contract ABI
├── QUERIES.md             # Complete query examples
├── CONTRIBUTING.md        # Contribution guidelines
├── FUNDING.md            # Support & funding information
└── README.md              # This file
```

## 🔗 **Network Configuration**
- **Network**: Ethereum Mainnet
- **Contract**: `0x998FFE1E43fAcffb941dc337dD0468d52bA5b48A`
- **Start Block**: `22823056` (recent blocks for fast sync)
- **Decimals**: 18 (1 IDRT = 1000000000000000000 wei)

## 🤝 **Contributing**

We welcome contributions from the Indonesian blockchain community! 

### **Quick Start for Contributors**
```bash
# Fork & clone repository
git clone https://github.com/YOUR-USERNAME/Rupiah-tracking.git
cd Rupiah-tracking

# Setup development environment
npm install
npm run codegen
npm run build

# Create feature branch & start contributing!
git checkout -b feature/your-amazing-feature
```

**See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.**

### **Areas Where We Need Help**
- 🔍 **Advanced Analytics** - Volume analysis, whale detection
- 📊 **Frontend Dashboard** - React/Vue.js visualization
- 📱 **Mobile Integration** - React Native/Flutter apps  
- 🤖 **Bot Development** - Telegram/Discord alert bots
- 📖 **Documentation** - Tutorials, API docs, translations
- 🧪 **Testing** - Cross-network testing, performance testing

## 💖 **Support the Project**

Help us build better blockchain analytics tools for Indonesia!

### **🏦 Donate Crypto**
**EVM Address (ETH/MATIC/BNB/USDC/USDT/IDRT):**
```
0x86979D26A14e17CF2E719dcB369d559f3ad41057
```

### **🎯 Funding Goals**
- **Goal 1**: $500 - Publish to mainnet (GRT tokens + gas)
- **Goal 2**: $1,500 - Web dashboard & alerting system  
- **Goal 3**: $3,000 - Advanced features & integrations

**See [FUNDING.md](./FUNDING.md) for detailed funding information.**

### **🏆 Supporter Perks**
- **$10+**: Early access + priority support
- **$50+**: Feature request priority + contributor status
- **$200+**: Logo placement + consultation call  
- **$500+**: Platinum partnership + custom integrations

## 📚 **Resources**
- **📁 Repository**: https://github.com/yeheskieltame/Rupiah-tracking
- **📖 Complete Queries**: [QUERIES.md](./QUERIES.md)
- **🚀 Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **🤝 Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **💖 Support Project**: [FUNDING.md](./FUNDING.md)
- **📚 The Graph Docs**: https://thegraph.com/docs/

---

## 🇮🇩 **Made with ❤️ for Indonesian Blockchain Community**

**Project ini didedikasikan untuk komunitas blockchain Indonesia. Mari bersama-sama membangun ekosistem crypto yang lebih transparan dan powerful! 🚀**

---

**Ready untuk analisis transaksi IDRT yang mendalam! Start exploring sekarang! �✨**
