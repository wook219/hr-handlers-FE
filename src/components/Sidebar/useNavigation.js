import { useNavigate } from 'react-router-dom';
import { ADMINPATHS, PATHS } from '../../constants/paths';

export const useNavigation = () => {
  const navigate = useNavigate();

  return {
    toTodo: () => navigate(PATHS.TODO),
    toHome: () => navigate(PATHS.HOME),
    toMyPage: () => navigate(PATHS.MYPAGE),
    toLogin: () => navigate(PATHS.LOGIN),
    toBoard: () => navigate(PATHS.BOARD),
    toChatRoom: () => navigate(PATHS.CHATROOM),
    toSalary: () => navigate(PATHS.SALARY),
    toVacation : () => navigate(PATHS.VACATION),
    toAdminHome : () => navigate(ADMINPATHS.HOME),
    toAdminEmp: () => navigate(ADMINPATHS.EMP),
    toAdminVacation : () => navigate(ADMINPATHS.VACATION),
    toAttendance : () => navigate(PATHS.ATTENDANCE),
    toAdminAttendance : () => navigate(ADMINPATHS.ATTENDANCE),
    toAdminSalary : () => navigate(ADMINPATHS.SALARY),
  };
};
