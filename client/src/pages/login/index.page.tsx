import { APP_TITLE } from 'commonConstantsWithClient';
import { staticPath } from 'src/utils/$path';
import { loginWithGoogle } from 'src/utils/login';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

const Login = () => {
  const { loadingElm, addLoading, removeLoading } = useLoading();
  const login = async () => {
    addLoading();
    await loginWithGoogle();
    removeLoading();
  };

  return (
    <div
      className={styles.container}
      style={{ background: `center/cover url('${staticPath.images.odaiba_jpg}')` }}
    >
      <div className={styles.main}>
        <div className={styles.title}>{APP_TITLE}</div>
        <div style={{ marginTop: '16px' }} onClick={login}>
          <div className={styles.btn}>
            <span>Login with Google</span>
          </div>
        </div>
      </div>
      {loadingElm}
    </div>
  );
};

export default Login;
