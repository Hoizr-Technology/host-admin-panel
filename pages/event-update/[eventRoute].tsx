import { sdk } from "@/utils/graphqlClient";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { EventType, Genres } from "@/generated/graphql";
import { useRouter } from "next/router";
import { useEventUpdateStore } from "@/store/eventUpdate.store";
import EventUpdateLayout from "@/components/layouts/eventUpdateLayout";
import BasicInfoStep from "@/components/event-update/basicInfoStep";
import LocationStep from "@/components/event-update/locationStep";
import GenresStep from "@/components/event-update/genresStep";
import AdditionalInfoStep from "@/components/event-update/additionalInfoStep";

type EventUpdatePageProps = {
  eventData: {
    id: string;
    title: string;
    description: string;
    eventDate: string;
    endDate: string;
    eventType: EventType;
    location: {
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: { id: string; value: string } | null;
      zipcode: string;
      place: { displayName: string; placeId: string } | null;
      cords: [number, number];
    };
    genresPreferred: Genres[];
    expectedAudience: number;
    budget: { min: number; max: number };
    currency: string;
    pictures: string[];
  };
  isEdit: boolean;
};

const EventUpdatePage = ({ eventData, isEdit }: EventUpdatePageProps) => {
  const router = useRouter();
  const {
    setTitle,
    setDescription,
    setEventDate,
    setEndDate,
    setEventType,
    setLocation,
    setGenres,
    setExpectedAudience,
    setBudget,
    setCurrency,
    setPictures,
  } = useEventUpdateStore();

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title);
      setDescription(eventData.description);
      setEventDate(eventData.eventDate);
      setEndDate(eventData.endDate);
      setEventType(eventData.eventType);
      setLocation(eventData.location);
      setGenres(eventData.genresPreferred);
      setExpectedAudience(eventData.expectedAudience);
      setBudget(eventData?.budget?.min, eventData?.budget?.max);
      setCurrency(eventData.currency);
      setPictures(eventData.pictures);
    }
  }, [eventData]);

  let childComponent;

  switch (router.query.eventRoute) {
    case "basic-info":
      childComponent = <BasicInfoStep />;
      break;
    case "location":
      childComponent = <LocationStep />;
      break;
    case "genres":
      childComponent = <GenresStep />;
      break;
    case "additional-info":
      childComponent = <AdditionalInfoStep isEdit={isEdit} />;
      break;
    default:
      childComponent = <div>Invalid step</div>;
  }

  return <EventUpdateLayout>{childComponent}</EventUpdateLayout>;
};

export default EventUpdatePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { eventRoute, eventId, edit } = context.query;
  const isEdit = edit === "true";

  try {
    const response = await sdk.getEventById(
      { eventId: eventId as string },
      {
        cookie: context.req.headers.cookie?.toString() ?? "",
      }
    );

    if (response.getEventById) {
      const event = response.getEventById;
      return {
        props: {
          eventData: {
            id: event?._id,
            title: event?.title,
            description: event?.description,
            eventDate: event?.eventDate,
            endDate: event?.endDate,
            eventType: event?.eventType,
            location: {
              addressLine1: event?.location?.addressLine1,
              addressLine2: event?.location?.addressLine2 || "",
              city: event?.location?.city,
              state: event?.location?.state
                ? {
                    id: event?.location.state.stateId,
                    value: event?.location.state.stateName,
                  }
                : null,
              zipcode: event?.location?.zipcode,
              place: event?.location?.place
                ? {
                    displayName: event?.location?.place?.displayName,
                    placeId: event?.location?.place?.placeId,
                  }
                : null,
              cords: event.location?.coordinate?.coordinates,
            },
            genresPreferred: event?.genresPreferred,
            expectedAudience: event?.expectedAudience,
            budget: event?.budget,
            currency: event?.currency,
            pictures: event?.pictures || [],
          },
          isEdit,
        },
      };
    } else {
      return { notFound: true };
    }
  } catch (error) {
    console.error("Error fetching event data:", error);
    return { notFound: true };
  }
};
