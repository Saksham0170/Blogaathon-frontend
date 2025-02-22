"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import industrySelectItems from "@/lib/registerData";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  currentRole: string;
  organizationName: string;
  industry: string;
  city: string;
  otherRole: string;
  photoUrl?: string;
}

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
  onUpdateProfile,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  console.log(profileImage);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      setProfileImage(file);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const { data } = await axiosInstance.post("/api/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProfile((prev) => ({
          ...prev,
          photoUrl: data.file_url,
        }));
      } catch (error) {
        console.error("Image upload error:", error);
        if (error.response?.status === 413) {
          toast.error(
            "Image size is too large. Please upload a smaller image)"
          );
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to upload profile image");
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Only include the fields we want to update
      const updateData = {
        phoneNumber: profile.phoneNumber,
        currentRole: profile.currentRole,
        otherRole: profile.otherRole,
        organizationName: profile.organizationName,
        industry: profile.industry,
        city: profile.city,
        photoUrl: profile.photoUrl,
      };

      await axiosInstance.put("/api/updateUser/", updateData);
      onUpdateProfile(profile);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="relative w-24 h-24">
                <Image
                  src={profile.photoUrl || "/test.png"}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
                <input
                  type="file"
                  id="profile-image"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Click the camera icon to update your profile picture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  disabled={true}
                  value={profile.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  disabled={true}
                  value={profile.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label>Current Role</Label>
                <Select
                  value={profile.currentRole}
                  onValueChange={(value) =>
                    handleSelectChange("currentRole", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Working Professional">
                      Working Professional
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  value={profile.organizationName}
                  onChange={handleInputChange}
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <Label>Industry</Label>
                <Select
                  value={profile.industry}
                  onValueChange={(value) =>
                    handleSelectChange("industry", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industrySelectItems.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="otherRole">Other Role (if applicable)</Label>
                <Input
                  id="otherRole"
                  name="otherRole"
                  value={profile.otherRole}
                  onChange={handleInputChange}
                  placeholder="Enter other role"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileModal;
