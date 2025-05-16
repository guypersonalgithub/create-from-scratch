import { ReactNode } from "react";
import "./CSSHoverMultiDropdown.css"

type CSSHoverMultiDropdownProps = {
  children: ReactNode;
};

export const CSSHoverMultiDropdown = ({ children }: CSSHoverMultiDropdownProps) => {
  return (
    <>
      <div aria-haspopup="true">{children}</div>
      <div className="navbar-menu">
        <ul aria-label="submenu">
          <li>
            <a href="#!">Service item 1</a>
          </li>
          <li className="has-children">
            <a href="#!" aria-haspopup="true">
              Service item 2
            </a>
            <ul aria-label="submenu">
              <li>
                <a href="#!">Service subitem 1</a>
              </li>
              <li className="has-children">
                <a href="#!" aria-haspopup="true">
                  Service subitem 2
                </a>
                <ul aria-label="submenu">
                  <li>
                    <a href="#!">Service subsubitem 1</a>
                  </li>
                  <li>
                    <a href="#!">Service subsubitem 2</a>
                  </li>
                  <li>
                    <a href="#!">Service subsubitem 3</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#!">Service subitem 3</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#!">Service item 3</a>
          </li>
          <li>
            <a href="#!">Service item 4</a>
          </li>
        </ul>
      </div>
    </>
  );
};
