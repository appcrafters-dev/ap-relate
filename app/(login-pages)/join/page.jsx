import OtpForm from "@/app/components/otp-form";

export default function JoinPage() {
  return (
    <OtpForm
      method="signUp"
      redirectTo="/join/get-started"
      heading="Create an Account"
      initialInstructions="Get instant access to our platform and resources when you sign up, it only takes a few clicks."
      link={{
        url: "/login",
        text: "Already have an account? Sign in",
        arrow: "right",
      }}
    />
  );
}
