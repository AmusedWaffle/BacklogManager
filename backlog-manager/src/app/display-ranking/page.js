import React from "react";
import DisplayRanking from "../../components/DisplayRanking";
import TopButtons from "../../components/TopButtons";

const DisplayRankingPage = () => {
  return (
    <div>
      <TopButtons fixed={true} />
      <DisplayRanking />
    </div>
  );
};

export default DisplayRankingPage;