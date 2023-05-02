module.exports = {
  ...jest.requireActual('@gatsbyjs/reach-router'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(() => jest.fn()),
};
