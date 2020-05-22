import React from "react";
import { Link } from "react-router-dom";
import translate from "../../../../translations/translate";

import "./player-tab.scss";

export interface PlayerTabProps {
  avatarUrl: string;
  name: string;
  levelsCompleted: number;
  additionalInfo: string;
}

const PlayerTab: React.FC<PlayerTabProps> = ({
  avatarUrl,
  name,
  levelsCompleted,
  additionalInfo,
}) => {
  // translation vars
  const translationPrefix: string = "playerTab";
  const levelsCompletedId: string = translationPrefix + ".levelsCompleted";
  const additionalInfoId: string = translationPrefix + ".additionalInfo";
  // other
  const redirectToUserInfoPageUrl: string = `/player-info/${name}`;

  return (
    <Link to={redirectToUserInfoPageUrl} target="_blank" className="player-tab">
      <div
        className="player-tab__avatar"
        style={{ backgroundImage: `url(${avatarUrl})` }}
      />
      <div className="player-tab__name">{name}</div>
      <div className="player-tab__levels-completed">
        <b>{translate(levelsCompletedId)}: </b>
        {levelsCompleted}
      </div>
      <div className="player-tab__additional-info">
        <b>{translate(additionalInfoId)}: </b>
        {additionalInfo}
      </div>
    </Link>
  );
};

export default PlayerTab;
