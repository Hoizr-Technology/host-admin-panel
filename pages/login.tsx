import ReusableModal from "@/components/common/modal/modal";
import useGlobalStore from "@/store/global";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import logo1 from "../assets/logo/text.png";
import AuthScreenSection from "@/components/common/authScreenSection/authScreenSection";
import CButton from "@/components/common/buttons/button";
import { ButtonType } from "@/components/common/buttons/interface";
import { extractErrorMessage, sanitizeText } from "@/utils/functions/common";

interface IFormInput {
  email: string;
  otp?: string;
}

export enum UserOnboardingStatusMessage {
  completed = "Account Completed",
  // active = "active",
  blocked = "Your account is blocked.",
  paymentPending = "Your payment details are pending.",
  internalVerificationPending = "Verification pending.",
  onboardingPending = "Your onboarding details are pending",
  restaurantOnboardingPending = "Restaurant onboarding pending",
}
const Login: FC = () => {
  const router = useRouter();
  const { setToastData } = useGlobalStore();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [btnloading, setBtnLoading] = useState(false);
  const [timer, setTimer] = useState<number>(20);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);
  const [otpId, setOTPId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email } = data;
    setEmail(email);

    const isPhoneNumber = /^\d{10}$/.test(email);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isPhoneNumber && !isEmail) {
      setToastData({
        type: "error",
        message: "Please enter a valid email address or phone number",
      });
      return;
    }
    try {
      setBtnLoading(true);
      const response = await sdk.hostLogin({ email: sanitizeText(email) });

      if (response.hostLogin !== null) {
        setShowModal(true);
        if (response.hostLogin !== "") {
          setToastData({
            message: "Verification code sent successfully",
            type: "success",
          });
        }
        setBtnLoading(false);
        setOTPId(response.hostLogin);
        setTimer(30);
        setShowResendButton(false);

        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev === 1) {
              clearInterval(countdown);
              setShowResendButton(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      setBtnLoading(false);
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const resendOtp = async () => {
    await onSubmit({ email: sanitizeText(email) });
    setOtp("");
    setToastData({
      message: "Verification code sent successfully",
      type: "success",
    });
  };

  const onSubmitOtp: SubmitHandler<IFormInput> = async () => {
    try {
      setBtnLoading(true);

      const response = await sdk.hostLoginVerification({
        input: {
          otpId: otpId,
          email: sanitizeText(email),
          otp: otp,
        },
      });

      if (response && response.hostLoginVerification) {
        setBtnLoading(false);

        setShowModal(false);
        setToastData({
          message: "Verification successful!",
          type: "success",
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      setBtnLoading(false);
      const errorMessage = extractErrorMessage(error);

      setToastData({
        type: "error",
        message: errorMessage,
      });
      setOtp("");
    }
  };

  return (
    <>
      <div className="bg-surface">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left side - Login Form */}
          <div className="w-full  flex items-center lg:w-5/12 px-6 py-8 lg:mx-auto ">
            <div className="w-full  max-w-md my-auto mx-auto">
              <div className="text-center ">
                <div className="relative z-10 flex items-center gap-16 justify-center">
                  <Image className="mb-4" src={logo1} alt="Logo" width={200} />
                </div>
                <h1 className="mt-3 text-primary">
                  Sign in to access your account
                </h1>
              </div>

              <div className="mt-8">
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="col-span-2">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-foreground"
                    >
                      Email or Mobile Number
                    </label>
                    <input
                      {...register("email", {
                        required: "Email or Mobile Number is required",
                      })}
                      id="email"
                      className="input input-primary"
                      placeholder="Enter your email or mobile number"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm text-start">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <CButton
                      loading={btnloading}
                      variant={ButtonType.Primary}
                      className="w-full"
                    >
                      Log in
                    </CButton>
                  </div>
                </form>

                <p className="mt-6 text-sm text-center text-primary">
                  {`Don't have an account yet?`}{" "}
                  <Link
                    href="/signup"
                    className="text-primary focus:outline-none focus:underline hover:underline"
                  >
                    Sign up
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-7/12">
            <AuthScreenSection
              title="Welcome Back, Event Architect"
              description="Log in to discover top-tier artists, manage your events, and streamline bookings — all from one powerful platform built for modern hosts and planners."
              imageUrl="https://res.cloudinary.com/duhefgqh4/image/upload/v1748802767/pexels-ulltangfilms-593345_xlqena.jpg"
              backgroundColor="#dfdf1e"
            />
          </div>
        </div>
      </div>

      <ReusableModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={otpId === "" ? "Authenticator Code" : "Verification Code"}
        width="sm"
        comments="For your security, we want to make sure it's really you."
      >
        <form onSubmit={handleSubmit(onSubmitOtp)}>
          <div className="flex flex-col">
            <div className="flex flex-col mt-3 mb-6">
              <input
                type="text"
                value={otp}
                maxLength={6}
                autoFocus={true}
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, "");
                  if (input.length > 6) {
                    input = input.slice(0, 6);
                  }
                  setOtp(input);
                }}
                className="input input-primary mb-1"
                placeholder="Enter 6-digit verification code"
              />
              {otpId !== "" ? (
                <div className="self-end">
                  {showResendButton ? (
                    <button
                      type="button"
                      className="text-primary text-end focus:outline-none focus:underline hover:underline text-sm"
                      onClick={resendOtp}
                    >
                      Resend Code
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Resend Code in {timer}s
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <CButton
              loading={btnloading}
              variant={ButtonType.Primary}
              disabled={otp.length !== 6}
              className="btn btn-primary"
            >
              Submit
            </CButton>
          </div>
        </form>
      </ReusableModal>
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookieHeader = context.req.headers.cookie ?? "";

  const tokenExists = cookieHeader.includes("accessToken=");

  if (!tokenExists) {
    return {
      props: {},
    };
  }

  try {
    const response = await sdk.MeCheckUser(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response && response.meUser) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch (error) {
    return {
      props: {},
    };
  }
};
