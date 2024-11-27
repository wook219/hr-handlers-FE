import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants/paths';

export const useNavigation = () => {
  const navigate = useNavigate();

  return {
    toTodo: () => navigate(PATHS.TODO),
    toHome: () => navigate(PATHS.HOME),
    toMyPage: () => navigate(PATHS.MYPAGE),
    toLogin: () => navigate(PATHS.LOGIN),
    toBoard: () => navigate(PATHS.BOARD),
  };
};