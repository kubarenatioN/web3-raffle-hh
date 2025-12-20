import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CoordinatorSet,
  OwnershipTransferRequested,
  OwnershipTransferred,
  RaffleEntered,
  RaffleEntranceFeeUpdated,
  RaffleOwnerFundsSent,
  RaffleRandomWordsRequested,
  RaffleWinnerFundsSent,
  RaffleWinnerPicked
} from "../generated/Raffle/Raffle"

export function createCoordinatorSetEvent(
  vrfCoordinator: Address
): CoordinatorSet {
  let coordinatorSetEvent = changetype<CoordinatorSet>(newMockEvent())

  coordinatorSetEvent.parameters = new Array()

  coordinatorSetEvent.parameters.push(
    new ethereum.EventParam(
      "vrfCoordinator",
      ethereum.Value.fromAddress(vrfCoordinator)
    )
  )

  return coordinatorSetEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent =
    changetype<OwnershipTransferRequested>(newMockEvent())

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}

export function createRaffleEnteredEvent(
  sender: Address,
  amount: BigInt,
  round: BigInt
): RaffleEntered {
  let raffleEnteredEvent = changetype<RaffleEntered>(newMockEvent())

  raffleEnteredEvent.parameters = new Array()

  raffleEnteredEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  raffleEnteredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  raffleEnteredEvent.parameters.push(
    new ethereum.EventParam("round", ethereum.Value.fromUnsignedBigInt(round))
  )

  return raffleEnteredEvent
}

export function createRaffleEntranceFeeUpdatedEvent(
  oldFee: BigInt,
  newFee: BigInt
): RaffleEntranceFeeUpdated {
  let raffleEntranceFeeUpdatedEvent =
    changetype<RaffleEntranceFeeUpdated>(newMockEvent())

  raffleEntranceFeeUpdatedEvent.parameters = new Array()

  raffleEntranceFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldFee", ethereum.Value.fromUnsignedBigInt(oldFee))
  )
  raffleEntranceFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("newFee", ethereum.Value.fromUnsignedBigInt(newFee))
  )

  return raffleEntranceFeeUpdatedEvent
}

export function createRaffleOwnerFundsSentEvent(
  owner: Address,
  amount: BigInt
): RaffleOwnerFundsSent {
  let raffleOwnerFundsSentEvent =
    changetype<RaffleOwnerFundsSent>(newMockEvent())

  raffleOwnerFundsSentEvent.parameters = new Array()

  raffleOwnerFundsSentEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  raffleOwnerFundsSentEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return raffleOwnerFundsSentEvent
}

export function createRaffleRandomWordsRequestedEvent(
  reqId: BigInt,
  round: BigInt
): RaffleRandomWordsRequested {
  let raffleRandomWordsRequestedEvent =
    changetype<RaffleRandomWordsRequested>(newMockEvent())

  raffleRandomWordsRequestedEvent.parameters = new Array()

  raffleRandomWordsRequestedEvent.parameters.push(
    new ethereum.EventParam("reqId", ethereum.Value.fromUnsignedBigInt(reqId))
  )
  raffleRandomWordsRequestedEvent.parameters.push(
    new ethereum.EventParam("round", ethereum.Value.fromUnsignedBigInt(round))
  )

  return raffleRandomWordsRequestedEvent
}

export function createRaffleWinnerFundsSentEvent(
  receiver: Address,
  amount: BigInt
): RaffleWinnerFundsSent {
  let raffleWinnerFundsSentEvent =
    changetype<RaffleWinnerFundsSent>(newMockEvent())

  raffleWinnerFundsSentEvent.parameters = new Array()

  raffleWinnerFundsSentEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  raffleWinnerFundsSentEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return raffleWinnerFundsSentEvent
}

export function createRaffleWinnerPickedEvent(
  winner: Address,
  round: BigInt,
  fundsDrawn: BigInt,
  participantsCount: BigInt
): RaffleWinnerPicked {
  let raffleWinnerPickedEvent = changetype<RaffleWinnerPicked>(newMockEvent())

  raffleWinnerPickedEvent.parameters = new Array()

  raffleWinnerPickedEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )
  raffleWinnerPickedEvent.parameters.push(
    new ethereum.EventParam("round", ethereum.Value.fromUnsignedBigInt(round))
  )
  raffleWinnerPickedEvent.parameters.push(
    new ethereum.EventParam(
      "fundsDrawn",
      ethereum.Value.fromUnsignedBigInt(fundsDrawn)
    )
  )
  raffleWinnerPickedEvent.parameters.push(
    new ethereum.EventParam(
      "participantsCount",
      ethereum.Value.fromUnsignedBigInt(participantsCount)
    )
  )

  return raffleWinnerPickedEvent
}
