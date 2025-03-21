import React from "react";
import GameLibrary from "../components/GameLibrary";
import TopButtons from "../components/TopButtons"

const GameLibraryPage = () => {
  return (
    <div>
      <TopButtons fixed={true} />
      <GameLibrary />
    </div>
  );
};

export default GameLibraryPage;
