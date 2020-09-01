module.exports = {
  ...jest.requireActual("@reach/router"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(() => jest.fn()),
};
