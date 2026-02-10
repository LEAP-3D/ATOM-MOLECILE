"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { User, Camera, Save, Shield } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { useUser } from "@clerk/nextjs";

export function ProfileSettingsCard() {
  const { user, isLoaded } = useUser();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [user]);

  if (!isLoaded) return null;
  if (!user) return null;

  const displayName =
    `${firstName} ${lastName}`.trim() ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "User";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await user.update({
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
      });
    } catch (e) {
      console.error("❌ Profile update failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await user.setProfileImage({ file });
    } catch (error) {
      console.error("❌ Image upload failed:", error);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="rounded-xl glass neon-border p-6">
      <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Account Settings
      </h2>

      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          {/* Avatar */}
          {user.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-primary-foreground">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Overlay button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            aria-label="Change profile photo"
          >
            <Camera className="h-6 w-6 text-foreground" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          {isUploading ? "Uploading..." : "Click to change photo"}
        </p>
      </div>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1.5"
          />
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1.5"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            Email
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Verified
            </span>
          </Label>

          <Input
            id="email"
            value={user.primaryEmailAddress?.emailAddress ?? ""}
            disabled
            className="mt-1.5 opacity-60"
          />

          <p className="text-xs text-muted-foreground mt-1">
            Email cannot be changed
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving || isUploading}
          className="w-full bg-linear-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <Save className="h-4 w-4" />
            </motion.div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
