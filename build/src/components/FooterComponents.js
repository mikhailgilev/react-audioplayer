import React from "react";
import PlayerButtons from "./PlayerButtons";

const Footer = ({ popupButtonFuncs, isRemPopupExpanded, currentTrackPosition, currentTrackDuration, buttonsDisabled, playerButtonFuncs, resizeList, isSelPopupExpanded, isSortPopupExpanded }) =>
  <div id="footer">
    <div id="footer-popups">
      <FooterPopup
        buttonList={[{ label: "ADD FILE", onClick: popupButtonFuncs.clickAddFiles }]}
      />
      <FooterPopup
        isExpanded={isRemPopupExpanded}
        buttonList={[
          { label: "REM ALL", onClick: () => popupButtonFuncs.clickRemoveSongs("all") },
          { label: "CROP", onClick: () => popupButtonFuncs.clickRemoveSongs("crop") },
          { label: "REM", expandedVersionLabel: "REM SEL", onClick: () => popupButtonFuncs.clickRemoveSongs("selected") }
        ]}
      />
      <FooterPopup
        isExpanded={isSelPopupExpanded}
        buttonList={[
          { label: "INV SEL", onClick: () => popupButtonFuncs.clickSelectSongs("inverted") },
          { label: "SEL ZERO", onClick: () => popupButtonFuncs.clickSelectSongs("none") },
          { label: "SEL", expandedVersionLabel: "SEL ALL", onClick: () => popupButtonFuncs.clickSelectSongs("all") }
        ]}
      />
      <FooterPopup
        isExpanded={isSortPopupExpanded}
        buttonList={[
          { label: "BY NAME", onClick: () => popupButtonFuncs.clickSort("name") },
          { label: "REVE\nRSE", onClick: () => popupButtonFuncs.clickSort("reverse") },
          { label: "SORT", expandedVersionLabel: "RAN\nDOM", onClick: () => popupButtonFuncs.clickSort("random") }
        ]}
      />
    </div>
    <div id="footer-player">
      <div id="footer-player-upper-part">
        <div id="footer-player-screen">{`${currentTrackPosition}/${currentTrackDuration}`}</div>
      </div>
      <div id="footer-player-lower-part">
        <PlayerButtons
          buttonsDisabled={buttonsDisabled}
          playerButtonFuncs={playerButtonFuncs}
          divId="footer-player-buttons"
        />
        <div id="footer-player-bottom-screen">{`${currentTrackPosition}`}</div>
      </div>
    </div>
  </div>

const FooterPopup = ({ isExpanded, buttonList, buttonsDisabled }) =>
  <div className="footer-popup" style={{ marginTop: isExpanded ? `${-((buttonList.length - 1) * 18)}px` : "0px" }}>
    {buttonList.map((button, index) =>
      <button
        disabled={buttonsDisabled}
        className={`footer-button${index !== buttonList.length - 1 && !isExpanded ? " hidden" : ""}`}
        key={`footer-button-${index + 1}`}
        onClick={button.onClick}>
        {isExpanded && button.expandedVersionLabel !== undefined ? button.expandedVersionLabel : button.label}
      </button>
    )}
  </div>

export default Footer;