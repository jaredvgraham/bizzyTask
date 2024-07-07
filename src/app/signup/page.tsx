import SignUp from "@/pages/Signup";
import RedirectIfAuthenticated from "../../components/RedirectIfAuthenticated";

const SignUpPage = () => {
  return (
    <RedirectIfAuthenticated>
      <SignUp />
    </RedirectIfAuthenticated>
  );
};

export default SignUpPage;
