// import Logo from "src/assets/images/logos/dark-logo.svg";
// import Logowhite from "src/assets/images/logos/light-logo.svg";
import Logo from "src/assets/images/logo.png"; ``

const FullLogo = () => {
  return (


    <>
      {/* Dark Logo   */}
      <img src={Logo} alt="logo" className="block dark:hidden rtl:scale-x-[-1]" />
      {/* <img src={LogoIcon} alt="logo" className="block dark:block rtl:scale-x-[-1]" /> */}
      {/* Light Logo  */}
      <img src={Logo} alt="logo" className="hidden dark:block  rtl:scale-x-[-1]" />
      {/* <img src={Logowhite} alt="logo" className="hidden dark:block rtl:scale-x-[-1]" />
      <img src={LogoIcon} alt="logo" className="hidden dark:block rtl:scale-x-[-1]" /> */}
    </>
  );
};

export default FullLogo;
