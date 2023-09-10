import {Hand, HandDto} from './Hand/model'

export type Player = {
  name: string
  user_id?: string // also called player_id
  // fix the logic that 1 player can only play 1 hand for this demo.
  // real-life: 1 players in blackjack can play multiple hands
  hand: Hand,
}

// -- from backend
export type GameMatch = {
  dealerHand: HandDto,
  playerHand: HandDto,
  player: { id: string, name: string },
  status: MatchStatus,
  stopAt: number,
}
export enum MatchStatus {PlayersTurn, DealerTurn, Completed}
