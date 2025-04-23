// import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardContent className="space-y-4 p-4">
              <Input placeholder="New Email Address (dummy)" />
              <Input placeholder="New Password (dummy)" type="password" />
              <Button>Change Password</Button>
              <Button variant="outline">Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <span>Profile Visibility</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Enable Email Notifications</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <Switch />
              </div>
              <Input placeholder="Preferred Language (dummy)" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Preferences */}
        <TabsContent value="investments">
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <span>Auto-Reinvest Profits</span>
                <Switch />
              </div>
              <Input placeholder="Preferred Investment Type (dummy)" />
              <Input placeholder="Profit Withdrawal Method (dummy)" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardContent className="space-y-4 p-4">
              <Button>View Login Activity (dummy)</Button>
              <Input placeholder="Set Withdrawal PIN (dummy)" type="password" />
              <Input placeholder="Security Question (dummy)" />
              <div className="flex items-center justify-between">
                <span>Allow Marketing Emails</span>
                <Switch />
              </div>
              <Button variant="outline">Upload KYC Documents (dummy)</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
