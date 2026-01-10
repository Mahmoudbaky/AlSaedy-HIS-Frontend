import { Link } from 'react-router';
import CardBox from 'src/components/shared/CardBox';

import AuthLogin from '../authforms/AuthLogin';
import SocialButtons from '../authforms/SocialButtons';

import FullLogo from 'src/layouts/full/shared/logo/FullLogo';

const Login = () => {
  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <AuthLogin />
        </div>
      </div>
    </>
  );
};

export default Login;
