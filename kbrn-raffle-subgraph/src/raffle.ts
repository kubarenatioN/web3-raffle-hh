import {
  // CoordinatorSet as CoordinatorSetEvent,
  // OwnershipTransferRequested as OwnershipTransferRequestedEvent,
  // OwnershipTransferred as OwnershipTransferredEvent,
  // RaffleEntranceFeeUpdated as RaffleEntranceFeeUpdatedEvent,
  // RaffleOwnerFundsSent as RaffleOwnerFundsSentEvent,
  // RaffleRandomWordsRequested as RaffleRandomWordsRequestedEvent,
  // RaffleWinnerFundsSent as RaffleWinnerFundsSentEvent,
  RaffleEntered as RaffleEnteredEvent,
  RaffleWinnerPicked as RaffleWinnerPickedEvent,
} from '../generated/Raffle/Raffle'
import {
  // CoordinatorSet,
  // OwnershipTransferRequested,
  // OwnershipTransferred,
  // RaffleEntranceFeeUpdated,
  // RaffleOwnerFundsSent,
  // RaffleRandomWordsRequested,
  // RaffleWinnerFundsSent,
  RaffleEntered,
  RaffleWinnerPicked,
} from '../generated/schema'

// export function handleCoordinatorSet(event: CoordinatorSetEvent): void {
//   let entity = new CoordinatorSet(event.transaction.hash.concatI32(event.logIndex.toI32()))
//   entity.vrfCoordinator = event.params.vrfCoordinator

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleOwnershipTransferRequested(event: OwnershipTransferRequestedEvent): void {
//   let entity = new OwnershipTransferRequested(event.transaction.hash.concatI32(event.logIndex.toI32()))
//   entity.from = event.params.from
//   entity.to = event.params.to

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
//   let entity = new OwnershipTransferred(event.transaction.hash.concatI32(event.logIndex.toI32()))
//   entity.from = event.params.from
//   entity.to = event.params.to

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

export function handleRaffleEntered(event: RaffleEnteredEvent): void {
  let entity = new RaffleEntered(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.sender = event.params.sender
  entity.amount = event.params.amount
  entity.round = event.params.round

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

// export function handleRaffleEntranceFeeUpdated(event: RaffleEntranceFeeUpdatedEvent): void {
//   let entity = new RaffleEntranceFeeUpdated(event.transaction.hash.concatI32(event.logIndex.toI32()))
//   entity.oldFee = event.params.oldFee
//   entity.newFee = event.params.newFee

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleRaffleOwnerFundsSent(event: RaffleOwnerFundsSentEvent): void {
//   let entity = new RaffleOwnerFundsSent(event.transaction.hash.concatI32(event.logIndex.toI32()))
//   entity.owner = event.params.owner
//   entity.amount = event.params.amount

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleRaffleRandomWordsRequested(event: RaffleRandomWordsRequestedEvent): void {
//   let entity = new RaffleRandomWordsRequested(event.transaction.hash.concatI32(event.logIndex.toI32()))
//   entity.reqId = event.params.reqId
//   entity.round = event.params.round

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleRaffleWinnerFundsSent(event: RaffleWinnerFundsSentEvent): void {
//   let entity = new RaffleWinnerFundsSent(event.transaction.hash.concatI32(event.logIndex.toI32()))
//   entity.receiver = event.params.receiver
//   entity.amount = event.params.amount

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

export function handleRaffleWinnerPicked(event: RaffleWinnerPickedEvent): void {
  let entity = new RaffleWinnerPicked(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.winner = event.params.winner
  entity.round = event.params.round
  entity.fundsDrawn = event.params.fundsDrawn
  entity.participantsCount = event.params.participantsCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
