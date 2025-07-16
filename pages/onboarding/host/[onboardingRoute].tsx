import OnboardingLayout from "@/components/layouts/onboarding.layout";
import HostLocation from "@/components/onboarding/hostLocation.onboarding";
import OnboardingAboutUsHost from "@/components/onboarding/hostAboutUs.onboarding";
import HostBasicInfo from "@/components/onboarding/hostBasicInfo.onboarding";
import HostVenueTypeSelection from "@/components/onboarding/hostVenueTypeSelection.onboarding";
import { useOnboardingStore } from "@/store/onboarding";
import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import HostAdditionalDetails from "@/components/onboarding/hostAdditional.onboaridn";
import { redirectPathFromStatus } from "@/utils/functions/redirectPathFromStatus";
import { ProfileStatus } from "@/generated/graphql";

type HomePageProps = {
  repo: {
    pagePath: string;
    user?: any;
    venueType?: any; // Changed from artistType
    hostName?: any; // New
    description?: any; // New
    logoUrl?: any; // New
    contactEmail?: any; // New
    contactPhone?: any; // New
    address?: any;
    websiteUrl?: any;
    socialLinks?: any;
    businessRegistrationNumber?: any; // New
    averageEventSize?: any; // New
    gstNumber?: any; // New
  };
};

const OnboardingPage = ({ repo }: HomePageProps) => {
  const {
    // Step 2
    setVenueType, // Changed from setArtistType

    // Step 3
    setHostName, // New
    setDescription, // New
    setLogoUrl, // New
    setContactEmail, // New
    setContactPhone, // New

    // Step 4
    setBusinessRegistrationNumber, // New
    setAverageEventSize, // New
    setGstNumber, // New

    // Address
    setAddressLine1,
    setAddressLine2,
    setCity,
    setCords,
    setPlace,
    setState,
    setZipcode,

    // Other data
    setUser,
    setWebsiteUrl,
    setSocialLinks,
  } = useOnboardingStore();

  useEffect(() => {
    // Set user info
    setUser(repo.user);

    // Step 2 - Venue Type
    setVenueType(repo.venueType || ""); // Changed from artistType

    // Step 3 - Host Info
    setHostName(repo.hostName || ""); // New
    setDescription(repo.description || ""); // New
    setLogoUrl(repo.logoUrl || ""); // New
    setContactEmail(repo.contactEmail || ""); // New
    setContactPhone(repo.contactPhone || ""); // New

    // Step 4 - Address Info
    setAddressLine1(repo.address?.addressLine1 || "");
    setAddressLine2(repo.address?.addressLine2 || "");
    setCity(repo.address?.city || "");
    setZipcode(repo.address?.zipcode || "");
    setCords(repo.address?.coordinate?.coordinates || [0, 0]);
    setPlace(
      repo.address?.place
        ? {
            displayName: repo.address.place.displayName,
            placeId: repo.address.place.placeId,
          }
        : null
    );
    setState(
      repo.address?.state
        ? {
            id: repo.address?.state?.stateId,
            value: repo.address.state?.stateName,
          }
        : { id: "", value: "" }
    );

    // Other data
    setWebsiteUrl(repo.websiteUrl || "");
    setSocialLinks(
      repo.socialLinks || {
        instagram: "",
        soundcloud: "",
        spotify: "",
        youtube: "",
        mixcloud: "",
        bandcamp: "",
      }
    );

    setBusinessRegistrationNumber(repo.businessRegistrationNumber || ""); // New
    setAverageEventSize(repo.averageEventSize || 0); // New
    setGstNumber(repo.gstNumber || ""); // New
  }, [
    repo,
    setUser,
    setVenueType, // Changed
    setHostName, // New
    setDescription, // New
    setLogoUrl, // New
    setContactEmail, // New
    setContactPhone, // New
    setBusinessRegistrationNumber, // New
    setAverageEventSize, // New
    setGstNumber, // New
    setAddressLine1,
    setAddressLine2,
    setCity,
    setCords,
    setPlace,
    setZipcode,
    setWebsiteUrl,
    setSocialLinks,
  ]);

  let childComponent;

  switch (repo.pagePath) {
    case "about-us":
      childComponent = <OnboardingAboutUsHost />;
      break;
    case "venue-type":
      childComponent = <HostVenueTypeSelection />;
      break;
    case "host-basic-info":
      childComponent = <HostBasicInfo />;
      break;
    case "location-info":
      childComponent = <HostLocation />;
      break;
    case "additonal-details": // Changed from genres
      childComponent = <HostAdditionalDetails />;
      break;
    default:
      childComponent = <div>Default Component</div>;
      break;
  }

  return <OnboardingLayout>{childComponent}</OnboardingLayout>;
};

export default OnboardingPage;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context
) => {
  const cookieHeader = context.req.headers.cookie ?? "";

  const tokenExists = cookieHeader.includes("accessToken=");
  if (!tokenExists) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const res = await sdk.meCheckHost(
      {},
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    const redirectUrl = redirectPathFromStatus(
      res.meHost.status ?? ProfileStatus.Blocked
    );
    if (status === ProfileStatus.OnboardingPending) {
      const response = await sdk.hostOnboardingData(
        {},
        {
          cookie: context.req.headers.cookie?.toString() ?? "",
        }
      );

      if (response && response.hostOnboardingData) {
        const {
          venueType, // Changed
          hostName, // New
          description, // New
          logoUrl, // New
          contactEmail, // New
          contactPhone, // New
          address,
          websiteUrl,
          socialLinks,
          businessRegistrationNumber, // New
          averageEventSize, // New
          gstNumber, // New
        } = response.hostOnboardingData;

        return {
          props: {
            repo: {
              pagePath: context.query["onboardingRoute"]?.toString() ?? "",
              user: response.hostOnboardingData.user,
              venueType, // Changed
              hostName, // New
              description, // New
              logoUrl, // New
              contactEmail, // New
              contactPhone, // New
              address,
              websiteUrl,
              socialLinks,
              businessRegistrationNumber, // New
              averageEventSize, // New
              gstNumber, // New
            },
          },
        };
      } else if (response.hostOnboardingData === null) {
        return {
          props: {
            repo: {
              pagePath: context.query["onboardingRoute"]?.toString() ?? "",
              user: null,
              venueType: null, // Changed
              hostName: null, // New
              description: null, // New
              logoUrl: null, // New
              contactEmail: null, // New
              contactPhone: null, // New
              address: null,
              websiteUrl: null,
              socialLinks: null,
              businessRegistrationNumber: null, // New
              averageEventSize: null, // New
              gstNumber: null, // New
            },
          },
        };
      } else {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
    } else return redirectUrl;
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
