import { useNavigate } from 'react-router-dom';

const hooks = () => {
  const navigate = useNavigate();

  const goToPage = (path: string) => {
    navigate(path);
  };

  return { goToPage };
};

export default hooks;
