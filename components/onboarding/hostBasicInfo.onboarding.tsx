import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FiCamera,
  FiUser,
  FiUpload,
  FiX,
  FiImage,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { useRouter } from "next/router";
import { extractErrorMessage } from "@/utils/functions/common";
import CButton from "../common/buttons/button";
import { ButtonType } from "../common/buttons/interface";
import { VenueType } from "@/generated/graphql"; // Import VenueType enum
import { useOnboardingStore } from "@/store/onboarding";

const HostBasicInfo = () => {
  const { setToastData } = useGlobalStore();
  const router = useRouter();
  const [btnLoading, setBtnLoading] = useState(false);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const {
    user,
    venueType,
    hostName,
    setHostName,
    description,
    setDescription,
    logoUrl,
    setLogoUrl,
    contactEmail,
    setContactEmail,
    contactPhone,
    setContactPhone,
  } = useOnboardingStore();

  // Create preview for selected image
  useEffect(() => {
    if (logoImage) {
      const objectUrl = URL.createObjectURL(logoImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [logoImage]);

  // Get venue-specific label and placeholder
  const getVenueNameInfo = () => {
    switch (venueType) {
      case VenueType.Bar:
        return { label: "Bar Name", placeholder: "Enter your bar name" };
      case VenueType.Club:
        return { label: "Club Name", placeholder: "Enter your club name" };
      case VenueType.ConcertHall:
        return { label: "Venue Name", placeholder: "Enter your venue name" };
      case VenueType.Festival:
        return {
          label: "Festival Name",
          placeholder: "Enter your festival name",
        };
      case VenueType.Outdoor:
        return { label: "Venue Name", placeholder: "Enter your venue name" };
      case VenueType.PrivateEvent:
        return {
          label: "Business Name",
          placeholder: "Enter your business name",
        };
      case VenueType.Restaurant:
        return {
          label: "Restaurant Name",
          placeholder: "Enter your restaurant name",
        };
      default:
        return { label: "Host Name", placeholder: "Enter your host name" };
    }
  };

  const { label: venueNameLabel, placeholder: venueNamePlaceholder } =
    getVenueNameInfo();

  // Cloudinary upload function
  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!file) return "";

    const formData = new FormData();
    const imageFileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    // Create a clean filename
    const sanitizedFileName = `${
      hostName || "host"
    }_${Date.now()}.${imageFileExtension}`.replace(/[^a-zA-Z0-9._-]/g, "");

    formData.append("file", file, sanitizedFileName);
    formData.append("upload_preset", "client_uploads");
    formData.append("folder", "host/logo"); // Changed folder
    formData.append("public_id", `${hostName || "host"}_${Date.now()}`);

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/duhefgqh4/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Upload failed: ${response.statusText}`
        );
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to upload image to Cloudinary"
      );
    }
  };

  // Dropzone configuration
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setToastData({
            message: "File size should be less than 5MB",
            type: "error",
          });
          return;
        }
        setLogoImage(file);
      }
    },
    [setToastData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  const removeImage = () => {
    setLogoImage(null);
    setPreviewUrl(null);
    if (logoUrl) {
      setLogoUrl("");
    }
  };

  const handleSubmit = async () => {
    try {
      setBtnLoading(true);

      // Upload logo if new image is selected
      let uploadedLogoUrl = logoUrl;
      if (logoImage) {
        setImageUploading(true);
        try {
          uploadedLogoUrl = await uploadToCloudinary(logoImage);
        } catch (error) {
          setToastData({
            message: "Failed to upload logo",
            type: "error",
          });
          return;
        } finally {
          setImageUploading(false);
        }
      }

      // Save to store
      setLogoUrl(uploadedLogoUrl);

      // Submit to API
      await sdk.hostOnboarding({
        input: {
          hostName: hostName.trim(),
          description: description.trim(),
          logoUrl: uploadedLogoUrl,
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
        },
      });

      // Go to next step
      router.push("/onboarding/host/location-info");
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
      className="w-full mb-auto sm:px-12 max-w-3xl flex flex-col justify-between bg-transparent items-center space-y-3 text-center relative"
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
      <h2 className="text-3xl font-medium text-white">Business Information</h2>
      <div className="w-full rounded-xl shadow-sm p-6 bg-surface">
        <div className="space-y-6 p-4">
          {/* Admin Name Field (Disabled) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Admin Name
            </label>
            <input
              type="text"
              value={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
              className="input input-primary w-full"
              placeholder="Admin name"
              disabled
              maxLength={50}
            />
          </div>

          {/* Venue Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              {venueNameLabel} *
            </label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="input input-primary w-full"
              placeholder={venueNamePlaceholder}
              maxLength={50}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {hostName.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-primary w-full h-32"
              placeholder="Tell us about your venue and the types of events you host..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {description.length}/500 characters
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                Business Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="input input-primary w-full pl-10"
                  placeholder="contact@yourvenue.com"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium text-left text-gray-300">
                Business Phone *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="input input-primary w-full pl-10"
                  placeholder="+1 (555) 123-4567"
                  maxLength={20}
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-left text-gray-300">
              Venue Logo
            </label>

            <div className="flex items-center space-x-6">
              {/* Preview Image - Only show if image is selected */}
              {(previewUrl || logoUrl) && (
                <div className="relative flex-shrink-0">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary shadow-lg bg-gray-700 flex items-center justify-center">
                      {previewUrl || logoUrl ? (
                        <img
                          src={previewUrl || logoUrl || ""}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <FiImage className="w-10 h-10 text-gray-500" />
                      )}
                    </div>
                    <button
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Section - Only show if no image */}
              {!(previewUrl || logoUrl) && (
                <div className="flex-1">
                  <div
                    {...getRootProps()}
                    className={`
            relative w-full p-4 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
            ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-gray-600 hover:border-primary/50 hover:bg-gray-800/50"
            }
            ${imageUploading ? "pointer-events-none opacity-50" : ""}
          `}
                  >
                    <input {...getInputProps()} />

                    <div className="text-center">
                      <div className="mx-auto w-10 h-10 mb-2 flex items-center justify-center rounded-full bg-gray-700">
                        {imageUploading ? (
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiUpload className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-gray-300 text-sm font-medium">
                          {imageUploading
                            ? "Uploading..."
                            : isDragActive
                            ? "Drop image here"
                            : "Drag & drop or click to browse"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          PNG, JPG, GIF • Max 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Helper text below drop zone */}
                  <p className="text-xs text-gray-500 text-left mt-2">
                    • Upload your venue/business logo
                  </p>
                  <p className="text-xs text-gray-500 text-left">
                    • Recommended: Square image with transparent background
                  </p>
                  <p className="text-xs text-gray-500 text-left">
                    • Minimum size: 400x400px
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between space-x-6">
        <CButton
          loading={btnLoading}
          variant={ButtonType.Secondary}
          onClick={() => router.push("/onboarding/host/venue-type")}
          className="w-full"
        >
          Back
        </CButton>
        <CButton
          loading={btnLoading || imageUploading}
          variant={ButtonType.Primary}
          onClick={handleSubmit}
          disabled={
            !hostName.trim() ||
            !description.trim() ||
            !contactEmail.trim() ||
            !contactPhone.trim() ||
            imageUploading
          }
          className="w-full"
        >
          {imageUploading ? "Uploading..." : "Continue"}
        </CButton>
      </div>
    </motion.div>
  );
};

export default HostBasicInfo;
