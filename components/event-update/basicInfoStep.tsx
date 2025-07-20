import { motion } from "framer-motion";
import { useState } from "react";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { useRouter } from "next/router";
import { extractErrorMessage } from "@/utils/functions/common";
import CButton from "../common/buttons/button";
import { ButtonType } from "../common/buttons/interface";
import { EventType } from "@/generated/graphql";
import { useEventUpdateStore } from "@/store/eventUpdate.store";

const eventTypes = [
  {
    type: EventType.Private,
    label: "Private",
    description: "Private event",
  },
  {
    type: EventType.Public,
    label: "Public",
    description: "Public event",
  },
  {
    type: EventType.InviteOnly,
    label: "Invite Only",
    description: "Exclusive event",
  },
  {
    type: EventType.Ticketed,
    label: "Ticketed",
    description: "Ticketed event",
  },
];

const BasicInfoStep = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const { setToastData } = useGlobalStore();
  const [btnLoading, setBtnLoading] = useState(false);

  const {
    title,
    setTitle,
    description,
    setDescription,
    eventDate,
    setEventDate,
    endDate,
    setEndDate,
    eventType,
    setEventType,
  } = useEventUpdateStore();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !eventType) {
      setToastData({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    try {
      setBtnLoading(true);
      await sdk.updateEvent({
        eventId: eventId as string,
        isFinalStep: false,
        input: {
          title,
          description,
          eventDate: new Date(eventDate),
          endDate: new Date(endDate),
          eventType,
          firstStepCompleted: true,
        },
      });
      router.push(`/event-update/location?eventId=${eventId}`);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full mb-auto sm:px-12 max-w-3xl flex flex-col justify-between bg-transparent items-center space-y-6 text-center relative"
      // ... animation props ...
    >
      <h1 className="text-3xl font-medium text-white">Event Basics</h1>
      <div className="w-full rounded-xl shadow-sm p-6 bg-surface">
        <div className="space-y-6 p-4">
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-primary"
              placeholder="Enter event title"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-primary h-32"
              placeholder="Describe your event..."
              maxLength={500}
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Event Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {eventTypes.map((type) => (
                <div
                  key={type.type}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    eventType === type.type
                      ? "border-primary bg-primary/10"
                      : "border-gray-600 hover:border-gray-400"
                  }`}
                  onClick={() => setEventType(type.type)}
                >
                  <h3 className="font-medium">{type.label}</h3>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="input input-primary"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between space-x-6">
        <CButton
          variant={ButtonType.Secondary}
          onClick={() => router.push("/events")}
          className="w-full"
        >
          Cancel
        </CButton>
        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          onClick={handleSubmit}
          className="w-full"
        >
          Continue
        </CButton>
      </div>
    </motion.div>
  );
};

export default BasicInfoStep;
