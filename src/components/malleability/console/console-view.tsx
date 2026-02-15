import { useODI } from "../../../store/odi.store";
import { SettingsOverview } from "./overview-component";
import { SettingsDetailView } from "./detail-view-component";
import { SettingsMalleability } from "./malleability-component";
import "../malleability.scss";
import "./malleability-console.scss";

export const SettingsPanel = () => {
  return (
    <div className="settings-panel">
      <div className="settings-panel-header">
        <div className="settings-panel-title">
          <div className="settings-panel-name">Meridian Settings</div>
          <div className="settings-panel-collapse">
            <button
              className="settings-close-button"
              onClick={() =>
                useODI.getState().setMalleabilityConsoleOpen(false)
              }
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.46967 6.46967C0.176777 6.76256 0.176777 7.23744 0.46967 7.53033C0.762563 7.82322 1.23744 7.82322 1.53033 7.53033L3.99902 5.06164L6.46967 7.53228C6.76256 7.82518 7.23744 7.82518 7.53033 7.53228C7.82322 7.23939 7.82322 6.76452 7.53033 6.47162L5.05968 4.00098L7.53033 1.53033C7.82322 1.23744 7.82322 0.762563 7.53033 0.46967C7.23744 0.176777 6.76256 0.176776 6.46967 0.46967L3.99902 2.94032L1.53033 0.471623C1.23744 0.17873 0.762563 0.17873 0.46967 0.471623C0.176777 0.764517 0.176777 1.23939 0.46967 1.53228L2.93836 4.00098L0.46967 6.46967Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <hr className="settings-divider" />
      <div className="settings-panel-content">
        <SettingsOverview />
        <SettingsDetailView />
        <SettingsMalleability />
      </div>
    </div>
  );
};
