import { FormEvent, RefObject, useRef, useState } from "react";
import { Board } from "../lib/tictactoe/Board";
import { GameInfo } from "../lib/tictactoe/GameInfo";
import {
  calculateNextValue,
  calculateStatus,
  getDefaultSquares,
  NonNullableUserNames,
  SquareValue,
  UserNames,
} from "../lib/tictactoe/helpers";

type UserNameFormProps = {
  onUserNamesSubmitted: (userNames: NonNullableUserNames) => void;
};

type useUserNamesFormReturns = {
  userXRef: RefObject<HTMLInputElement>;
  userORef: RefObject<HTMLInputElement>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function useUserNamesForm({
  onUserNamesSubmitted,
}: UserNameFormProps): useUserNamesFormReturns {
  const userXRef = useRef<HTMLInputElement>(null);
  const userORef = useRef<HTMLInputElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userX = userXRef.current?.value;
    const userO = userORef.current?.value;
    if (!userX || !userO) {
      return;
    }

    onUserNamesSubmitted({ X: userX, O: userO });
  };
  return { userXRef, userORef, onSubmit };
}

const UserNameForm = ({ onUserNamesSubmitted }: UserNameFormProps) => {
  const { userXRef, userORef, onSubmit } = useUserNamesForm({
    onUserNamesSubmitted,
  });

  return (
    <form onSubmit={onSubmit} className="vertical-stack">
      <h3>Put players usernames</h3>
      <label htmlFor="user1">User X</label>
      <input id="user1" ref={userXRef} required minLength={2} />
      <label htmlFor="user2">User O</label>
      <input id="user2" ref={userORef} required minLength={2} />
      <button type="submit">Submit</button>
    </form>
  );
};

type useGameReturns = {
  squares: SquareValue[];
  status: string;
  userNames: UserNames;
  setUserNames: (userNames: UserNames) => void;
};

function useGame(): useGameReturns {
  const [squares] = useState<SquareValue[]>(() => getDefaultSquares());
  const [userNames, setUserNames] = useState<UserNames>({
    X: "Player X",
    O: "Player O",
  });

  const nextValue = calculateNextValue(squares);

  const status = calculateStatus(
    squares,
    `${userNames[nextValue]}'s turn (${nextValue})`
  );

  return { squares, status, userNames, setUserNames };
}

const Game = () => {
  const { squares, status, userNames, setUserNames } = useGame();

  const xUserName = userNames.X;
  const oUserName = userNames.O;

  if (!xUserName || !oUserName) {
    return (
      <UserNameForm
        onUserNamesSubmitted={(userNames) => {
          setUserNames(userNames);
        }}
      />
    );
  }

  return (
    <div className="game">
      <GameInfo
        status={status}
        userNames={{
          X: xUserName,
          O: oUserName,
        }}
      />
      <Board squares={squares} />
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
