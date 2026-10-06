

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';
import { getMe, refreshAccessToken } from './features/auth/api/authApi';
import { clearCredentials, setAccessToken, setInitialized, setUser } from './features/auth/AuthSlice';

const App = () => {

  const dispatch = useDispatch();


  
  useEffect(() => { 
    const getAccessToken = async () => { 
      try {
        const accessToken = await refreshAccessToken();
        dispatch(setAccessToken(accessToken));
        const response = await getMe();
        dispatch(setUser(response.data.user));
      } catch (error) {
        console.log(error);
        dispatch(clearCredentials())
      }
      finally { 
        dispatch(setInitialized());
      }
    }

    getAccessToken();
  }, [dispatch])



  return <div>
    <Outlet />
  </div>
}

export default App