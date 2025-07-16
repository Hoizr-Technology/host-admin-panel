import ReusableModal from "@/components/common/modal/modal";
import useGlobalStore from "@/store/global";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import logo1 from "../assets/logo/text.png";
import AuthScreenSection from "@/components/common/authScreenSection/authScreenSection";
import { extractErrorMessage, sanitizeText } from "@/utils/functions/common";
import { UserType } from "@/generated/graphql";
import CButton from "@/components/common/buttons/button";
import { ButtonType } from "@/components/common/buttons/interface";

enum CommunicationType {
  Email = "EMAIL",
  Sms = "SMS",
}

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  commPref: CommunicationType[];
}

interface IOTPFormInput {
  emailOtp: string;
  numberOtp: string;
}

const Signup: FC = () => {
  const router = useRouter();
  const { setToastData } = useGlobalStore();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [commPref, setCommPref] = useState<CommunicationType[]>([]);
  const [emailOtpVerifyKey, setEmailOtpVerifyKey] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>("");
  const [otpWhatsApp, setOtpWhatsApp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [otpId, setOTPId] = useState<string>("");
  const [timer, setTimer] = useState(30);

  const [showResendButton, setShowResendButton] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({});

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
    reset,
  } = useForm<IOTPFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { firstName, lastName, email, phone, commPref = [] } = data;

    const accountPreferences = {
      email:
        Array.isArray(commPref) && commPref.includes(CommunicationType.Email),
      sms: Array.isArray(commPref) && commPref.includes(CommunicationType.Sms),
    };

    if (
      sanitizeText(firstName).length > 20 ||
      sanitizeText(lastName).length > 20
    ) {
      setToastData({
        message: "First name or last name should be of maximum 20 characters",
        type: "error",
      });
      return;
    }

    try {
      const response = await sdk.userSignup({
        input: {
          firstName: sanitizeText(firstName),
          lastName: sanitizeText(lastName),
          email: sanitizeText(email),
          phone,
          userType: UserType.Host,
        },
      });

      if (response && response.userSignup) {
        setToastData({
          message: "Verification code sent to your email",
          type: "success",
        });
        setOTPId(response.userSignup);
        setShowModal(true);
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
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const resendOtp = async () => {
    await onSubmit({ firstName, lastName, email, phone, commPref });
    reset();
    setOtpEmail("");
    setOtpWhatsApp("");
    setToastData({
      message: "Verification code sent successfully",
      type: "success",
    });
  };

  const onSubmitOtp: SubmitHandler<IOTPFormInput> = async (data) => {
    const { emailOtp } = data;

    try {
      const response = await sdk.userSignupVerification({
        input: {
          otpId: otpId,
          email: sanitizeText(email),
          phone,
          otp: emailOtp,
          firstName: sanitizeText(firstName),
          lastName: sanitizeText(lastName),
          userType: UserType.Host,
        },
      });

      if (response && response.userSignupVerification) {
        setShowModal(false);
        setToastData({ message: "Verification Successful", type: "success" });
        router.replace("/onboarding/host/about-us");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
      reset();
      setOtpEmail("");
      setOtpWhatsApp("");
    }
  };

  useEffect(() => {
    if (timer === 0) {
      setShowResendButton(true);
    } else if (timer < 0) {
      setTimer(0);
    } else {
      setShowResendButton(false);
    }
  }, [timer]);

  useEffect(() => {
    setOtpEmail("");
    setOtpWhatsApp("");
  }, [showModal]);

  return (
    <div className="bg-surface">
      <div className="bg-surface">
        <div className="flex flex-col lg:flex-row max-h-screen">
          {/* Left side - Signup Form */}
          <div className="w-full flex items-center lg:w-5/12 px-6 py-8 lg:mx-auto h-screen overflow-y-scroll">
            <div className="w-full max-w-md my-auto mx-auto">
              <div className="text-center">
                <div className="relative z-10 flex items-center justify-center">
                  <Image className="mb-4" src={logo1} alt="Logo" width={200} />
                </div>
                <h1 className="mt-0 text-primary">
                  Sign up to create your account
                </h1>
              </div>

              <div className="mt-8">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="col-span-2">
                    <label
                      htmlFor="firstName"
                      className="block mb-2 text-sm font-medium text-foreground"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register("firstName", {
                        required: "First Name is required",
                        minLength: {
                          value: 3,
                          message:
                            "First Name must be at least 3 characters long",
                        },
                        pattern: {
                          value: /^[a-zA-Z.'\s]{3,}$/,
                          message: "Only alphabets are allowed",
                        },
                      })}
                      id="firstName"
                      className="input input-foreground"
                      placeholder="Enter your First Name"
                      value={firstName}
                      onChange={(e) => {
                        let input = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                        setFirstName(input);
                      }}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm text-start">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="lastName"
                      className="block mb-2 text-sm font-medium text-foreground"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register("lastName", {
                        required: "Last Name is required",
                        minLength: {
                          value: 3,
                          message:
                            "Last Name must be at least 3 characters long",
                        },
                        pattern: {
                          value: /^[a-zA-Z.'\s]{3,}$/,
                          message: "Only alphabets are allowed",
                        },
                      })}
                      id="lastName"
                      className="input input-primary"
                      placeholder="Enter your Last Name"
                      value={lastName}
                      onChange={(e) => {
                        let input = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                        setLastName(input);
                      }}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm text-start">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-foreground"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      id="email"
                      className="input input-primary"
                      placeholder="Enter your Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm text-start">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-foreground"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-700 font-bold sm:text-sm">
                          +1
                        </span>
                      </div>
                      <input
                        type="text"
                        style={{
                          appearance: "textfield",
                        }}
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Invalid phone number",
                          },
                        })}
                        id="phone"
                        maxLength={10}
                        className="input input-primary pl-10"
                        placeholder="Enter your Phone Number"
                        value={phone}
                        onChange={(e) => {
                          let input = e.target.value.replace(/\D/g, "");
                          if (input.length > 10) {
                            input = input.slice(0, 10);
                          }
                          setPhone(input);
                        }}
                        onWheel={(e) => e.preventDefault()}
                        onKeyDown={(e) => {
                          if (e.key === "e" || e.key === "-" || e.key === "+") {
                            e.preventDefault();
                          }
                        }}
                        onFocus={(e) =>
                          e.target.addEventListener("wheel", (event) =>
                            event.preventDefault()
                          )
                        }
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm text-start">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="commPref"
                      className="block mb-2 text-sm font-medium text-foreground"
                    >
                      Communication Preferences
                    </label>
                    <div className="flex flex-col gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value={CommunicationType.Email}
                          className="form-checkbox"
                          onChange={(e) => {
                            setCommPref((prev) => {
                              const updatedPrefs = e.target.checked
                                ? [...prev, CommunicationType.Email]
                                : prev.filter(
                                    (pref) => pref !== CommunicationType.Email
                                  );
                              return updatedPrefs;
                            });
                          }}
                        />
                        <span className="ml-2 text-foreground text-xs">{`I consent to receive Emails from Hoizr Technologies. Click on the Unsubscribe link to stop further email communications.`}</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value={CommunicationType.Sms}
                          className="form-checkbox"
                          onChange={(e) => {
                            setCommPref((prev) => {
                              const updatedPrefs = e.target.checked
                                ? [...prev, CommunicationType.Sms]
                                : prev.filter(
                                    (pref) => pref !== CommunicationType.Sms
                                  );
                              return updatedPrefs;
                            });
                          }}
                        />
                        <span className="ml-2 text-foreground text-xs">{`I consent to receive SMS from Hoizr Technologies. Reply STOP to opt-out; Reply HELP for support; Message and data rates apply; Messaging frequency may vary.`}</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-5">
                    <p className="text-sm text-primary">
                      {`By signing up, you agree to HOIZR's`}{" "}
                      <Link
                        href="https://www.hoizr.com/terms-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary focus:outline-none focus:underline hover:underline"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="https://www.hoizr.com/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary focus:outline-none focus:underline hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>

                    <div className="flex justify-end">
                      <CButton
                        className="w-full"
                        variant={ButtonType.Primary}
                        type="submit"
                      >
                        Sign Up
                      </CButton>
                    </div>
                  </div>
                </form>

                <p className="mt-6 text-sm text-center text-primary">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary focus:outline-none focus:underline hover:underline"
                  >
                    Login
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Auth Screen Section */}
          <div className="w-full lg:w-7/12">
            <AuthScreenSection
              title="Built for Hosts Who Create the Night"
              description="Join Hoizr to discover talented artists, streamline your event planning, and manage bookings — all from one platform built for venues, planners, and nightlife professionals."
              imageUrl="https://res.cloudinary.com/duhefgqh4/image/upload/v1748802769/pexels-isabella-mendes-107313-332688_vtgnt0.jpg"
              backgroundColor="#dfdf1e"
            />
          </div>
        </div>
      </div>
      {showModal && (
        <ReusableModal
          title={"Verification Code"}
          width="sm"
          comments="For your security, we want to make sure it's really you."
          onClose={() => setShowModal(false)}
          isOpen={showModal}
        >
          <form onSubmit={handleSubmitOtp(onSubmitOtp)}>
            <div className="flex flex-col">
              <input
                type="text"
                id="otpEmail"
                placeholder="Enter Verification Code"
                className="input input-primary mb-1"
                {...registerOtp("emailOtp", { required: true })}
                value={otpEmail}
                maxLength={6}
                autoFocus={true}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     e.preventDefault();
                //     if (otpEmail.length === 6) {
                //       handleSubmitOtp(onSubmitOtp);
                //     }
                //   }
                // }}
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, "");
                  if (input.length > 6) {
                    input = input.slice(0, 6);
                  }
                  setOtpEmail(input);
                }}
              />
              {showResendButton ? (
                <button
                  type="button"
                  className="text-primary text-start focus:outline-none focus:underline hover:underline text-sm mb-3 self-end"
                  onClick={resendOtp}
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-sm text-gray-500 mb-6 self-end">
                  Resend Code in {timer}s
                </p>
              )}
            </div>

            {otpError && (
              <p className="text-red-500 text-sm mt-2">{otpError}</p>
            )}

            <CButton
              variant={ButtonType.Primary}
              type="submit"
              className="w-full"
              disabled={otpEmail.length !== 6}
            >
              Submit
            </CButton>
          </form>
        </ReusableModal>
      )}
    </div>
  );
};

export default Signup;

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
