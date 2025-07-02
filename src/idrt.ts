import {
  AdminChanged as AdminChangedEvent,
  Upgraded as UpgradedEvent,
  Transfer as TransferEvent,
  Approval as ApprovalEvent
} from "../generated/IDRT/IDRT"
import { 
  AdminChanged, 
  Upgraded, 
  Transfer, 
  Approval, 
  Account, 
  DailyTransferSummary,
  WalletInteraction,
  GlobalStat
} from "../generated/schema"
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  // Ensure accounts exist and link them
  let fromAccount = getOrCreateAccount(event.params.from)
  let toAccount = getOrCreateAccount(event.params.to)
  
  entity.fromAccount = fromAccount.id
  entity.toAccount = toAccount.id
  entity.save()

  // Update accounts with transfer data
  updateAccountForTransfer(event.params.from, event.params.value, true, event.transaction.hash, event.block.timestamp)
  updateAccountForTransfer(event.params.to, event.params.value, false, event.transaction.hash, event.block.timestamp)

  // Update wallet interaction tracking
  updateWalletInteraction(event)
  
  // Update daily summary
  updateDailyTransferSummary(event)
  
  // Update global stats
  updateGlobalStats(event)
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  // Link to owner account
  let ownerAccount = getOrCreateAccount(event.params.owner)
  entity.ownerAccount = ownerAccount.id
  entity.save()

  // Update accounts
  updateAccount(event.params.owner, event.transaction.hash, event.block.timestamp, true)
}

// Helper function to get or create account
function getOrCreateAccount(address: Address): Account {
  // Always use the Address type directly as ID (Graph handles lowercase conversion)
  let account = Account.load(address)
  if (!account) {
    account = new Account(address)
    account.balance = BigInt.fromI32(0)
    account.transferCount = BigInt.fromI32(0)
    account.approvalCount = BigInt.fromI32(0)
    account.totalSent = BigInt.fromI32(0)
    account.totalReceived = BigInt.fromI32(0)
    account.save()
  }
  return account
}

// Updated account function for transfers
function updateAccountForTransfer(
  address: Address,
  value: BigInt,
  isSender: boolean,
  txHash: Bytes,
  timestamp: BigInt
): void {
  let account = getOrCreateAccount(address)
  
  if (!account.firstTransactionHash) {
    account.firstTransactionHash = txHash
    account.firstTransactionTimestamp = timestamp
  }
  
  account.transferCount = account.transferCount.plus(BigInt.fromI32(1))
  
  if (isSender) {
    account.totalSent = account.totalSent.plus(value)
  } else {
    account.totalReceived = account.totalReceived.plus(value)
  }
  
  account.lastTransactionHash = txHash
  account.lastTransactionTimestamp = timestamp
  account.save()
}

function updateAccount(
  address: Address, 
  txHash: Bytes, 
  timestamp: BigInt, 
  isApproval: boolean
): void {
  let account = getOrCreateAccount(address)
  
  if (!account.firstTransactionHash) {
    account.firstTransactionHash = txHash
    account.firstTransactionTimestamp = timestamp
  }

  if (isApproval) {
    account.approvalCount = account.approvalCount.plus(BigInt.fromI32(1))
  }
  
  account.lastTransactionHash = txHash
  account.lastTransactionTimestamp = timestamp
  account.save()
}

// Function untuk tracking interaksi antar wallet
function updateWalletInteraction(event: TransferEvent): void {
  let fromAddress = event.params.from.toHexString()
  let toAddress = event.params.to.toHexString()
  // Simple concatenation for ID
  let interactionId = fromAddress + "-" + toAddress
  let interactionIdBytes = Bytes.fromUTF8(interactionId)
  
  let interaction = WalletInteraction.load(interactionIdBytes)
  if (!interaction) {
    interaction = new WalletInteraction(interactionIdBytes)
    interaction.from = event.params.from
    interaction.to = event.params.to
    interaction.transferCount = BigInt.fromI32(0)
    interaction.totalVolume = BigInt.fromI32(0)
    interaction.firstTransactionHash = event.transaction.hash
    interaction.firstTransactionTimestamp = event.block.timestamp
    
    // Link accounts
    let fromAccount = getOrCreateAccount(event.params.from)
    let toAccount = getOrCreateAccount(event.params.to)
    interaction.fromAccount = fromAccount.id
    interaction.toAccount = toAccount.id
  }
  
  interaction.transferCount = interaction.transferCount.plus(BigInt.fromI32(1))
  interaction.totalVolume = interaction.totalVolume.plus(event.params.value)
  interaction.lastTransactionHash = event.transaction.hash
  interaction.lastTransactionTimestamp = event.block.timestamp
  interaction.save()
}

// Function untuk global statistics
function updateGlobalStats(event: TransferEvent): void {
  let globalId = Bytes.fromUTF8("global")
  let globalStat = GlobalStat.load(globalId)
  
  if (!globalStat) {
    globalStat = new GlobalStat(globalId)
    globalStat.totalTransfers = BigInt.fromI32(0)
    globalStat.totalVolume = BigInt.fromI32(0)
    globalStat.totalAccounts = BigInt.fromI32(0)
    globalStat.largestTransfer = BigInt.fromI32(0)
  }
  
  globalStat.totalTransfers = globalStat.totalTransfers.plus(BigInt.fromI32(1))
  globalStat.totalVolume = globalStat.totalVolume.plus(event.params.value)
  
  // Check if this is the largest transfer
  if (event.params.value.gt(globalStat.largestTransfer)) {
    globalStat.largestTransfer = event.params.value
    globalStat.largestTransferHash = event.transaction.hash
  }
  
  globalStat.save()
}

function updateDailyTransferSummary(event: TransferEvent): void {
  let timestamp = event.block.timestamp.toI32()
  let dayId = timestamp / 86400 // seconds in a day
  let dayStartTimestamp = dayId * 86400
  
  let date = new Date(dayStartTimestamp * 1000).toISOString().slice(0, 10)
  let id = Bytes.fromUTF8(date)
  
  let summary = DailyTransferSummary.load(id)
  if (!summary) {
    summary = new DailyTransferSummary(id)
    summary.date = date
    summary.transferCount = BigInt.fromI32(0)
    summary.totalVolume = BigInt.fromI32(0)
    summary.uniqueSenders = BigInt.fromI32(0)
    summary.uniqueReceivers = BigInt.fromI32(0)
  }
  
  summary.transferCount = summary.transferCount.plus(BigInt.fromI32(1))
  summary.totalVolume = summary.totalVolume.plus(event.params.value)
  summary.save()
}

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousAdmin = event.params.previousAdmin
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
