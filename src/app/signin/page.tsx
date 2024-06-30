import SignIn from "@/pages/Signin";
import RedirectIfAuthenticated from "../../components/RedirectIfAuthenticated";

const SignInPage = () => {
  return (
    <RedirectIfAuthenticated>
      <SignIn />
    </RedirectIfAuthenticated>
  );
};

export default SignInPage;
