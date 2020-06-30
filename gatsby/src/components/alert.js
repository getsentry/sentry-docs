import PropTypes from "prop-types";
import React from "react";

const Alert = ({ title, children, level, deepLink, dismiss }) => (
  <div
    className={`alert ${level && `alert-${level}`}`}
    role="alert"
    id={deepLink}
  >
    {dismiss && (
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    )}
    {title && <h5 className="no_toc">{title}</h5>}
    <div className="alert-body content-flush-bottom">{children}</div>
  </div>
);

Alert.propTypes = {
  title: PropTypes.string,
  level: PropTypes.string,
  deepLink: PropTypes.string,
  dismiss: PropTypes.bool,
};

Alert.defaultProps = {
  title: null,
  level: "",
  deepLink: null,
  dismiss: false,
};

export default Alert;
