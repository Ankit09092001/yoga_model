import React from "react";
import "./DropDown.css";

const poseName = {
  Tree: "Vrikshasana",
  Chair: "Utkatasana",
  Dog: "Adho mukha svanasana",
  Warrior: "Veerbhadrasana",
  Cobra: "Bhujangasana",
};

export default function DropDown({ poseList, currentPose, setCurrentPose }) {
  return (
    <div className="dropdown dropdown-container">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        id="pose-dropdown-btn"
        aria-expanded="false"
      >
        {currentPose}
      </button>
      <ul
        class="dropdown-menu dropdown-custom-menu"
        aria-labelledby="dropdownMenuButton1"
      >
        {poseList.map((pose) => (
          <li onClick={() => setCurrentPose(pose)}>
            <div class="dropdown-item-container">
              <p className="dropdown-item-1">
                {pose}({poseName[pose]})
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
