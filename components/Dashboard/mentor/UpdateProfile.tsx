'use client';
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import axiosInstance from '@/lib/axios';

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  currentRole: string;
  organizationName: string;
  industry: string;
  city: string;
  otherRole: string;
}
import industrySelectItems from '@/lib/registerData';

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
  onUpdateProfile 
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
 
    try {
      // Compare current values with initial values and only include changed fields
      const changedFields = Object.entries(profile).reduce((acc, [key, value]) => {
        if (value !== initialProfile[key as keyof UserProfile]) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<UserProfile>);

      // If no fields were changed, return early
      if (Object.keys(changedFields).length === 0) {
        onClose();
        return;
      }

      await axiosInstance.put('/api/updateUser/', changedFields);

      onUpdateProfile(profile);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
 
      
    <Dialog open={isOpen} onOpenChange={onClose}>
    
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName"
                name="fullName"
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
                onValueChange={(value) => handleSelectChange('currentRole', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Civilian Government">Civilian Government</SelectItem>
                  
                <SelectItem value='Working Professional'>Working Professional</SelectItem>
                <SelectItem value='MVP'>MVP</SelectItem>
                <SelectItem value='Researcher'>Researcher</SelectItem>
                <SelectItem value='Other'>Other</SelectItem>
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
                onValueChange={(value) => handleSelectChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industrySelectItems.map(industry => (
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