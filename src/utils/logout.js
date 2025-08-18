import { useNavigate } from 'react-router-dom';
import getExpFromToken from './getExp';
import getUserIdFromToken from './getUserId';

export default function logoutIfTokenExp() {
  const navigate = useNavigate();
  const exp = getExpFromToken();

  if (exp) {
    const id = getUserIdFromToken();
    const expDate = new Date(exp * 1000);
    if (Date.now() > expDate) {
      localStorage.removeItem('token');
      navigate('/auth');
    } else {
      navigate(`/user/${id}`);
    }
  }
}
