import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { extractErrorMessage } from "@/utils/functions/common";
import CButton from "../common/buttons/button";
import { ButtonType } from "../common/buttons/interface";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import debounce from "lodash.debounce";
import useMasterStore from "@/store/masters";
import { useOnboardingStore } from "@/store/onboarding";

// Keep the same interface as artist
interface IFormInput {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: { id: string; value: string } | null;
  zipcode: number;
  location: PlacesType;
}

type PlacesType = {
  label: string;
  value: string;
};

const loadOptions = (
  inputValue: string,
  callback: (options: PlacesType[]) => void
) => {
  sdk.AllPlaces({ input: inputValue }).then((d) => {
    callback(
      d.getPlacesList.map((el) => ({
        label: el.displayName,
        value: el.placeId,
      }))
    );
  });
};

const HostLocation = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const [btnLoading, setBtnLoading] = useState(false);
  const [coords, setCoords] = useState<number[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlacesType | null>(null);

  // Get from host store instead of artist store
  const {
    addressLine1,
    addressLine2,
    city,
    state,
    zipcode,
    cords,
    place,
    setAddressLine1,
    setAddressLine2,
    setCity,
    setState,
    setZipcode,
    setCords,
    setPlace,
  } = useOnboardingStore();

  useEffect(() => {
    console.log("states changed", state);
  }, [state]);
  const { statesOptions } = useMasterStore();

  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  // Same initialization as artist
  useEffect(() => {
    setValue("addressLine1", addressLine1);
    setValue("addressLine2", addressLine2);
    setValue("city", city);
    if (state?.id && state?.value) {
      setValue("state", { id: state.id, value: state.value });
    }
    setValue("zipcode", Number(zipcode));

    if (place?.displayName && place?.placeId) {
      setSelectedPlace({ label: place.displayName, value: place.placeId });
      setValue("location", { label: place.displayName, value: place.placeId });
    }

    if (cords[0] !== 0 && cords[1] !== 0) {
      setCoords(cords);
    }
  }, [
    setValue,
    addressLine1,
    addressLine2,
    city,
    state,
    zipcode,
    place,
    cords,
  ]);

  const debouncedLoadOptions = debounce(loadOptions, 800);

  // Same reset logic as artist
  const resetLocation = () => {
    setSelectedPlace(null);
    setCoords([]);
    setValue("location", { label: "", value: "" });
    setValue("addressLine1", "");
    setValue("addressLine2", "");
    setValue("city", "");
    setValue("state", null);
    setValue("zipcode", NaN);

    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState(null);
    setZipcode("");
    setPlace({ displayName: "", placeId: "" });
    setCords([0, 0]);
  };

  // Only change the API call and navigation
  const onSubmitForm = async (data: IFormInput) => {
    try {
      setBtnLoading(true);

      if (!data.state) {
        setToastData({
          message: "Please select a state",
          type: "error",
        });
        return;
      }

      await sdk.hostOnboarding({
        input: {
          address: {
            addressLine1: data.addressLine1,
            addressLine2: data?.addressLine2 ? data?.addressLine2 : null,
            city: data.city,
            state: { stateId: data.state.id, stateName: data.state.value },
            zipcode: data.zipcode,
            place: {
              displayName: selectedPlace?.label ?? "",
              placeId: selectedPlace?.value ?? "",
            },
            coordinate: {
              coordinates: coords,
            },
          },
        },
      });

      router.push("/onboarding/host/additonal-details");
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
  console.log("statesOptions", statesOptions);
  console.log("stats", state);
  return (
    <motion.div
      className="z-10 w-full mb-auto mt-6 h-full bg-transparent max-w-4xl flex flex-col items-center space-y-5 text-center relative"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { staggerChildren: 0.2 },
        },
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.3, type: "spring" }}
    >
      <div className="w-full max-w-4xl bg-surface rounded-xl shadow-sm p-6">
        <form
          className="space-y-4 w-full p-4 max-h-[calc(100vh-20rem)] overflow-y-auto"
          onSubmit={handleSubmit(onSubmitForm)}
        >
          {/* Keep all the same form fields as artist */}
          <div className="col-span-2">
            <div className="flex justify-between">
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-left text-gray-300"
              >
                Search Venue Location
              </label>
              {selectedPlace && (
                <button
                  type="button"
                  onClick={resetLocation}
                  className="text-primary hover:underline cursor-pointer text-xs mt-1"
                >
                  Reset Location
                </button>
              )}
            </div>
            <div className="flex">
              <AsyncSelect
                id="location"
                {...register("location", { required: "Location is required" })}
                className="mt-1 text-sm rounded-xl w-full focus:outline-none text-left"
                classNamePrefix="react-select"
                placeholder="Search location"
                value={selectedPlace}
                menuPlacement="auto"
                maxMenuHeight={200}
                noOptionsMessage={() => "Search for your desired location"}
                onChange={async (option) => {
                  setSearchLoading(true);
                  setSelectedPlace({
                    label: option?.label ?? "",
                    value: option?.value ?? "",
                  });
                  setPlace({
                    displayName: option?.label ?? "",
                    placeId: option?.value ?? "",
                  });

                  try {
                    const d = await sdk.PlaceDetails({
                      placeId: option?.value ?? "",
                    });

                    if (d.getPlaceDetails) {
                      setCoords([
                        d.getPlaceDetails.latitude,
                        d.getPlaceDetails.longitude,
                      ]);
                      setCords([
                        d.getPlaceDetails.latitude,
                        d.getPlaceDetails.longitude,
                      ]);

                      // Set addressLine1
                      if (d.getPlaceDetails.address) {
                        setValue("addressLine1", d.getPlaceDetails.address);
                        setAddressLine1(d.getPlaceDetails.address);
                      } else {
                        setValue("addressLine1", "");
                        setAddressLine1("");
                      }

                      // Set city
                      if (d.getPlaceDetails.city) {
                        setValue("city", d.getPlaceDetails.city);
                        setCity(d.getPlaceDetails.city);
                      } else {
                        setValue("city", "");
                        setCity("");
                      }

                      // Set zipcode
                      if (d.getPlaceDetails.zipcode) {
                        const zipcodeValue = parseFloat(
                          d.getPlaceDetails.zipcode
                        );
                        setValue("zipcode", zipcodeValue);
                        setZipcode(zipcodeValue.toString());
                      } else {
                        setValue("zipcode", NaN);
                        setZipcode("");
                      }

                      // Set state
                      const foundState = statesOptions.find((state) => {
                        return (
                          d?.getPlaceDetails?.state &&
                          state.label.trim().toLowerCase() ===
                            d.getPlaceDetails.state.trim().toLowerCase()
                        );
                      });

                      if (foundState) {
                        setValue("state", {
                          id: foundState.value,
                          value: foundState.label,
                        });
                        setState({
                          id: foundState.value,
                          value: foundState.label,
                        });
                      } else {
                        setValue("state", null);
                        setState(null);
                      }
                    }
                  } catch (error) {
                    console.error("Error fetching place details:", error);
                  } finally {
                    setSearchLoading(false);
                  }

                  setValue("location", {
                    value: option?.value ?? "",
                    label: option?.label ?? "",
                  });
                }}
                loadOptions={debouncedLoadOptions}
              />
              {searchLoading && (
                <div className="flex ml-2 items-center h-10">
                  <FaSpinner className="animate-spin text-primary" />
                </div>
              )}
            </div>

            <p className="text-gray-500 text-xs mt-1 mx-1 text-start">
              After selecting a location all other details will be auto filled.
            </p>

            {errors.location && (
              <p className="text-red-500 text-sm text-start">
                {errors.location.message}
              </p>
            )}
          </div>

          <div
            className={`grid ${
              coords.length === 2 ? "grid-cols-10" : "grid-cols-7"
            } gap-2 transition-all`}
          >
            {coords.length === 2 && (
              <div className="col-span-10 md:col-span-3 px-2 py-2 rounded-2xl h-[15rem] md:h-auto">
                <iframe
                  src={`https://maps.google.com/maps?q=${coords[0]}, ${coords[1]}&z=10&output=embed`}
                  className="w-full h-full rounded-2xl"
                ></iframe>
              </div>
            )}
            <div className="col-span-10 md:col-span-7 flex flex-col space-y-4">
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                  Address Line 1
                </label>
                <input
                  type="text"
                  {...register("addressLine1", {
                    required: "Address Line 1 is required",
                  })}
                  className="input input-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Address Line 1"
                  onChange={(e) => setAddressLine1(e.target.value)}
                  disabled={(getValues()["addressLine1"]?.length ?? 0) === 0}
                />
                {errors.addressLine1 && (
                  <p className="text-red-500 text-sm text-start">
                    {errors.addressLine1.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                  Address Line 2
                </label>
                <input
                  type="text"
                  {...register("addressLine2", {})}
                  className="input input-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Address Line 2 (optional)"
                  onChange={(e) => setAddressLine2(e.target.value)}
                  disabled={(getValues()["location"]?.label?.length ?? 0) === 0}
                />
                {errors.addressLine2 && (
                  <p className="text-red-500 text-sm text-start">
                    {errors.addressLine2.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="col-span-3 flex-1">
                  <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                    City
                  </label>
                  <input
                    type="text"
                    {...register("city", { required: "City is required" })}
                    className="input input-primary disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                    disabled={
                      (getValues()["city"]?.length ?? 0) === 0 &&
                      (place?.displayName?.length ?? 0) === 0
                    }
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm text-start">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 flex-1">
                  <label
                    htmlFor="state"
                    className="block mb-2 text-sm font-medium text-left text-gray-300"
                  >
                    State
                  </label>
                  <Controller
                    name="state"
                    control={control}
                    rules={{ required: "State is required" }}
                    render={({ field }) => (
                      <Select
                        classNames={{
                          control: (state) =>
                            `${
                              state.isDisabled
                                ? "!opacity-40 !cursor-not-allowed !bg-surface !font-normal !text-white"
                                : "!bg-surface !text-white"
                            }`,
                          option: (state) =>
                            `!text-sm !bg-surface hover:!bg-primary hover:!text-black focus:!bg-transparent text-left ${
                              state.isSelected ? "!bg-primary !text-white" : ""
                            }  `,
                          placeholder: (state) =>
                            `text-sm text-left font-normal`,
                          singleValue: (state) =>
                            `text-sm text-left font-noraml`,
                        }}
                        {...field}
                        id="state"
                        options={statesOptions.map((el) => ({
                          id: el.value,
                          value: el.label,
                        }))}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={
                          typeof window !== "undefined" ? document.body : null
                        }
                        menuShouldScrollIntoView={false}
                        getOptionLabel={(e) => e.value}
                        getOptionValue={(e) => e.id}
                        classNamePrefix="react-select"
                        placeholder="Select State"
                        value={
                          (console.log("hs", state),
                          state
                            ? { id: state.id, value: state.value }
                            : undefined)
                        }
                        onChange={(option) => {
                          setValue("state", option);
                          setState({
                            id: option?.id ?? "",
                            value: option?.value ?? "",
                          });
                        }}
                      />
                    )}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm text-start">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                  Zipcode
                </label>
                <input
                  type="number"
                  {...register("zipcode", {
                    pattern: {
                      value: /^\d{5}(-\d{4})?$/,
                      message: "Invalid zipcode format",
                    },
                    required: "Zipcode is required",
                  })}
                  className="input input-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Zipcode"
                  step="0.01"
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
                  onChange={(e) => setZipcode(e.target.value)}
                  disabled={
                    (getValues()["zipcode"]?.toString()?.length ?? 0) === 0
                  }
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-sm text-start">
                    {errors.zipcode.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="w-full max-w-4xl bg-transparent">
        <div className="flex space-x-2">
          <CButton
            loading={btnLoading}
            variant={ButtonType.Secondary}
            onClick={() => router.push("/onboarding/host/business-info")}
            className="w-full"
          >
            Back
          </CButton>
          <CButton
            loading={btnLoading}
            variant={ButtonType.Primary}
            onClick={handleSubmit(onSubmitForm)}
            className="w-full"
          >
            Continue
          </CButton>
        </div>
      </div>
    </motion.div>
  );
};

export default HostLocation;
