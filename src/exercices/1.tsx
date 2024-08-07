/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import clsx from "clsx";
import { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { calculateNextValue, calculateStatus } from "../lib/tictactoe/helpers";

type SquareProps = {
  isWinningSquare?: boolean;
} & ComponentPropsWithoutRef<"button">;

const Square = ({
  isWinningSquare,
  children,
  ...props
}: PropsWithChildren<SquareProps>) => {
  return (
    <button
      className={clsx("square", {
        "winning-square": isWinningSquare,
      })}
      {...props}
    >
      {children}
    </button>
  );
};

type SquareValue = null | "X" | "O";

type BoardProps = {
  squares: SquareValue[];
  onClick?: (index: number) => void;
  winningSquares?: number[] | undefined;
};

const Board = ({ squares, onClick, winningSquares }: BoardProps) => {
  return (
    <div className="game-board">
      {squares.map((square, i) => (
        <Square
          key={`square-${i}`}
          isWinningSquare={winningSquares?.includes(i)}
          onClick={() => onClick?.(i)}
        >
          {square}
        </Square>
      ))}
    </div>
  );
};

type GameInfoProps = { status: string };

const GameInfo = ({ status }: GameInfoProps) => {
  return (
    <div className="game-info">
      <p>{status}</p>
    </div>
  );
};

const getDefaultSquares = (): SquareValue[] => [
  null,
  null,
  null,
  null,
  null,
  null,
  "O",
  null,
  "X",
];

const Game = () => {
  const squares = getDefaultSquares();
  const nextPlayer = calculateNextValue(squares);
  const status = calculateStatus(squares, nextPlayer);

  return (
    <div className="game">
      <GameInfo status={status}></GameInfo>
      <Board squares={squares}></Board>
    </div>
  );
};

export default function App() {
  return (
    <div>
      <h2>TicTacToe</h2>
      <Game />
    </div>
  );
}
