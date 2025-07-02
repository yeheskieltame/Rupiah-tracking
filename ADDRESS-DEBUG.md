# 🔍 Debugging Address Query Issues

## Masalah Address Format - SOLVED! ✅

**❌ SOLUSI LAMA (User tidak friendly):**
- User harus convert address ke lowercase manually

**✅ SOLUSI BARU (User friendly):**
- The Graph sudah otomatis handle mixed case addresses
- User bisa input address format apapun dari Etherscan

## 🧪 Testing Address Queries

### Format Query yang Benar:

```graphql
# ✅ CARA 1: Direct address dari Etherscan (mixed case OK)
{
  account(id: "0x998FFE1E43fAcffb941dc337dD0468d52bA5b48A") {
    transferCount
    totalSent
    totalReceived
  }
}

# ✅ CARA 2: Lowercase (juga OK)  
{
  account(id: "0x998ffe1e43facffb941dc337dd0468d52ba5b48a") {
    transferCount
    totalSent
    totalReceived
  }
}
```

### Testing Checklist:

**1. ✅ Check Subgraph Sync Status**
- Buka: https://thegraph.com/studio/subgraph/rupiah-track
- Status harus: "Synced" (bukan "Syncing")
- Check current block vs latest block

**2. ✅ Test Basic Queries First**
```graphql
# Test 1: Check ada data transfer
{
  transfers(first: 1) {
    id
    from
    to
  }
}

# Test 2: Check ada account data
{
  accounts(first: 1) {
    id
    transferCount
  }
}

# Test 3: Check global stats
{
  globalStat(id: "global") {
    totalTransfers
  }
}
```

**3. ✅ Test Known Active Address**
- Gunakan address yang Anda TAHU pasti ada transaksi recent
- Check di Etherscan dulu untuk memastikan ada transaksi IDRT

### Common Issues & Solutions:

**❌ Issue 1: Query return null**
**✅ Solution:** 
- Pastikan subgraph sudah sync selesai
- Pastikan address benar-benar ada transaksi IDRT setelah start block

**❌ Issue 2: Start block terlalu tinggi**
**✅ Solution:** 
- Start block: 22823056 (block hari ini)
- Pastikan address yang di-test ada transaksi setelah block ini

**❌ Issue 3: Address format**
**✅ Solution:** 
- Format apapun OK! (0xABC... atau 0xabc...)
- The Graph handle otomatis

### 🔬 Debug Steps:

```bash
# 1. Check endpoint aktif
curl https://api.studio.thegraph.com/query/115277/rupiah-track/v0.0.3

# 2. Test basic query
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ transfers(first: 1) { id } }"}' \
  https://api.studio.thegraph.com/query/115277/rupiah-track/v0.0.3
```

### 💡 Pro Tips:

1. **Wait for Sync**: Dengan start block 22823056, indexing cuma butuh beberapa menit
2. **Use Recent Addresses**: Test dengan address yang baru saja bertransaksi  
3. **Check Studio Dashboard**: Monitor sync progress real-time
4. **Test Step by Step**: Basic queries dulu, baru specific addresses

**Bottom line: Address format TIDAK MASALAH. Issue kemungkinan di sync status atau choice of address untuk testing.**
