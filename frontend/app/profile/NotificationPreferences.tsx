"use client";
import { useState, useEffect } from "react";
import { addToast } from "@heroui/toast";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

import { fetchPreferences, updatePreferences } from "./actions";

export default function NotificationPreferences() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [frequency, setFrequency] = useState("none");
  const [minSalary, setMinSalary] = useState("");
  const [currency, setCurrency] = useState("PLN");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [preferredWorkMode, setPreferredWorkMode] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchPreferences();

        if (res.success && res.data) {
          setFrequency(res.data.notification_frequency || "none");
          setMinSalary(
            res.data.min_preferred_salary
              ? res.data.min_preferred_salary.toString()
              : "",
          );
          setCurrency(res.data.preferred_currency || "PLN");
          setPreferredLocation(res.data.preferred_location || "");
          setPreferredWorkMode(res.data.preferred_work_mode || "");
        }
      } catch (err) {
        console.error("Failed to fetch preferences", err);
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        notification_frequency: frequency,
        min_preferred_salary: minSalary ? parseFloat(minSalary) : null,
        preferred_currency: currency,
        preferred_location: preferredLocation,
        preferred_working_mode: preferredWorkMode,
      };

      const res = await updatePreferences(body);

      if (res.success) {
        addToast({
          title: "Preferences saved",
          description: "Your notification settings have been updated.",
          color: "success",
        });
      } else {
        addToast({
          title: "Failed to save preferences",
          description: res.message || "Something went wrong.",
          color: "danger",
        });
      }
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return null;

  return (
    <div className="flex flex-col bg-content1 border border-default-200/80 dark:border-default-800/80 shadow-xs rounded-2xl p-6 sm:p-8 gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-foreground">
          Notification Preferences
        </h2>
        <p className="text-sm text-default-500">
          Control how often you receive job matching emails
        </p>
      </div>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1 w-full max-w-xs">
          <h3 className="text-lg font-medium ml-1">Email Frequency</h3>
          <Select
            className="opacity-75"
            label="Frequency"
            selectedKeys={[frequency]}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <SelectItem key="none">Don&apos;t send me emails</SelectItem>
            <SelectItem key="daily">Daily Summary</SelectItem>
            <SelectItem key="weekly">Weekly Summary</SelectItem>
          </Select>
        </div>

        <div className="flex flex-row gap-5">
          <div className="flex flex-col gap-1 w-1/2">
            <h3 className="text-lg font-medium ml-1">Minimum Salary</h3>
            <Input
              className="opacity-75"
              label="Amount"
              name="minSalary"
              placeholder="e.g. 10000"
              type="number"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <h3 className="text-lg font-medium ml-1">Currency</h3>
            <Select
              className="opacity-75"
              label="Currency"
              selectedKeys={[currency]}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <SelectItem key="PLN">PLN</SelectItem>
              <SelectItem key="EUR">EUR</SelectItem>
              <SelectItem key="USD">USD</SelectItem>
              <SelectItem key="GBP">GBP</SelectItem>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full max-w-xs">
          <h3 className="text-lg font-medium ml-1">Preferred Location</h3>
          <Input
            className="opacity-75"
            label="Location"
            placeholder="e.g. Warsaw, Remote"
            value={preferredLocation}
            onChange={(e) => setPreferredLocation(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 w-full max-w-xs">
          <h3 className="text-lg font-medium ml-1">Preferred Work Mode</h3>
          <Select
            className="opacity-75"
            label="Work Mode"
            selectedKeys={[preferredWorkMode]}
            onChange={(e) => setPreferredWorkMode(e.target.value)}
          >
            <SelectItem key="">Select work mode</SelectItem>
            <SelectItem key="on-site">On-site</SelectItem>
            <SelectItem key="remote">Remote</SelectItem>
            <SelectItem key="hybrid">Hybrid</SelectItem>
          </Select>
        </div>

        <button
          className="w-fit self-start px-6 py-2.5 bg-foreground text-background hover:opacity-90 text-sm font-semibold rounded-xl transition-opacity disabled:opacity-50 cursor-pointer shadow-xs"
          disabled={loading}
          type="submit"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}
